'use server'

import { auth } from '@/config/auth'
import { prisma } from '@/db/prisma'
import { calcPrice, convertToPlainObject, formatError } from '@/lib/utils'
import { CartItem } from '@/types'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import routes from '../constants/routes'
import { cartItemSchema, cartSchema } from '../validators'
import { getProductById } from './product.actions'

export const getCart = async () => {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value

    if (!sessionCartId) {
        throw new Error('No cart session found')
    }

    const session = await auth()
    const userId = session?.user?.id ?? undefined

    const cart = await prisma.cart.findFirst({ where: userId ? { userId } : { sessionCartId } })

    if (!cart) {
        return undefined
    }

    return convertToPlainObject({
        ...cart,
        items: cart.items as CartItem[],
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
        itemsPrice: cart.itemsPrice.toString(),
    })
}

/* Add to cart */
export const addToCart = async (data: CartItem) => {
    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value
        if (!sessionCartId) {
            throw new Error('No cart session found')
        }

        const session = await auth()
        const userId = session?.user?.id ?? undefined

        const cart = await getCart()
        const item = cartItemSchema.parse(data)

        const product = await getProductById(item.productId)
        if (!product) {
            throw new Error('Product not found')
        }

        if (!cart) {
            const newCart = cartSchema.parse({
                items: [item],
                userId,
                sessionCartId,
                ...calcPrice([item]),
            })

            await prisma.cart.create({ data: newCart })

            revalidatePath(`${routes.Product}/${item.slug}`)

            return {
                success: true,
                message: 'Product added to cart',
            }
        } else {
            const existingItem = cart.items.find(cartItem => cartItem.productId === item.productId)

            if (existingItem) {
                if (product.stock < existingItem.qty + 1) {
                    throw new Error('Not enough stock')
                }
                cart.items.find(cartItem => cartItem.productId === item.productId)!.qty = existingItem.qty + 1
            } else {
                if (product.stock < 1) {
                    throw new Error('Not enough stock')
                }
                cart.items.push(item)
            }

            await prisma.cart.update({
                where: { id: cart.id },
                data: {
                    items: cart.items,
                    ...calcPrice(cart.items),
                },
            })

            revalidatePath(`${routes.Product}/${product.slug}`)
            return {
                success: true,
                message: `${product.name} ${existingItem ? 'updated in' : 'added to'} cart`,
            }
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        }
    }
}

export const removeFromCart = async (productId: string) => {
    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value
        if (!sessionCartId) {
            throw new Error('No cart session found')
        }

        const product = await getProductById(productId)
        if (!product) {
            throw new Error('Product not found')
        }

        const cart = await getCart()
        if (!cart) {
            throw new Error('Cart not found')
        }

        const cartItem = cart.items.find(item => item.productId === productId)
        if (!cartItem) {
            throw new Error('Cart item not found')
        }

        if (cartItem.qty === 1) {
            cart.items = cart.items.filter(item => item.productId !== cartItem.productId)
        } else {
            cart.items.find(item => item.productId === productId)!.qty = cartItem.qty - 1
        }

        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: cart.items,
                ...calcPrice(cart.items),
            },
        })

        revalidatePath(`${routes.Product}/${product.slug}`)
        return {
            success: true,
            message: `${product.name} removed from cart`,
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        }
    }
}

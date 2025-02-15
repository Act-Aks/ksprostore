'use server'

import { auth } from '@/config/auth'
import { prisma } from '@/db/prisma'
import { PaymentResult } from '@/types'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { PAGE_SIZE } from '../constants'
import routes from '../constants/routes'
import { paypal } from '../paypal'
import { convertToPlainObject, formatError } from '../utils'
import { createOrderSchema } from '../validators'
import { getCart } from './cart.actions'
import { getUserById } from './user.actions'

type SalesData = {
    month: string
    totalSales: number
}[]

export const createOrder = async () => {
    try {
        const session = await auth()
        if (!session?.user) {
            throw new Error('Unauthorized')
        }

        const cart = await getCart()
        const userId = session.user.id
        if (!userId) {
            throw new Error('User not found')
        }

        const user = await getUserById(userId)

        if (!cart || !cart.items.length) {
            return { success: false, message: 'Cart is empty', redirect: routes.Cart }
        }
        if (!user.address) {
            return { success: false, message: 'Shipping address not found', redirect: routes.ShippingAddress }
        }
        if (!user.paymentMethod) {
            return { success: false, message: 'Payment Method not found', redirect: routes.PaymentMethod }
        }

        const order = createOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        })

        const createdOrderId = await prisma.$transaction(async tx => {
            const createdOrder = await tx.order.create({ data: order })
            for (const item of cart.items) {
                await tx.orderItem.create({
                    data: {
                        ...item,
                        orderId: createdOrder.id,
                        price: item.price,
                    },
                })
            }
            await tx.cart.update({
                where: { id: cart.id },
                data: { items: [], shippingPrice: 0, taxPrice: 0, totalPrice: 0, itemsPrice: 0 },
            })

            return createdOrder.id
        })

        if (!createdOrderId) {
            throw new Error('Could not create order')
        }

        return {
            success: true,
            message: 'Ordered successfully',
            redirect: `${routes.Order}/${createdOrderId}`,
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }
        return {
            success: false,
            message: formatError(error),
        }
    }
}

export const getOrderById = async (id: string) => {
    const order = await prisma.order.findFirst({
        where: { id },
        include: {
            orderItems: true,
            user: { select: { name: true, email: true } },
        },
    })
    if (!order) {
        throw new Error('Order not found')
    }
    return convertToPlainObject(order)
}

export const createPaypalOrder = async (orderId: string) => {
    try {
        const order = await prisma.order.findFirst({ where: { id: orderId } })
        if (!order) {
            throw new Error('Order not found')
        }
        const paypalOrder = await paypal.createOrder(Number(order.totalPrice))
        if (!paypalOrder) {
            throw new Error('Could not create paypal order')
        }

        await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentResult: {
                    id: paypalOrder.id,
                    email_address: '',
                    status: '',
                    pricePaid: 0,
                },
            },
        })

        return {
            success: true,
            message: 'Paypal order created successfully',
            data: paypalOrder.id,
        }
    } catch (error) {
        return { success: false, message: formatError(error) }
    }
}

export const approvePaypalOrder = async (orderId: string, data: { orderID: string }) => {
    try {
        const order = await prisma.order.findFirst({ where: { id: orderId } })
        if (!order) {
            throw new Error('Order not found')
        }
        const capturePaymentData = await paypal.capturePayment(data.orderID)
        if (
            !capturePaymentData ||
            capturePaymentData.id !== (order.paymentResult as PaymentResult)?.id ||
            capturePaymentData.status !== 'COMPLETED'
        ) {
            throw new Error('Could not complete payment for order')
        }

        await updateOrderToPaid({
            orderId,
            paymentResult: {
                id: capturePaymentData.id,
                status: capturePaymentData.status,
                email_address: capturePaymentData.payer.email_address,
                pricePaid: capturePaymentData.purchase_units?.[0]?.payments.captures?.[0]?.amount?.value,
            },
        })

        revalidatePath(`${routes.Order}/${orderId}`)

        return { success: true, message: 'Order payment successfull' }
    } catch (error) {
        return { success: false, message: formatError(error) }
    }
}

const updateOrderToPaid = async ({ orderId, paymentResult }: { orderId: string; paymentResult: PaymentResult }) => {
    const order = await prisma.order.findFirst({
        where: { id: orderId },
        include: { orderItems: true },
    })
    if (!order) {
        throw new Error('Order not found!')
    }
    if (order.isPaid) {
        throw new Error('Order is already paid!')
    }

    await prisma.$transaction(async tx => {
        for (const item of order.orderItems) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { increment: -item.qty } },
            })
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { isPaid: true, paidAt: new Date(), paymentResult },
        })
    })

    const updatedOrder = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderItems: true,
            user: { select: { name: true, email: true } },
        },
    })
    if (!updatedOrder) {
        throw new Error('Order not found!')
    }
    return updatedOrder
}

export const getOrders = async ({ limit = PAGE_SIZE, page }: { limit?: number; page: number }) => {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
        throw new Error('Unauthorized')
    }

    const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
    })
    const ordersCount = await prisma.order.count({ where: { userId } })

    return {
        data: orders,
        totalPages: Math.ceil(ordersCount / limit),
    }
}

export const getOrderSummary = async () => {
    const ordersCount = await prisma.order.count()
    const productsCount = await prisma.product.count()
    const usersCount = await prisma.user.count()

    const totalSales = await prisma.order.aggregate({ _sum: { totalPrice: true } })

    const salesDataRaw = await prisma.$queryRaw<
        Array<{ month: string; totalSales: Prisma.Decimal }>
    >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`

    const salesData: SalesData = salesDataRaw.map(item => ({
        month: item.month,
        totalSales: Number(item.totalSales),
    }))

    const latestSales = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true } },
        },
        take: 6,
    })

    return {
        ordersCount,
        productsCount,
        usersCount,
        latestSales,
        totalSales,
        salesData,
    }
}

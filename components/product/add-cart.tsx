'use client'

import RenderIf from '@/components/common/conditional-render'
import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'
import { addToCart, removeFromCart } from '@/lib/actions/cart.actions'
import routes from '@/lib/constants/routes'
import { Cart, CartItem } from '@/types'
import { Loader, Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

interface AddCartProps {
    item: CartItem
    cart?: Cart
}

const AddCart: React.FC<AddCartProps> = ({ item, cart }) => {
    const router = useRouter()
    const { toast } = useToast()

    const [isTransitioning, startTransition] = useTransition()

    const handleAddToCart = async () => {
        startTransition(async () => {
            const res = await addToCart(item)

            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message,
                })
                return
            }

            toast({
                description: res.message,
                action: (
                    <ToastAction
                        className={'bg-primary text-white hover:bg-gray-800'}
                        altText={'Go to cart'}
                        onClick={() => router.push(routes.Cart)}
                    >
                        Go to cart
                    </ToastAction>
                ),
            })
        })
    }

    const handleRemoveFromCart = async () => {
        startTransition(async () => {
            const res = await removeFromCart(item.productId)
            toast({
                variant: res.success ? 'default' : 'destructive',
                description: res.message,
            })
            return
        })
    }

    const existingCartItem = cart?.items.find(cartItem => cartItem.productId === item.productId)

    return existingCartItem ? (
        <div>
            <Button type={'button'} variant={'outline'} disabled={isTransitioning} onClick={handleRemoveFromCart}>
                <RenderIf
                    condition={isTransitioning}
                    then={<Loader className={'w-4 h-4 animate-spin'} />}
                    otherwise={<Minus className={'h-4 w-4'} />}
                />
            </Button>
            <span className={'px-2'}>{existingCartItem.qty}</span>
            <Button type={'button'} variant={'outline'} disabled={isTransitioning} onClick={handleAddToCart}>
                <RenderIf
                    condition={isTransitioning}
                    then={<Loader className={'w-4 h-4 animate-spin'} />}
                    otherwise={<Plus className={'h-4 w-4'} />}
                />
            </Button>
        </div>
    ) : (
        <Button className={'w-full'} type={'button'} disabled={isTransitioning} onClick={handleAddToCart}>
            <RenderIf
                condition={isTransitioning}
                then={<Loader className={'w-4 h-4 animate-spin'} />}
                otherwise={<Plus className={'h-4 w-4'} />}
            />{' '}
            Add To Cart
        </Button>
    )
}

export default AddCart

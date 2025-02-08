'use client'

import RenderIf from '@/components/common/conditional-render'
import ForEach from '@/components/common/for-each'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { addToCart, removeFromCart } from '@/lib/actions/cart.actions'
import routes from '@/lib/constants/routes'
import { formatCurrency } from '@/lib/utils'
import { Cart, CartItem } from '@/types'
import { ArrowRight, Loader, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

interface CartTableProps {
    cart: Cart
}

const CartTable: React.FC<CartTableProps> = ({ cart }) => {
    const router = useRouter()
    const { toast } = useToast()

    const [isTransitioning, startTransition] = useTransition()

    const handleRemoveFromCart = (productId: string) => () =>
        startTransition(async () => {
            const res = await removeFromCart(productId)
            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message,
                })
                return
            }
        })

    const handleAddToCart = (item: CartItem) => () =>
        startTransition(async () => {
            const res = await addToCart(item)
            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message,
                })
                return
            }
        })

    const handleShipping = () =>
        startTransition(() => {
            router.push(routes.ShippingAddress)
        })

    return (
        <>
            <h1 className={'py-4 h2-bold'}>Cart</h1>
            <RenderIf
                condition={!cart || cart.items.length < 1}
                then={
                    <div>
                        Cart is empty. <Link href={routes.Home}>Continue Shopping</Link>
                    </div>
                }
                otherwise={
                    <div className={'grid md:grid-cols-4 md:gap-5'}>
                        <div className={'overflow-x-auto md:col-span-3'}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead className={'text-center'}>Quantity</TableHead>
                                        <TableHead className={'text-right'}>Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <ForEach
                                        of={cart.items}
                                        render={cartItem => (
                                            <TableRow key={cartItem.slug}>
                                                <TableCell>
                                                    <Link
                                                        className={'flex items-center'}
                                                        href={`${routes.Product}/${cartItem.slug}`}
                                                    >
                                                        <Image
                                                            src={cartItem.image}
                                                            alt={cartItem.name}
                                                            height={50}
                                                            width={50}
                                                        />
                                                        <span className={'px-2'}>{cartItem.name}</span>
                                                    </Link>
                                                </TableCell>
                                                <TableCell className={'flex-center gap-2'}>
                                                    <Button
                                                        disabled={isTransitioning}
                                                        variant={'outline'}
                                                        type={'button'}
                                                        onClick={handleRemoveFromCart(cartItem.productId)}
                                                    >
                                                        <RenderIf
                                                            condition={isTransitioning}
                                                            then={<Loader className={'w-4 h-4 animate-spin'} />}
                                                            otherwise={<Minus className={'w-4 h-4'} />}
                                                        />
                                                    </Button>
                                                    <span>{cartItem.qty}</span>
                                                    <Button
                                                        disabled={isTransitioning}
                                                        variant={'outline'}
                                                        type={'button'}
                                                        onClick={handleAddToCart(cartItem)}
                                                    >
                                                        <RenderIf
                                                            condition={isTransitioning}
                                                            then={<Loader className={'w-4 h-4 animate-spin'} />}
                                                            otherwise={<Plus className={'w-4 h-4'} />}
                                                        />
                                                    </Button>
                                                </TableCell>
                                                <TableCell className={'text-right'}>&#8377;{cartItem.price}</TableCell>
                                            </TableRow>
                                        )}
                                    />
                                </TableBody>
                            </Table>
                        </div>
                        <Card>
                            <CardContent className={'p-4 gap-4'}>
                                <div className={'pb-3 text-xl'}>
                                    Sub Total ({cart.items.reduce((acc, item) => acc + item.qty, 0)})
                                    <span className={'font-bold'}>{formatCurrency(cart.itemsPrice)}</span>
                                </div>
                                <Button className={'w-full'} disabled={isTransitioning} onClick={handleShipping}>
                                    <RenderIf
                                        condition={isTransitioning}
                                        then={<Loader className={'w-4 h-4 animate-spin'} />}
                                        otherwise={<ArrowRight className={'w-4 h-4'} />}
                                    />
                                    Proceed to Checkout
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                }
            />
        </>
    )
}

export default CartTable

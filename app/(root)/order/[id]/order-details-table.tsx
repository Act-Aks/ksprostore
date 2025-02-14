'use client'

import RenderIf from '@/components/common/conditional-render'
import ForEach from '@/components/common/for-each'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { approvePaypalOrder, createPaypalOrder } from '@/lib/actions/order.actions'
import { PaymentMethods } from '@/lib/constants'
import routes from '@/lib/constants/routes'
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils'
import { Order } from '@/types'
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import Image from 'next/image'
import Link from 'next/link'
import { ComponentProps } from 'react'

interface OrderDetailsTableProps {
    order: Order
    paypalClientId: string
}

const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer()

    if (isPending) {
        return 'Loading Paypal...'
    }
    if (isRejected) {
        return 'Error Loading Paypal'
    }
    return ''
}

const OrderDetailsTable: React.FC<OrderDetailsTableProps> = ({
    order: {
        id,
        paymentMethod,
        isPaid,
        paidAt,
        isDelivered,
        deliveredAt,
        shippingAddress,
        orderItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
    },
    paypalClientId,
}) => {
    const { toast } = useToast()

    const handleCreatePaypalOrder: ComponentProps<typeof PayPalButtons>['createOrder'] = async () => {
        const res = await createPaypalOrder(id)
        if (!res.success) {
            toast({
                variant: 'destructive',
                description: res.message,
            })
        }

        return res.data
    }

    const handleApprovePaypalOrder: ComponentProps<typeof PayPalButtons>['onApprove'] = async (data: {
        orderID: string
    }) => {
        const res = await approvePaypalOrder(id, data)
        toast({
            variant: !res.success ? 'destructive' : 'default',
            description: res.message,
        })
    }

    return (
        <>
            <h1 className={'py-4 text-2xl'}>Order: {formatId(id)}</h1>
            <div className={'grid md:grid-cols-3 md:gap-5'}>
                <div className={'col-span-2 space-y-4 overflow-x-auto'}>
                    <Card>
                        <CardContent className={'p-4 gap-4'}>
                            <h2 className={'text-4xl pb-4'}>Payment Method</h2>
                            <p className={'mb-2'}>{paymentMethod}</p>
                            <RenderIf
                                condition={isPaid}
                                then={<Badge variant={'secondary'}>Paid at {formatDateTime(paidAt!).dateTime}</Badge>}
                                otherwise={<Badge variant={'destructive'}>Not Paid</Badge>}
                            />
                        </CardContent>
                    </Card>
                    <Card className={'my-2'}>
                        <CardContent className={'p-4 gap-4'}>
                            <h2 className={'text-4xl pb-4'}>Shipping Address</h2>
                            <p>{shippingAddress.fullName}</p>
                            <p className={'mb-2'}>
                                {shippingAddress.streetAddress}, {shippingAddress.city}
                                {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                            <RenderIf
                                condition={isDelivered}
                                then={
                                    <Badge variant={'secondary'}>
                                        Delivered at {formatDateTime(deliveredAt!).dateTime}
                                    </Badge>
                                }
                                otherwise={<Badge variant={'destructive'}>Not Delivered</Badge>}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className={'p-4 gap-4'}>
                            <h2 className={'text-4xl pb-4'}>Order Items</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <ForEach
                                        of={orderItems}
                                        render={item => (
                                            <TableRow key={item.slug}>
                                                <TableCell>
                                                    <Link
                                                        href={`${routes.Product}/${item.slug}`}
                                                        className={'flex items-center'}
                                                    >
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            height={50}
                                                            width={50}
                                                        />
                                                        <span className={'px-2'}>{item.name}</span>
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={'px-2'}>{item.qty}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={'text-right'}>{item.price}</span>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    />
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardContent className={'p-4 gap-4 space-y-4'}>
                            <div className={'flex justify-between'}>
                                <div>Items</div>
                                <div>{formatCurrency(itemsPrice)}</div>
                            </div>
                            <div className={'flex justify-between'}>
                                <div>Tax</div>
                                <div>{formatCurrency(taxPrice)}</div>
                            </div>
                            <div className={'flex justify-between'}>
                                <div>Shipping</div>
                                <div>{formatCurrency(shippingPrice)}</div>
                            </div>
                            <div className={'flex justify-between'}>
                                <div>Total</div>
                                <div>{formatCurrency(totalPrice)}</div>
                            </div>
                            {/* Paypal Payment */}
                            <RenderIf
                                condition={!isPaid && paymentMethod === PaymentMethods.PAYPAL}
                                then={
                                    <div>
                                        <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                                            <PrintLoadingState />
                                            <PayPalButtons
                                                createOrder={handleCreatePaypalOrder}
                                                onApprove={handleApprovePaypalOrder}
                                            />
                                        </PayPalScriptProvider>
                                    </div>
                                }
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default OrderDetailsTable

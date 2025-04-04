import RenderIf from '@/components/common/conditional-render'
import ForEach from '@/components/common/for-each'
import Pagination from '@/components/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getOrders } from '@/lib/actions/order.actions'
import routes from '@/lib/constants/routes'
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'My Orders',
    description: 'List of orders',
}

interface OrdersProps {
    searchParams: Promise<{ page: string }>
}

const Orders = async ({ searchParams }: OrdersProps) => {
    const { page } = await searchParams

    const orders = await getOrders({ page: Number(page) || 1 })

    return (
        <div className={'space-y-2'}>
            <h2 className={'h2-bold'}>Orders</h2>
            <div className={'overflow-x-auto'}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>DATE</TableHead>
                            <TableHead>TOTAL</TableHead>
                            <TableHead>PAID</TableHead>
                            <TableHead>DELIVERED</TableHead>
                            <TableHead>ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <ForEach
                            of={orders.data}
                            render={order => (
                                <TableRow key={order.id}>
                                    <TableCell>{formatId(order.id)}</TableCell>
                                    <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
                                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                                    <TableCell>
                                        <RenderIf
                                            condition={order.isPaid && !!order.paidAt}
                                            then={formatDateTime(order.paidAt!).dateTime}
                                            otherwise={'Not Paid'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <RenderIf
                                            condition={order.isPaid && !!order.deliveredAt}
                                            then={formatDateTime(order.deliveredAt!).dateTime}
                                            otherwise={'Not Delivered'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`${routes.Order}/${order.id}`} className={'pgr'}>
                                            <span className={'px-2'}>Details</span>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            )}
                        />
                    </TableBody>
                </Table>
                <RenderIf
                    condition={orders.totalPages > 1}
                    then={<Pagination total={orders.totalPages} page={Number(page) || 1} />}
                />
            </div>
        </div>
    )
}

export default Orders

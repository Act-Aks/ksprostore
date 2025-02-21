import RenderIf from '@/components/common/conditional-render'
import ForEach from '@/components/common/for-each'
import Pagination from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getAllOrders } from '@/lib/actions/order.actions'
import routes from '@/lib/constants/routes'
import { formatId, formatDateTime, formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export const metadata = {
    title: 'Admin Orders',
    description: 'All Orders ',
}

interface AdminOrdersProps {
    searchParams: Promise<{ page: string }>
}

const AdminOrders: React.FC<AdminOrdersProps> = async ({ searchParams }) => {
    const { page = '1' } = await searchParams

    const allOrders = await getAllOrders({ page: Number(page) })
    if (!allOrders) {
        return <div>No orders found</div>
    }

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
                            of={allOrders.data}
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
                                        <Button asChild variant={'outline'} size={'sm'}>
                                            <Link href={`${routes.Order}/${order.id}`} className={'pgr'}>
                                                Details
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        />
                    </TableBody>
                </Table>
                <RenderIf
                    condition={allOrders.totalPages > 1}
                    then={<Pagination total={allOrders.totalPages} page={Number(page) || 1} />}
                />
            </div>
        </div>
    )
}

export default AdminOrders

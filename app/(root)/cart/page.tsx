import { getCart } from '@/lib/actions/cart.actions'
import routes from '@/lib/constants/routes'
import { Metadata } from 'next'
import Link from 'next/link'
import CartTable from './cart-table'

export const metadata: Metadata = {
    title: 'Cart',
}

const Cart = async () => {
    const cart = await getCart()

    if (!cart || !cart.items.length) {
        return (
            <div>
                Cart is empty. <Link href={routes.Home}> Continue Shopping</Link>
            </div>
        )
    }

    return <CartTable cart={cart} />
}

export default Cart

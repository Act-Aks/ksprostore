import { getCart } from '@/lib/actions/cart.actions'
import { Metadata } from 'next'
import CartTable from './cart-table'

export const metadata: Metadata = {
    title: 'Cart',
}

const Cart = async () => {
    const cart = await getCart()
    if (!cart) return null

    return (
        <>
            <CartTable cart={cart} />
        </>
    )
}

export default Cart

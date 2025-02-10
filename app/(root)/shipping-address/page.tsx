import CheckoutSteps from '@/components/shared/checkout-steps'
import { auth } from '@/config/auth'
import { getCart } from '@/lib/actions/cart.actions'
import { getUserById } from '@/lib/actions/user.actions'
import routes from '@/lib/constants/routes'
import type { ShippingAddress as TShippingAddress } from '@/types'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import ShippingAddressForm from './shipping-address-form'

export const metadata: Metadata = {
    title: 'Shipping Address',
    description: 'Shipping Address',
}

const ShippingAddress = async () => {
    const cart = await getCart()
    if (!cart || !cart.items.length) {
        return redirect(routes.Cart)
    }

    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
        throw new Error('No User ID')
    }

    const user = await getUserById(userId)
    if (!user) {
        throw new Error('Unauthorized')
    }

    return (
        <>
            <CheckoutSteps currentStep={1} />
            <ShippingAddressForm address={user.address as TShippingAddress} />
        </>
    )
}

export default ShippingAddress

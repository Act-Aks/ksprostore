import CheckoutSteps from '@/components/shared/checkout-steps'
import { auth } from '@/config/auth'
import { getUserById } from '@/lib/actions/user.actions'
import { Metadata } from 'next'
import PaymentMethodForm from './payment-method-form'

export const metadata: Metadata = {
    title: 'Select Payment Method',
    description: 'Select Payment Method',
}

const PaymentMethod = async () => {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
        throw new Error('Unauthorized')
    }

    const user = await getUserById(userId)
    if (!user) {
        throw new Error('User not found')
    }

    return (
        <>
            <CheckoutSteps currentStep={2} />
            <PaymentMethodForm paymentMethod={user.paymentMethod} />
        </>
    )
}

export default PaymentMethod

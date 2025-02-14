'use client'

import RenderIf from '@/components/common/conditional-render'
import { Button } from '@/components/ui/button'
import { createOrder } from '@/lib/actions/order.actions'
import { Check, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'

const PlaceOrderButton = () => {
    const { pending } = useFormStatus()

    return (
        <Button disabled={pending} className={'w-full'}>
            <RenderIf
                condition={pending}
                then={<Loader className={'loader'} />}
                otherwise={<Check className={'w-4 h-4'} />}
            />{' '}
            Place Order
        </Button>
    )
}

const PlaceOrderForm = () => {
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        const res = await createOrder()
        if (res.redirect) {
            return router.push(res.redirect)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <PlaceOrderButton />
        </form>
    )
}

export default PlaceOrderForm

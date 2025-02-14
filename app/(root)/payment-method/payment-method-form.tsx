'use client'

import RenderIf from '@/components/common/conditional-render'
import ForEach from '@/components/common/for-each'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { updateUserPaymentMethod } from '@/lib/actions/user.actions'
import { DEFAULT_PAYMENT_METHOD, PaymentMethods } from '@/lib/constants'
import routes from '@/lib/constants/routes'
import { paymentMethodSchema } from '@/lib/validators'
import { PaymentMethod } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'

interface PaymentMethodFormProps {
    paymentMethod: string | null
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ paymentMethod }) => {
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<PaymentMethod>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: { type: paymentMethod || DEFAULT_PAYMENT_METHOD },
    })

    const [isTransitioning, startTransition] = useTransition()

    const onSubmit = form.handleSubmit(async values =>
        startTransition(async () => {
            const res = await updateUserPaymentMethod(values)
            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message,
                })
                return
            }
            router.push(routes.PlaceOrder)
        }),
    )

    return (
        <>
            <div className={'max-w-md mx-auto space-y-4'}>
                <h1 className={'h2-bold mt-4'}>Payment Method</h1>
                <p className={'text-sm text-muted-foreground'}>Please provide your payment Method.</p>
                <Form {...form}>
                    <form method={'post'} className={'space-y-4'} onSubmit={onSubmit}>
                        <div className={'flex flex-col md:flex-row gap-5'}>
                            <FormField
                                control={form.control}
                                name={'type'}
                                render={({ field }) => (
                                    <FormItem className={'space-y-3'}>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                className={'flex flex-col space-y-2'}
                                            >
                                                <ForEach
                                                    of={Object.values(PaymentMethods)}
                                                    render={pm => (
                                                        <FormItem
                                                            key={pm}
                                                            className={'flex items-center space-x-3 space-y-0'}
                                                        >
                                                            <FormControl>
                                                                <RadioGroupItem
                                                                    value={pm}
                                                                    checked={field.value === pm}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className={'font-normal'}>{pm}</FormLabel>
                                                        </FormItem>
                                                    )}
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className={'flex gap-2'}>
                            <Button type={'submit'} disabled={isTransitioning}>
                                <RenderIf
                                    condition={isTransitioning}
                                    then={<Loader className={'loader'} />}
                                    otherwise={<ArrowRight className={'w-4 h-4'} />}
                                />{' '}
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default PaymentMethodForm

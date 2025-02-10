'use client'

import RenderIf from '@/components/common/conditional-render'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { updateUserAddress } from '@/lib/actions/user.actions'
import { shippingAddressDefaultValues } from '@/lib/constants/misc'
import routes from '@/lib/constants/routes'
import { shippingAddressSchema } from '@/lib/validators'
import { ShippingAddress } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'

interface ShippingAddressFormProps {
    address: ShippingAddress
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({ address }) => {
    const router = useRouter()
    const { toast } = useToast()

    const [isTransitioning, startTransition] = useTransition()

    const form = useForm<TypeOf<typeof shippingAddressSchema>>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: address || shippingAddressDefaultValues,
    })

    const onSubmit = form.handleSubmit(async values => {
        startTransition(async () => {
            const res = await updateUserAddress(values)
            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message,
                })
                return
            }
            router.push(routes.PaymentMethod)
        })
    })

    return (
        <>
            <div className={'max-w-md mx-auto space-y-4'}>
                <h1 className={'h2-bold mt-4'}>Shipping Address</h1>
                <p className={'text-sm text-muted-foreground'}>Please provide your shipping address.</p>
                <Form {...form}>
                    <form method={'post'} className={'space-y-4'} onSubmit={onSubmit}>
                        <div className={'flex flex-col md:flex-row gap-5'}>
                            <FormField
                                control={form.control}
                                name={'fullName'}
                                render={({ field }) => (
                                    <FormItem className={'w-full'}>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder={'Enter Full Name'} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className={'flex flex-col md:flex-row gap-5'}>
                            <FormField
                                control={form.control}
                                name={'streetAddress'}
                                render={({ field }) => (
                                    <FormItem className={'w-full'}>
                                        <FormLabel>Street Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder={'Enter Street Address'} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className={'flex flex-col md:flex-row gap-5'}>
                            <FormField
                                control={form.control}
                                name={'city'}
                                render={({ field }) => (
                                    <FormItem className={'w-full'}>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input placeholder={'Enter City'} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className={'flex flex-col md:flex-row gap-5'}>
                            <FormField
                                control={form.control}
                                name={'postalCode'}
                                render={({ field }) => (
                                    <FormItem className={'w-full'}>
                                        <FormLabel>Postal Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder={'Enter Postal Code'} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className={'flex flex-col md:flex-row gap-5'}>
                            <FormField
                                control={form.control}
                                name={'country'}
                                render={({ field }) => (
                                    <FormItem className={'w-full'}>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input placeholder={'Enter Country'} {...field} />
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

export default ShippingAddressForm

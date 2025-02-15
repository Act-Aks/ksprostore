'use client'

import RenderIf from '@/components/common/conditional-render'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { updateProfile } from '@/lib/actions/user.actions'
import { updateProfileSchema } from '@/lib/validators'
import { UpadateProfile } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'

const UpdateProfileForm = () => {
    const { data: session, update } = useSession()
    const { toast } = useToast()

    const form = useForm<UpadateProfile>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: session?.user?.name || '',
            email: session?.user?.email || '',
        },
    })

    const onSubmit = form.handleSubmit(async data => {
        const res = await updateProfile(data)

        if (!res.success) {
            toast({ variant: 'destructive', description: res.message })
            return
        }

        const newSession = {
            ...session,
            user: {
                ...session?.user,
                name: data.name,
            },
        }

        await update(newSession)

        toast({ description: res.message })
    })

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className={'flex flex-col gap-5'}>
                <div className={'flex flex-col gap-5'}>
                    <FormField
                        control={form.control}
                        name={'email'}
                        render={({ field }) => (
                            <FormItem className={'w-full'}>
                                <FormControl>
                                    <Input disabled placeholder={'Email'} className={'input-field'} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={'name'}
                        render={({ field }) => (
                            <FormItem className={'w-full'}>
                                <FormControl>
                                    <Input placeholder={'Name'} className={'input-field'} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    type={'submit'}
                    className={'button col-span-2 w-full'}
                    size={'lg'}
                    disabled={form.formState.isSubmitting || !form.formState.isDirty}
                >
                    <RenderIf
                        condition={form.formState.isSubmitting}
                        then={
                            <>
                                <Loader className={'loader'} />
                                {'Updating Profile...'}
                            </>
                        }
                        otherwise={<>{'Update Profile'}</>}
                    />
                </Button>
            </form>
        </Form>
    )
}

export default UpdateProfileForm

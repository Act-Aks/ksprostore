'use client'

import RenderIf from '@/components/common/conditional-render'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUpUser } from '@/lib/actions/user.actions'
import { signUpDefaultValues } from '@/lib/constants/misc'
import routes from '@/lib/constants/routes'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

const SignUpButton = () => {
    const { pending } = useFormStatus()

    return (
        <Button className={'w-full'} disabled={pending}>
            {pending ? 'Signing Up...' : 'Sign Up'}
        </Button>
    )
}

const SignUpForm = () => {
    const [data, action] = useActionState(signUpUser, {
        success: false,
        message: '',
    })
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || routes.Home

    return (
        <form action={action}>
            <input type={'hidden'} name={'callbackUrl'} value={callbackUrl} />
            <div className={'space-y-6'}>
                <div>
                    <Label htmlFor={'name'}>Name</Label>
                    <Input
                        id={'name'}
                        name={'name'}
                        type={'text'}
                        autoComplete={'name'}
                        required
                        defaultValue={signUpDefaultValues.name}
                    />
                </div>
                <div>
                    <Label htmlFor={'email'}>Email</Label>
                    <Input
                        id={'email'}
                        name={'email'}
                        type={'email'}
                        autoComplete={'email'}
                        required
                        defaultValue={signUpDefaultValues.email}
                    />
                </div>
                <div>
                    <Label htmlFor={'password'}>Password</Label>
                    <Input
                        id={'password'}
                        name={'password'}
                        type={'password'}
                        autoComplete={'password'}
                        required
                        defaultValue={signUpDefaultValues.password}
                    />
                </div>
                <div>
                    <Label htmlFor={'confirmPassword'}>Confirm Password</Label>
                    <Input
                        id={'confirmPassword'}
                        name={'confirmPassword'}
                        type={'password'}
                        autoComplete={'confirmPassword'}
                        required
                        defaultValue={signUpDefaultValues.confirmPassword}
                    />
                </div>
                <div>
                    <SignUpButton />
                </div>

                <RenderIf
                    condition={data && !data.success}
                    then={<div className={'text-center text-destructive'}>{data.message}</div>}
                />

                <div className={'text-sm text-center text-muted-foreground'}>
                    Already have an account?{' '}
                    <Link href={routes.SignIn} target={'_self'} className={'link'}>
                        Sign In
                    </Link>
                </div>
            </div>
        </form>
    )
}

export default SignUpForm

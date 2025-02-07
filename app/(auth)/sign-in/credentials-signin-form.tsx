'use client'

import RenderIf from '@/components/common/conditional-render'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInWithCredentials } from '@/lib/actions/user.actions'
import { defaultEmailAndPassword } from '@/lib/constants/misc'
import routes from '@/lib/constants/routes'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

const SignInButton = () => {
    const { pending } = useFormStatus()

    return (
        <Button className={'w-full'} disabled={pending}>
            {pending ? 'Signing In...' : 'Sign In'}
        </Button>
    )
}

const CredentialsSignInForm = () => {
    const [data, action] = useActionState(signInWithCredentials, {
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
                    <Label htmlFor={'email'}>Email</Label>
                    <Input
                        id={'email'}
                        name={'email'}
                        type={'email'}
                        autoComplete={'email'}
                        required
                        defaultValue={defaultEmailAndPassword.email}
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
                        defaultValue={defaultEmailAndPassword.password}
                    />
                </div>
                <div>
                    <SignInButton />
                </div>

                <RenderIf
                    condition={data && !data.success}
                    then={<div className={'text-center text-destructive'}>{data.message}</div>}
                />

                <div className={'text-sm text-center text-muted-foreground'}>
                    Don&apos;t have an account?{' '}
                    <Link href={routes.SignUp} target={'_self'} className={'link'}>
                        Sign Up
                    </Link>
                </div>
            </div>
        </form>
    )
}

export default CredentialsSignInForm

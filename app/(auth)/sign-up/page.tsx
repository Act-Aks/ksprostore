import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/config/auth'
import { APP_NAME } from '@/lib/constants'
import routes from '@/lib/constants/routes'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import SignUpForm from './sign-up-form'

export const metadata: Metadata = {
    title: 'Sign Up',
}

interface SignUpProps {
    searchParams: Promise<{ callbackUrl: string }>
}

const SignUp = async (props: SignUpProps) => {
    const { callbackUrl } = await props.searchParams
    const session = await auth()

    if (session) {
        return redirect(callbackUrl || routes.Home)
    }

    return (
        <div className={'w-full max-w-md mx-auto shadow-2xl'}>
            <Card>
                <CardHeader className={'space-y-4'}>
                    <Link href={routes.Home} className={'flex-center'}>
                        <Image src={'/images/logo.svg'} alt={`${APP_NAME}-logo`} height={100} width={100} priority />
                    </Link>
                    <CardTitle className={'text-center'}>Create Account</CardTitle>
                    <CardDescription className={'text-center'}>
                        Enter your details below to create an account.
                    </CardDescription>
                </CardHeader>
                <CardContent className={'space-y-4'}>
                    <SignUpForm />
                </CardContent>
            </Card>
        </div>
    )
}

export default SignUp

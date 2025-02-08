import { PropsWithChildren } from 'react'

const AuthLayout = ({ children }: PropsWithChildren) => {
    return <div className={'flex-center min-h-screen w-full bg-[url("/images/logo.svg")] bg-center'}>{children}</div>
}

export default AuthLayout

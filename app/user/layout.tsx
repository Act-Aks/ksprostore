import Menu from '@/components/shared/header/menu'
import { APP_NAME } from '@/lib/constants'
import routes from '@/lib/constants/routes'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import MainNav from './main-nav'

export const metadata: Metadata = {
    title: 'User Profile',
}

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className={'flex flex-col'}>
            <div className={'border-b container mx-auto'}>
                <div className={'flex items-center h-16 px-4'}>
                    <Link href={routes.Home} className={'w-22'}>
                        <Image src={'/images/logo.svg'} alt={APP_NAME} height={48} width={48} />
                    </Link>
                    <MainNav className={'mx-6'} />
                    <div className={'flex items-center ml-auto space-x-4'}>
                        <Menu />
                    </div>
                </div>
            </div>
            <div className={'flex-1 space-y-4 pt-6 container mx-auto'}>{children}</div>
        </div>
    )
}

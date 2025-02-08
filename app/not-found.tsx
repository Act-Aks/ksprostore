'use client'

import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'
import routes from '@/lib/constants/routes'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const NotFoundPage = () => {
    const router = useRouter()

    return (
        <div className={'flex flex-col items-center justify-center min-h-screen'}>
            <Image src={'/images/logo.svg'} alt={`${APP_NAME}-logo`} height={48} width={48} priority />
            <div className={'w-1/3 p-6 rounded-lg shadow-md text-center'}>
                <h1 className='font-bold text-3xl mb-4'>Not Found</h1>
                <p className='text-destructive'>Could not find the requested page</p>
                <Button variant={'outline'} className={'mt-4 ml-2'} onClick={() => router.replace(routes.Home)}>
                    Back To Home
                </Button>
            </div>
        </div>
    )
}

export default NotFoundPage

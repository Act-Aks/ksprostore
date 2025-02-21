import loader from '@/assets/loader.gif'
import Image from 'next/image'

const LoadingPage = () => {
    return (
        <div className='flex h-100vh w-full justify-center items-center backdrop-blur-md dark:bg-black/30 bg-white/30 fixed inset-0'>
            <Image src={loader} height={120} width={120} alt='loading' />
        </div>
    )
}

export default LoadingPage

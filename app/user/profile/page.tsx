import { auth } from '@/config/auth'
import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import UpdateProfileForm from './update-profile-form'

export const metadata: Metadata = {
    title: 'Profile',
    description: 'Update your profile',
}

const Profile = async () => {
    const session = await auth()

    return (
        <SessionProvider session={session}>
            <div className={'max-w-md mx-auto space-y-4'}>
                <h2 className={'h2-bold'}>Profile</h2>
                {session?.user?.name}
                <UpdateProfileForm />
            </div>
        </SessionProvider>
    )
}

export default Profile

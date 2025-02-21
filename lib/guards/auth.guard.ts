import { auth } from '@/config/auth'
import { redirect } from 'next/navigation'
import routes from '@/lib/constants/routes'

export const requireAdmin = async () => {
    const session = await auth()
    if (session?.user?.role !== 'admin') {
        return redirect(routes.Unauthorized)
    }

    return session
}

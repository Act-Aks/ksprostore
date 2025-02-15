import { adminRoutes } from '@/lib/constants/routes'
import { redirect } from 'next/navigation'

const Admin = () => {
    return redirect(adminRoutes.Overview)
}

export default Admin

import { adminRoutes } from '@/lib/constants/routes'
import { requireAdmin } from '@/lib/guards/auth.guard'
import { redirect } from 'next/navigation'

const Admin = async () => {
    await requireAdmin()
    return redirect(adminRoutes.Overview)
}

export default Admin

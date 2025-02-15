import RenderIf from '@/components/common/conditional-render'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { auth } from '@/config/auth'
import { signOutUser } from '@/lib/actions/user.actions'
import routes, { adminRoutes } from '@/lib/constants/routes'
import { UserIcon } from 'lucide-react'
import Link from 'next/link'

const User = async () => {
    const session = await auth()

    if (!session) {
        return (
            <Button asChild>
                <Link href={routes.SignIn}>
                    <UserIcon /> Sign In
                </Link>
            </Button>
        )
    }

    const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? ''

    return (
        <div className={'flex gap-2 items-center'}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className={'flex item-center'}>
                        <Button
                            variant={'ghost'}
                            className={
                                'relative w-8 h-8 rounded-full ml-2 flex justify-center items-center bg-gray-200'
                            }
                        >
                            {firstInitial}
                        </Button>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={'w-56'} align={'end'} forceMount>
                    <DropdownMenuLabel className={'font-normal'}>
                        <div className={'flex flex-col space-y-1'}>
                            <div className='text-sm font-medium leading-none'>{session.user?.name}</div>
                            <div className='text-sm text-muted-foreground leading-none'>{session.user?.email}</div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem>
                        <Link href={routes.Profile} className={'w-full'}>
                            User Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href={routes.Orders} className={'w-full'}>
                            Order History
                        </Link>
                    </DropdownMenuItem>

                    <RenderIf
                        condition={session?.user?.role === 'admin'}
                        then={
                            <DropdownMenuItem>
                                <Link href={adminRoutes.Overview} className={'w-full'}>
                                    Admin
                                </Link>
                            </DropdownMenuItem>
                        }
                    />
                    <DropdownMenuItem className={'p-0 mb-1'}>
                        <form action={signOutUser} className={'w-full'}>
                            <Button className={'w-full py-4 px-2 h-4 justify-center'} variant={'ghost'}>
                                Sign Out
                            </Button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default User

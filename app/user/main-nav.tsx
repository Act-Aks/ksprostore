'use client'

import ForEach from '@/components/common/for-each'
import routes from '@/lib/constants/routes'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
    { href: routes.Profile, label: 'Profile' },
    { href: routes.Orders, label: 'Orders' },
] as const

const MainNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const pathname = usePathname()

    return (
        <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
            <ForEach
                of={navLinks}
                render={({ href, label }) => (
                    <Link
                        href={href}
                        className={cn(
                            'text-sm font-medium transition-all hover:bg-gradient-to-r hover:from-primary/20 hover:to-primary/10 hover:text-primary px-4 py-2 rounded-md duration-300',
                            pathname.includes(href)
                                ? 'bg-gradient-to-r from-primary/30 to-primary/10'
                                : 'text-muted-foreground',
                        )}
                    >
                        {label}
                    </Link>
                )}
            />
        </nav>
    )
}

export default MainNav

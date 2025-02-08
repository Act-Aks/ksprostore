import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { EllipsisVertical, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import ModeToggle from './mode-toggle'
import User from './user'

const Menu: React.FC = () => {
    return (
        <div className={'flex justify-end gap-3'}>
            <nav className={'hidden md:flex w-full max-w-xs gap-1'}>
                <ModeToggle />
                <Button asChild variant={'ghost'}>
                    <Link href={'/cart'}>
                        <ShoppingCart /> Cart
                    </Link>
                </Button>
                <User />
            </nav>
            <nav className={'md:hidden'}>
                <Sheet>
                    <SheetTrigger className={'align-middle'}>
                        <EllipsisVertical />
                    </SheetTrigger>
                    <SheetContent className={'flex flex-col items-start'}>
                        <SheetTitle>Menu</SheetTitle>
                        <ModeToggle />
                        <Button asChild variant={'ghost'}>
                            <Link href={'/cart'}>
                                <ShoppingCart /> Cart
                            </Link>
                        </Button>
                        <User />
                        <SheetDescription></SheetDescription>
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
    )
}

export default Menu

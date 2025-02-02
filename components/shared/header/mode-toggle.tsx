'use client'

import RenderIf from '@/components/common/conditional-render'
import ForEach from '@/components/common/for-each'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const themeModes = ['system', 'light', 'dark'] as const

const ModeToggle = () => {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={'ghost'}
                    className={'focus-visible:ring-0 focus-visible:ring-offset-0'}
                >
                    <RenderIf
                        condition={theme === 'system'}
                        then={<SunIcon />}
                        otherwise={
                            <RenderIf
                                condition={theme === 'dark'}
                                then={<MoonIcon />}
                                otherwise={<SunIcon />}
                            />
                        }
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ForEach
                    of={themeModes}
                    render={mode => (
                        <DropdownMenuCheckboxItem
                            checked={theme === mode}
                            onClick={() => setTheme(mode)}
                            className={'capitalize'}
                        >
                            {mode}
                        </DropdownMenuCheckboxItem>
                    )}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ModeToggle

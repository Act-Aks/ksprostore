'use client'

import { Button } from '@/components/ui/button'

const SignIn = () => {
    return (
        <div className={'flex h-screen w-full bg-black/10 p-20'}>
            <div
                key={'section-1'}
                className={
                    'flex flex-1 bg-violet-500 items-center justify-center hover:bg-violet-500/50'
                }
                onClick={() => {
                    alert('Hi aks')
                }}
            >
                <Button>Section 1</Button>
            </div>
            <div
                className={
                    'flex flex-1 bg-green-500 items-center justify-center hover:bg-green-500/50'
                }
                onClick={() => {
                    alert('Hi aks')
                }}
            >
                <Button>Section 2</Button>
            </div>
        </div>
    )
}

export default SignIn

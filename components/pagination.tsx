'use client'

import { formUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'

interface PaginationProps {
    total: number
    page: number | string
    urlParamName?: string
}

const Pagination: React.FC<PaginationProps> = ({ page, total, urlParamName }) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleClick = (type: 'prev' | 'next') => {
        const newPage = Number(page) + (type === 'prev' ? -1 : 1)
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: urlParamName || 'page',
            value: newPage.toString(),
        })
        router.push(newUrl)
    }

    return (
        <div className={'flex gap-2'}>
            <Button
                className={'w-28'}
                size={'lg'}
                variant={'outline'}
                disabled={Number(page) <= 1}
                onClick={() => handleClick('prev')}
            >
                Previous
            </Button>
            <Button
                className={'w-28'}
                size={'lg'}
                variant={'outline'}
                disabled={Number(page) >= total}
                onClick={() => handleClick('next')}
            >
                Next
            </Button>
        </div>
    )
}

export default Pagination

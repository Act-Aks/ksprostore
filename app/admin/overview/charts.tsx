'use client'

import { formatCurrency } from '@/lib/utils'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

interface ChartsProps {
    data: { salesData: { month: string; totalSales: number }[] }
}

const Charts: React.FC<ChartsProps> = ({ data: { salesData } }) => {
    return (
        <ResponsiveContainer width={'100%'} height={350}>
            <BarChart data={salesData}>
                <XAxis dataKey={'month'} stroke={'#888888'} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                    stroke={'#888888'}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={value => formatCurrency(value)}
                />
                <Bar dataKey={'totalSales'} fill={'currentColor'} radius={[4, 4, 0, 0]} className={'fill-primary'} />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default Charts

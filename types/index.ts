import { createProductSchema } from '@/lib/validators'
import { TypeOf } from 'zod'

export type Product = TypeOf<typeof createProductSchema> & {
    id: string
    rating: number
    createdAt: Date
}

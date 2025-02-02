import { createProductSchema } from '@/lib/validators'
import { TypeOf } from 'zod'

export type Product = TypeOf<typeof createProductSchema> & {
    id: string
    rating: string
    numReviews: number
    createdAt: Date
}

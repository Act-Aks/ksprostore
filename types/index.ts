import { cartItemSchema, cartSchema, createProductSchema, shippingAddressSchema } from '@/lib/validators'
import { TypeOf } from 'zod'

export type Product = TypeOf<typeof createProductSchema> & {
    id: string
    rating: string
    numReviews: number
    createdAt: Date
}
export type CartItem = TypeOf<typeof cartItemSchema>
export type Cart = TypeOf<typeof cartSchema>
export type ShippingAddress = TypeOf<typeof shippingAddressSchema>

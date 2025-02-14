import {
    cartItemSchema,
    cartSchema,
    createOrderSchema,
    createProductSchema,
    orderItemSchema,
    paymentMethodSchema,
    paymentResultSchema,
    shippingAddressSchema,
} from '@/lib/validators'
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
export type PaymentMethod = TypeOf<typeof paymentMethodSchema>
export type OrderItem = TypeOf<typeof orderItemSchema>
export type Order = TypeOf<typeof createOrderSchema> & {
    id: string
    createdAt: Date
    isPaid: boolean
    isDelivered: boolean
    paidAt: Date | null
    deliveredAt: Date | null
    orderItems: OrderItem[]
    user: { name: string; email: string }
}
export type PaymentResult = TypeOf<typeof paymentResultSchema>

import { z } from 'zod'
import { PaymentMethods } from './constants'
import { formatDecimalNumber } from './utils'

const currency = z
    .string()
    .refine(
        value => /^\d+(\.\d{2})?$/.test(formatDecimalNumber(Number(value))),
        'Price must be a valid number with two decimal places',
    )

export const createProductSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters'),
    category: z.string().min(3, 'Category must be at least 3 characters'),
    brand: z.string().min(3, 'Brand must be at least 3 characters'),
    description: z.string().min(3, 'Description must be at least 3 characters'),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, 'Product must have at least 1 image'),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency,
})

export const signInFormSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signUpFormSchema = z
    .object({
        name: z.string().min(3, 'Name must be at least 3 characters'),
        email: z.string().email('Invalid email'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    name: z.string().min(1, 'Product name is required'),
    slug: z.string().min(1, 'Product slug is required'),
    qty: z.number().int().nonnegative('Product qty must be a positive integer'),
    image: z.string().min(1, 'Product image is required'),
    price: currency,
})

export const cartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    shippingPrice: currency,
    totalPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, 'Session cart ID is required'),
    userId: z.string().optional().nullable(),
})

export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, 'Name is required'),
    streetAddress: z.string().min(3, 'StreetAddress is required'),
    city: z.string().min(3, 'City is required'),
    postalCode: z.string().min(3, 'Postal Code is required'),
    country: z.string().min(3, 'Country is required'),
    lat: z.number().optional(),
    lng: z.number().optional(),
})

export const paymentMethodSchema = z
    .object({
        type: z.string().min(1, 'Payment method is required'),
    })
    .refine(data => Object.values<string>(PaymentMethods).includes(data.type), {
        message: 'Invalid Payment method!',
        path: ['type'],
    })

export const createOrderSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    totalPrice: currency,
    paymentMethod: z
        .string()
        .min(1, 'Payment method is required')
        .refine(value => Object.values<string>(PaymentMethods).includes(value), { message: 'Invalid Payment method!' }),
    shippingAddress: shippingAddressSchema,
})

export const orderItemSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    name: z.string().min(1, 'Product name is required'),
    slug: z.string().min(1, 'Product slug is required'),
    qty: z.number().int(),
    image: z.string().min(1, 'Product image is required'),
    price: currency,
})

export const paymentResultSchema = z.object({
    id: z.string(),
    status: z.string(),
    email_address: z.string(),
    pricePaid: z.string(),
})

export const updateProfileSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email'),
})

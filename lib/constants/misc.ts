import { ShippingAddress } from '@/types'
import { TypeOf } from 'zod'
import { signInFormSchema, signUpFormSchema } from '../validators'

export const defaultEmailAndPassword = {
    email: 'aksadmin@aks.com',
    password: '123456',
} satisfies TypeOf<typeof signInFormSchema>

export const signUpDefaultValues = {
    ...defaultEmailAndPassword,
    confirmPassword: '',
    name: '',
} satisfies TypeOf<typeof signUpFormSchema>

export const shippingAddressDefaultValues = {
    fullName: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: '',
} satisfies ShippingAddress

import { TypeOf } from 'zod'
import { signInFormSchema, signUpFormSchema } from '../validators'

export const defaultEmailAndPassword = {
    email: '',
    password: '',
} satisfies TypeOf<typeof signInFormSchema>

export const signUpDefaultValues = {
    ...defaultEmailAndPassword,
    confirmPassword: '',
    name: '',
} satisfies TypeOf<typeof signUpFormSchema>

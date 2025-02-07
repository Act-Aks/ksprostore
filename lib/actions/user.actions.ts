'use server'

import { signIn, signOut } from '@/config/auth'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { signInFormSchema } from '../validators'

export const signInWithCredentials = async (state: unknown, formData: FormData) => {
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
        })

        await signIn('credentials', user)

        return {
            message: 'Signed in successfully',
            success: true,
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        return {
            message: 'Invalid credentials',
            success: false,
        }
    }
}

export const signOutUser = async () => {
    await signOut()
}

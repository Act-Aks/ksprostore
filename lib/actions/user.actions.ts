'use server'

import { signIn, signOut } from '@/config/auth'
import { prisma } from '@/db/prisma'
import { hashSync } from 'bcrypt-ts-edge'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { formatError } from '../utils'
import { signInFormSchema, signUpFormSchema } from '../validators'

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

export const signUpUser = async (state: unknown, formData: FormData) => {
    try {
        const password = formData.get('password')
        const user = signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password,
            confirmPassword: formData.get('confirmPassword'),
        })
        user.password = hashSync(user.password, 10)

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
                address: '',
            },
        })

        await signIn('credentials', { email: user.email, password })
        return {
            message: 'Signed up successfully!',
            success: true,
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }
        return {
            message: formatError(error),
            success: false,
        }
    }
}

export const signOutUser = async () => {
    await signOut()
}

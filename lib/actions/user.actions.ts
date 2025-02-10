'use server'

import { auth, signIn, signOut } from '@/config/auth'
import { prisma } from '@/db/prisma'
import { ShippingAddress } from '@/types'
import { hashSync } from 'bcrypt-ts-edge'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { formatError } from '../utils'
import { shippingAddressSchema, signInFormSchema, signUpFormSchema } from '../validators'

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

export const getUserById = async (id: string) => {
    const user = await prisma.user.findFirst({ where: { id } })
    if (!user) {
        throw new Error('User not found')
    }
    return user
}

export const updateUserAddress = async (data: ShippingAddress) => {
    try {
        const seesion = await auth()
        const currentUser = await prisma.user.findFirst({
            where: { id: seesion?.user?.id },
        })
        if (!currentUser) {
            throw new Error('User not found')
        }

        const address = shippingAddressSchema.parse(data)

        await prisma.user.update({
            where: { id: currentUser.id },
            data: {
                address,
            },
        })

        return {
            success: true,
            message: 'Address updated successfully',
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        }
    }
}

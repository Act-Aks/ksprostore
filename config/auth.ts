import { prisma } from '@/db/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compareSync } from 'bcrypt-ts-edge'
import NextAuth, { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const authConfig = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                email: { type: 'email' },
                password: { type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials) return null

                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string,
                    },
                })

                if (user && user.password) {
                    const isValid = compareSync(credentials.password as string, user.password)
                    if (isValid) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        }
                    }
                }

                return null
            },
        }),
    ],
    callbacks: {
        async session({ token, session, user, trigger }: any) {
            session.user.id = token.sub

            if (trigger === 'update') {
                session.user.name = user.name
            }

            return session
        },
    },
} satisfies NextAuthConfig

export const { handlers: authHandlers, signIn, signOut, auth } = NextAuth(authConfig)

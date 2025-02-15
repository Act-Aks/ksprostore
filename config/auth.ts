import { prisma } from '@/db/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compareSync } from 'bcrypt-ts-edge'
import NextAuth, { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async session({ token, session, user, trigger }: any) {
            session.user.id = token.sub
            session.user.role = token.role
            session.user.name = token.name

            if (trigger === 'update') {
                session.user.name = user.name
            }

            return session
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({ token, user, trigger, session }: any) {
            if (user) {
                token.id = user.id
                token.role = user.role

                if (user.name === 'NO_NAME') {
                    token.name = user.email.split('@')[0]

                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: token.name },
                    })
                }

                if (trigger === 'signIn' || trigger === 'signUp') {
                    const cookiesObj = await cookies()
                    const sessionCartId = cookiesObj.get('sessionCartId')?.value

                    if (sessionCartId) {
                        const sessionCart = await prisma.cart.findFirst({ where: { sessionCartId } })

                        if (sessionCart) {
                            await prisma.cart.deleteMany({ where: { userId: user.id } })

                            await prisma.cart.update({
                                where: { id: sessionCart.id },
                                data: { userId: user.id },
                            })
                        }
                    }
                }
            }

            if (session?.user?.name && trigger === 'update') {
                token.name = session.user.name
            }

            return token
        },
        authorized({ request, auth }) {
            /* Protect routes */
            const protectedRoutes = [
                /\/shipping-address/,
                /\/payment-method/,
                /\/place-order/,
                /\/profile/,
                /\/user\/(.*)/,
                /\/order\/(.*)/,
                /\/admin/,
            ]

            /* Get pathname */
            const { pathname } = request.nextUrl

            /* Check for auth */
            if (!auth && protectedRoutes.some(route => route.test(pathname))) {
                return false
            }

            /* Check for session cart cookie */
            if (!request.cookies.get('sessionCartId')) {
                /* Generate new id */
                const sessionCartId = crypto.randomUUID()

                const newReqHeaders = new Headers(request.headers)

                const response = NextResponse.next({
                    request: {
                        headers: newReqHeaders,
                    },
                })

                /* Set generated id as sessionCartId in cookies */
                response.cookies.set('sessionCartId', sessionCartId)

                return response
            } else {
                return true
            }
        },
    },
} satisfies NextAuthConfig

export const { handlers: authHandlers, signIn, signOut, auth } = NextAuth(authConfig)

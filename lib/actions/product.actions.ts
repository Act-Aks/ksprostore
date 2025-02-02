'use server'

import { prisma } from '@/db/prisma'
import { convertToPlainObject } from '@/lib/utils'

const LATEST_PRODUCTS_LIMIT = 4

/* Get latest products */
export const getLatestProducts = async (limit: number = LATEST_PRODUCTS_LIMIT) => {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
    })
    return convertToPlainObject(products)
}

/* Get product by slug */
export const getProductBySlug = async (slug: string) => {
    const product = await prisma.product.findFirst({
        where: { slug },
    })
    return convertToPlainObject(product)
}

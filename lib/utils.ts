import { CartItem, Product } from '@/types'
import { clsx, type ClassValue } from 'clsx'
import qs from 'query-string'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function convertToPlainObject<T>(value: T): T {
    return JSON.parse(JSON.stringify(value))
}

export function formatDecimalNumber(number: number): string {
    const [int, decimal] = number.toString().split('.')
    return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
    if (error.name === 'ZodError') {
        const fieldErrors = Object.keys(error.errors).map(field => error.errors[field].message)
        return fieldErrors.join('. ')
    } else if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002') {
        const field: string = error.meta?.target?.[0] ?? 'Field'
        return `${field[0].toUpperCase() + field.slice(1)} already exists`
    } else {
        return typeof error.message === 'string' ? error.message : JSON.stringify(error.message)
    }
}

export function getCartItemFromProduct(product: Product): CartItem {
    return {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        price: product.price,
        qty: 1,
    }
}

export function roundTwoDecimals(value: number | string): number {
    if (typeof value === 'string') {
        return Math.round((Number(value) + Number.EPSILON) * 100) / 100
    }
    if (typeof value === 'number') {
        return Math.round((value + Number.EPSILON) * 100) / 100
    }
    throw new Error('Value is not a number or string')
}

export function calcPrice(items: CartItem[]) {
    const itemsPrice = roundTwoDecimals(items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)),
        shippingPrice = roundTwoDecimals(itemsPrice > 100 ? 0 : 10),
        taxPrice = roundTwoDecimals(0.15 * itemsPrice),
        totalPrice = roundTwoDecimals(itemsPrice + shippingPrice + taxPrice)

    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
    }
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    currency: 'INR',
    style: 'currency',
    minimumFractionDigits: 2,
})

export function formatCurrency(amount: number | string | null) {
    if (typeof amount === 'number') {
        return currencyFormatter.format(amount)
    }
    if (typeof amount === 'string') {
        return currencyFormatter.format(Number(amount))
    }
    return 'NaN'
}

const numberFormatter = new Intl.NumberFormat('en-US')

export function formatNumber(value: number) {
    return numberFormatter.format(value)
}

export function formatId(id: string) {
    return `...${id.substring(id.length - 6)}`
}

// Format date and times
export const formatDateTime = (dateString: Date) => {
    const dateTimeOptions: Intl.DateTimeFormatOptions = {
        month: 'short', // abbreviated month name (e.g., 'Oct')
        year: 'numeric', // abbreviated month name (e.g., 'Oct')
        day: 'numeric', // numeric day of the month (e.g., '25')
        hour: 'numeric', // numeric hour (e.g., '8')
        minute: 'numeric', // numeric minute (e.g., '30')
        hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    }
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
        month: 'short', // abbreviated month name (e.g., 'Oct')
        year: 'numeric', // numeric year (e.g., '2023')
        day: 'numeric', // numeric day of the month (e.g., '25')
    }
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric', // numeric hour (e.g., '8')
        minute: 'numeric', // numeric minute (e.g., '30')
        hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    }
    const formattedDateTime: string = new Date(dateString).toLocaleString('en-US', dateTimeOptions)
    const formattedDate: string = new Date(dateString).toLocaleString('en-US', dateOptions)
    const formattedTime: string = new Date(dateString).toLocaleString('en-US', timeOptions)
    return {
        dateTime: formattedDateTime,
        dateOnly: formattedDate,
        timeOnly: formattedTime,
    }
}

// Form the pagination links
export function formUrlQuery({ params, key, value }: { params: string; key: string; value: string | null }) {
    const query = qs.parse(params)

    query[key] = value

    return qs.stringifyUrl(
        {
            url: window.location.pathname,
            query,
        },
        {
            skipNull: true,
        },
    )
}

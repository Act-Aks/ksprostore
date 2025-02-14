export const APP_NAME = 'Ksprostore'
export const APP_DESCRIPTION = 'Modern e-commerce platform'

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export enum PaymentMethods {
    // PAYPAL = 'PayPal',
    STRIPE = 'Stripe',
    CASH_ON_DELIVERY = 'CashOnDelivery',
}
export const DEFAULT_PAYMENT_METHOD = PaymentMethods.STRIPE
export const PAGE_SIZE = 2

const basePaypalUrl = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com'

const handleResponse = async (res: Response) => {
    if (res.ok) {
        return res.json()
    } else {
        const error = await res.text()
        throw new Error(error)
    }
}

const generatePaypalAccessToken = async () => {
    const { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY } = process.env

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`).toString('base64')

    const res = await fetch(`${basePaypalUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    })

    const jsonData = await handleResponse(res)
    return jsonData.access_token
}

export const paypal = {
    createOrder: async (amount: number) => {
        const accessToken = await generatePaypalAccessToken()
        const url = `${basePaypalUrl}/v2/checkout/orders`

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: amount,
                        },
                    },
                ],
            }),
        })

        return await handleResponse(res)
    },
    capturePayment: async (orderId: string) => {
        const accessToken = await generatePaypalAccessToken()
        const url = `${basePaypalUrl}/v2/checkout/orders/${orderId}/capture`
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        })
        return await handleResponse(res)
    },
}

export { generatePaypalAccessToken }

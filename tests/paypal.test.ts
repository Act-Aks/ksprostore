import { generatePaypalAccessToken, paypal } from '@/lib/paypal'

/* Test generate access token */
test('generate paypal access token', async () => {
    const accessToken = await generatePaypalAccessToken()
    console.log(accessToken)
    expect(accessToken).toBeDefined()
    expect(typeof accessToken).toBe('string')
    expect(accessToken.length).toBeGreaterThan(0)
})

/* Test to create a paypal order */
test('creates a paypal order', async () => {
    const price = 100

    const order = await paypal.createOrder(price)
    console.log(order)

    expect(order).toHaveProperty('id')
    expect(order).toHaveProperty('status')
    expect(order.status).toBe('CREATED')
})

/* Test to capture payment with mocked order */
test('capture payment with mocked order', async () => {
    const orderId = '1234567890'
    const mockCapturePayment = jest.spyOn(paypal, 'capturePayment').mockResolvedValue({
        status: 'COMPLETED',
    })

    const captureResponse = await paypal.capturePayment(orderId)
    expect(captureResponse).toHaveProperty('status', 'COMPLETED')

    mockCapturePayment.mockRestore()
})

import ForEach from '@/components/common/for-each'
import { cn } from '@/lib/utils'
import React from 'react'
import RenderIf from '../common/conditional-render'

interface CheckoutStepsProps {
    currentStep: number
}

enum CheckOutSteps {
    USER_LOGIN = 'User Login',
    SHIPPING_ADDRESS = 'Shipping Address',
    PAYMENT_METHOD = 'Payment Method',
    PLACE_ORDER = 'Place Order',
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep = 0 }) => {
    return (
        <div className={'flex-between flex-col md:flex-row space-y-2 space-x-2 mb-10'}>
            <ForEach
                of={Object.values(CheckOutSteps)}
                render={(step, index) => {
                    return (
                        <React.Fragment key={step}>
                            <div
                                className={cn(
                                    'p-2 w-56 rounded-full text-center text-sm',
                                    index === currentStep ? 'bg-secondary' : '',
                                )}
                            >
                                {step}
                            </div>
                            <RenderIf
                                condition={step !== CheckOutSteps.PLACE_ORDER}
                                then={<hr className={'w-16 border-t border-gray-300 mx-2'} />}
                            />
                        </React.Fragment>
                    )
                }}
            />
        </div>
    )
}

export default CheckoutSteps

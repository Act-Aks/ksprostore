import { cn } from '@/lib/utils'

interface ProductPriceProps {
    price: number
    className?: string
}

const ProductPrice: React.FC<ProductPriceProps> = ({ price, className }) => {
    const priceString = price.toFixed(2)
    const [intValue, floatValue] = priceString.split('.')

    return (
        <p className={cn('text-2xl', className)}>
            <span className='text-xs align-super'>&#8377;</span>
            {intValue}
            <span className='text-xs align-super'>.{floatValue}</span>
        </p>
    )
}

export default ProductPrice

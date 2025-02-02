import { Card, CardContent, CardHeader } from '@/components/ui/card'
import routes from '@/lib/constants/routes'
import { Product } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import RenderIf from '../common/conditional-render'
import ProductPrice from './product-price'

interface ProductCardProps {
    product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <Card className={'w-full max-w-sm'}>
            <CardHeader className={'p-0 items-center'}>
                <Link href={`${routes.Product}/${product.slug}`}>
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        height={300}
                        width={300}
                        priority
                    />
                </Link>
            </CardHeader>
            <CardContent className={'p-4 grid gap-4'}>
                <div className='text-xs'>{product.brand}</div>
                <Link href={`${routes.Product}/${product.slug}`}>
                    <h2 className='text-sm font-medium'>{product.name}</h2>
                </Link>
                <div className='flex-between gap-4'>
                    <p>{product.rating} Stars</p>
                    <RenderIf
                        condition={product.stock > 0}
                        then={<ProductPrice price={Number(product.price)} />}
                        otherwise={<p className={'text-destructive'}>Out Of Stock</p>}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default ProductCard

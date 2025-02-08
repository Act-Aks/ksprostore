import { Product } from '@/types'
import RenderIf from '../common/conditional-render'
import ForEach from '../common/for-each'
import ProductCard from './product-card'

interface ProductListProps {
    products: Product[]
    title?: string
    limit?: number
}

const ProductList: React.FC<ProductListProps> = ({ products, title }) => {
    return (
        <div className={'my-10'}>
            <h2 className='h2-bold mb-4'>{title}</h2>
            <RenderIf
                condition={!!products.length}
                then={
                    <div className={'grid grid-col-1 sm:grid-col-2 md:grid-cols-3 lg:grid-cols-4 gap-4'}>
                        <ForEach of={products} render={product => <ProductCard product={product} />} />
                    </div>
                }
                otherwise={
                    <div>
                        <p>No products found</p>
                    </div>
                }
            />
        </div>
    )
}

export default ProductList

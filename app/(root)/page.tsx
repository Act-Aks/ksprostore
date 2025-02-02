import ProductList from '@/components/product/product-list'
import { getLatestProducts } from '@/lib/actions/product.actions'

const Home = async () => {
    const latestProducts = await getLatestProducts()

    return (
        <div>
            <ProductList products={latestProducts} title={'New Arrivals'} />
        </div>
    )
}

export default Home

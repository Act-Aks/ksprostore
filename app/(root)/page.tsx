import ProductList from '@/components/product/product-list'
import { getLatestProducts } from '@/lib/actions/product.actions'

const Home = async () => {
    const latestProducts = await getLatestProducts()

    return (
        <div>
            {/* eslint-disable-next-line */}
            {/* @ts-expect-error  */}
            <ProductList data={latestProducts} title={'New Arrivals'} />
        </div>
    )
}

export default Home

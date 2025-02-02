'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'
import ForEach from '../common/for-each'

interface ProductImagesProps {
    images: string[]
}

const ProductImages: React.FC<ProductImagesProps> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0)

    return (
        <div className={'space-y-4'}>
            <Image
                src={images[currentIndex]}
                alt={'product-image'}
                width={1000}
                height={1000}
                className={'min-h-[300px] object-center object-cover'}
            />
            <div className='flex'>
                <ForEach
                    of={images}
                    render={(image, index) => (
                        <div
                            className={cn(
                                'border mr-2 cursor-pointer hover:border-orange-600',
                                currentIndex === index && 'border-orange-500',
                            )}
                            onClick={() => setCurrentIndex(index)}
                        >
                            <Image src={image} alt={'image'} width={100} height={100} />
                        </div>
                    )}
                />
            </div>
        </div>
    )
}

export default ProductImages

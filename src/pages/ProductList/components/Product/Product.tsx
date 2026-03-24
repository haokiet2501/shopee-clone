import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import path from 'src/constants/path'
import type { Product as ProductType } from 'src/types/product.type'
import { formatCurrenCy, formatNumberToSocialStyle, generateNameId } from 'src/utils/utils'
interface Props {
  product: ProductType
}

export default function Product({ product }: Props) {
  return (
    <Link to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}>
      <div className='bg-white shadow rounded-sm hover:-translate-y-px hover:shadow-md duration-100 transition-transform overflow-hidden'>
        <div className='w-full pt-(--my-padding) relative'>
          <img
            src={product.image}
            alt={product.name}
            className='absolute top-0 left-0 bg-white w-full h-full object-cover'
          />
        </div>
        <div className='p-2 overflow-hidden'>
          <div className='min-h-8 line-clamp-2 text-xs'>{product.name}</div>
          <div className='flex items-center mt-3'>
            <div className='line-through max-w-[50%] text-gray-400 truncate'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{formatCurrenCy(product.price_before_discount)}</span>
            </div>
            <div className='text-orange-75 truncate ml-1'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{formatCurrenCy(product.price)}</span>
            </div>
          </div>
        </div>
        <div className='mt-3 flex items-center justify-end p-2'>
          <ProductRating rating={product.rating} />
          <div className='ml-2 text-sm'>
            <span>{formatNumberToSocialStyle(product.sold)}</span>
            <span className='ml-1'>Đã bán</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

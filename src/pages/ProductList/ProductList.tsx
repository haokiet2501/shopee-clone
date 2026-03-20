import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { omitBy, isUndefined } from 'lodash'
import useQueryParams from 'src/hooks/useQueryParams'
import AsideFilter from './components/AsideFilter'
import Product from './components/Product'
import SortProductList from './components/SortProductList'
import productApi from 'src/api/product.api'
import Pagination from 'src/components/Pagination'
import type { ProductListConfig } from 'src/types/product.type'
import categoryApi from 'src/api/category.api'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}
export default function ProductList() {
  // Lấy param từ api
  const queryParams = useQueryParams()
  // Tạo variable để config từ param
  const queryConfig: QueryConfig = omitBy(
    {
      exclude: queryParams.exclude,
      limit: queryParams.limit || 20,
      name: queryParams.name,
      order: queryParams.order,
      page: queryParams.page || '1',
      price_max: queryParams.price_max,
      price_min: queryParams.proce_min,
      rating_filter: queryParams.rating_filter,
      sort_by: queryParams.sort_by,
      category: queryParams.category
    },
    isUndefined
  )

  // Lấy data product từ api
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    // Khi làm về pagination thì placeholderData sẽ giúp cho việc chuyển trang sẽ không bị khựng.
    placeholderData: keepPreviousData
  })

  // Lấy data từ category để filter product từ api
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <div className='bg-gray-200/70 py-6'>
      <div className='container px-4'>
        {productsData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
            </div>
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
                {productsData.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

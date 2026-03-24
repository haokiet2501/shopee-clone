import type { ProductListConfig } from "src/types/product.type"
import useQueryParams from "./useQueryParams"
import { isUndefined, omitBy } from "lodash"

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function useQueryConfig() {
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
  return queryConfig
}

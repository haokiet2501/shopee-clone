import { sortBy, order as orderConstant } from 'src/constants/product'
import type { ProductListConfig } from 'src/types/product.type'
import classNames from 'classnames'
import type { QueryConfig } from 'src/hooks/useQueryConfig'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { omit } from 'lodash'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

export default function SortProductList({ queryConfig, pageSize }: Props) {
  // Lấy ra pageSize
  const page = Number(queryConfig.page)
  const navigate = useNavigate()
  // Lấy ra sort_by để tìm kiếm sắp xếp.
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  // Tạo hàm sort khi click.
  const handleClickSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit({ ...queryConfig, sort_by: sortByValue }, ['order'])).toString()
    })
  }

  // Tạo getItemContain để lấy ra giá cao tới thấp để dễ quản lí.
  const getOrderItem = () => {
    if (sort_by !== sortBy.price) return 'Giá'
    if (order === 'asc') return 'Giá: Thấp đến Cao'
    if (order === 'desc') return 'Giá: Cao đến Thấp'
    return 'Giá'
  }

  // Tạo hàm để chage giá từ thấp đến cao.
  const handleChangePrice = (orderValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({ ...queryConfig, sort_by: sortBy.price, order: orderValue }).toString()
    })
  }

  return (
    <div className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center flex-wrap gap-2'>
          <div>Sắp xếp theo</div>
          <button
            className={classNames('h-8 px-4 capitalize text-sm text-center rounded-sm shadow', {
              'bg-orange-75 text-white hover:opacity-91': isActiveSortBy(sortBy.view),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view)
            })}
            onClick={() => handleClickSort(sortBy.view)}
          >
            Phổ biến
          </button>
          <button
            className={classNames('h-8 px-4 capitalize text-sm text-center rounded-sm shadow', {
              'bg-orange-75 text-white hover:opacity-91': isActiveSortBy(sortBy.createdAt),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.createdAt)
            })}
            onClick={() => handleClickSort(sortBy.createdAt)}
          >
            Mới nhất
          </button>
          <button
            className={classNames('h-8 px-4 capitalize text-sm text-center rounded-sm shadow', {
              'bg-orange-75 text-white hover:opacity-91': isActiveSortBy(sortBy.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold)
            })}
            onClick={() => handleClickSort(sortBy.sold)}
          >
            Bán chạy
          </button>

          {/* Tạo dropdown thay vì select */}
          <div className='relative w-46 h-8 bg-white text-sm group rounded-sm shadow'>
            <div className='flex items-center justify-between h-full px-2'>
              <span className={order ? 'text-orange-75 bg-white' : 'text-black'}>{getOrderItem()}</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className={`${order ? 'stroke-orange-75 size-4' : ''} size-4`}
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
              </svg>
            </div>

            <div className='absolute hidden group-hover:block top-[105%] left-0 w-full overflow-hidden bg-white text-sm rounded-sm z-10 shadow-lg'>
              <button
                className={classNames(
                  'flex text-black items-center w-full justify-between px-2 py-3 hover:bg-slate-200/50',
                  {
                    'text-orange-75': order === 'asc'
                  }
                )}
                onClick={() => handleChangePrice(orderConstant.asc as Exclude<ProductListConfig['sort_by'], undefined>)}
              >
                <span>Giá: Thấp đến Cao</span>
                {order === 'asc' && (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className={`${order ? 'stroke-orange-75' : ''} size-4`}
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m4.5 12.75 6 6 9-13.5' />
                  </svg>
                )}
              </button>
              <button
                className={classNames(
                  'flex text-black items-center w-full justify-between px-2 py-3 hover:bg-slate-200/50',
                  {
                    'text-orange-75': order === 'desc'
                  }
                )}
                onClick={() =>
                  handleChangePrice(orderConstant.desc as Exclude<ProductListConfig['sort_by'], undefined>)
                }
              >
                <span>Giá: Cao đến Thấp</span>
                {order === 'desc' && (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className={`${order ? 'stroke-orange-75' : ''} size-4`}
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m4.5 12.75 6 6 9-13.5' />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Cách 2 kiểu cũ  */}
          {/* <select
            className={classNames('h-8 text-sm capitalize outline-none rounded-sm p-1', {
              'bg-white text-orange-75': isActiveSortBy(sortBy.price),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.price)
            })}
            value={order || ''}
            onChange={(e) => handleChangePrice(e.target.value as Exclude<ProductListConfig['sort_by'], undefined>)}
          >
            <option value='' className='bg-white text-black outline-none'>
              Giá
            </option>
            <option value={orderConstant.asc} className='bg-white text-black outline-none'>
              Giá: Thấp đến cao
            </option>
            <option value={orderConstant.desc} className='bg-white text-black outline-none'>
              Giá: Cao đến thấp
            </option>
          </select> */}
        </div>
        <div className='flex items-center'>
          <div>
            <span className='text-orange-75'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='ml-2 flex items-center justify-between'>
            {page === 1 ? (
              <span className='flex items-center justify-center w-9 h-8 rounded-tl-sm rounded-bl-sm bg-white cursor-not-allowed shadow'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({ ...queryConfig, page: (page - 1).toString() }).toString()
                }}
                className='flex items-center justify-center w-9 h-8 rounded-tl-sm rounded-bl-sm bg-white hover:bg-slate-100 shadow'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}
            {page === pageSize ? (
              <span className='flex items-center justify-center w-9 h-8 rounded-tr-sm rounded-br-sm bg-white cursor-not-allowed shadow'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({ ...queryConfig, page: (page + 1).toString() }).toString()
                }}
                className='flex items-center justify-center w-9 h-8 rounded-tr-sm rounded-br-sm bg-white hover:bg-slate-100 shadow'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

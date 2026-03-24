import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import productApi from 'src/api/product.api'
import InputNumber from 'src/components/InputNumber'
import ProductRating from 'src/components/ProductRating'
import { formatCurrenCy, formatNumberToSocialStyle, getIdFromNameId, rateSale } from 'src/utils/utils'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function ProductDetail() {
  // dot path break page vite. ở phiên bản cũ vite 2, hiện nay là vite 8 rồi.
  // cách giải quyết là vite-plugin-rewrite-all
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const imageRef = useRef<HTMLImageElement>(null)

  // Tạo state image cho slide ảnh.
  const [currentIndexImage, setCurrentIndexImage] = useState([0, 5])
  // Tạo state cho việc active image.
  const [activeImage, setActiveImage] = useState('')
  const product = productDetailData?.data.data
  // Tạo currentImage cho slide để phụ thuộc vào currentIndexImage và dùng useMemo để hạn chế tính toán.
  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImage) : []),
    [currentIndexImage, product]
  )

  // Tạo biến để render ảnh chính
  const displayImage = activeImage || product?.images[0] || ''

  // Xử lí chọn image.
  useEffect(() => {
    if (product && product.images.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveImage(product.images[0])
    }
  }, [id, product])

  // Xử lí chọn ảnh tiếp theo.
  const isLastImg = product && currentIndexImage[1] >= product.images.length
  const next = () => {
    if (product && currentIndexImage[1] < product.images.length) {
      setCurrentIndexImage((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  // Xử lí chọn ảnh lùi về.
  const isFirstImg = currentIndexImage[0] === 0
  const prev = () => {
    if (currentIndexImage[0] > 0) {
      setCurrentIndexImage((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  // Chọn image.
  const chooseActive = (img: string) => {
    setActiveImage(img)
  }

  // Tạo hàm để thực hiện zoom ảnh.
  const handleZoom = (event: React.MouseEvent<HTMLDivElement>) => {
    // Lấy ra chiều cao chiều rộng của thẻ div bằng getBoudingClientReact.
    const rect = event.currentTarget.getBoundingClientRect()
    // Lấy giá trị từ useRef.
    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    // Tính toán.
    // Cách 1: lấy offsetX, offsetY khi chúng ta đã xử lí được bubble event.
    const { offsetX, offsetY } = event.nativeEvent

    // Cách 2: lấy offsetX, offsetY khi chúng ta không xử lí được bubble event. (bất chấp)
    // Không cần pointer-event-none
    // const offsetX = event.pageX - (rect.x + window.scrollX)
    // const offsetY = event.pageY - (rect.y + window.scrollY)
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    // Xét giá trị width, height.
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'

    // Event bubble hiện tượng này xảy rả khi làm việc với event đặc biệt là zoom ảnh.
    // Là lúc thì cha lúc thì con có nghĩa là lúc thì nhầm lẫn thẻ này lúc thì thẻ kia.
    // Cách để giải quyết vấn đề này là css cho nó pointer-event-none.
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  // Nếu không có data product thì trả về kq là null.
  if (!product) return null

  return (
    <div className='bg-gray-200/60 py-6'>
      <div className='container px-4'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full pt-[100%] shadow overflow-hidden cursor-zoom-in'
                onMouseMove={handleZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  ref={imageRef}
                  src={displayImage}
                  alt={product.name}
                  className='absolute top-0 pointer-events-none left-0 h-full w-full bg-white object-cover'
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className={`absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white ${isFirstImg ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={isFirstImg}
                  onClick={prev}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages.map((img) => {
                  const isActive = img === activeImage
                  return (
                    <div className='relative w-full pt-[100%]' key={img} onMouseEnter={() => chooseActive(img)}>
                      <img
                        src={img}
                        alt={product.name}
                        className='absolute top-0 left-0 h-full w-full bg-white object-cover'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange-75' />}
                    </div>
                  )
                })}
                <button
                  className={`absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white ${isLastImg ? 'cursor-not-allowed' : 'cursor-pointer'} `}
                  disabled={isLastImg}
                  onClick={next}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <div className='span mr-1 border-b border-b-orange text-orange-75'>{product.rating}</div>
                  <ProductRating
                    rating={product.rating}
                    activeClassname='fill-orange-75 text-orange-75 h-4 w-4'
                    nonActiveClassname='fill-gray-300 text-gray-300 h-4 w-4'
                  />
                </div>
                <div className='mx-4 h-4 w-px bg-gray-300' />
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>Đã bán</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>₫{formatCurrenCy(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange-75'>₫{formatCurrenCy(product.price)}</div>
                <div className='ml-4 rounded-sm bg-orange-75 px-1 py-0.5 text-xs font-semibold uppercase text-white'>
                  {rateSale(product.price_before_discount, product.price)} giảm
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Số lượng</div>
                <div className='ml-10 flex items-center'>
                  <button className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-4'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
                    </svg>
                  </button>
                  <InputNumber
                    value={1}
                    className=''
                    classNameError='hidden'
                    classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
                  />
                  <button className='flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-4'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                    </svg>
                  </button>
                </div>
                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>
              <div className='mt-8 flex items-center'>
                <button className='flex h-12 items-center justify-center rounded-xs border border-orange-75 bg-orange-75/10 px-5 capitalize text-orange-75 shadow-sm hover:bg-orange-75/5'>
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='mr-2.5 h-5 w-5 fill-current stroke-orange-75 text-orange'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy='13.5' r={1} stroke='none' />
                        <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                      </g>
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1='7.5' x2='10.5' y1={7} y2={7} />
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                    </g>
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button className='ml-4 flex items-center justify-center shadow-sm outline-none bg-orange-75 text-white rounded-xs px-5 capitalize h-12 hover:opacity-91'>
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container px-4'>
        <div className='mt-8 bg-white p-4 shadow'>
          <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Mô tả sản phẩm</div>
          <div className='mx-4 mt-12 mb-4 text-sm leading-loose'>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} />
          </div>
        </div>
      </div>
    </div>
  )
}

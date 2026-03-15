import { Link } from 'react-router-dom'

export default function Product() {
  return (
    <Link to='/'>
      <div className='bg-white shadow rounded-sm hover:-translate-y-px hover:shadow-md duration-100 transition-transform overflow-hidden'>
        <div className='w-full pt-(--my-padding) relative'>
          <img
            src='https://down-vn.img.susercontent.com/file/sg-11134253-821ec-mgue86fauk9b2d_tn.webp'
            alt='image'
            className='absolute top-0 left-0 bg-white w-full h-full object-cover'
          />
        </div>
        <div className='p-2 overflow-hidden'>
          <div className='min-h-8 line-clamp-2 text-xs'>
            Áo Thun cộc Tay Nam vải thun lạnh,họa tiết in chìm co giãn 4 chiều(xoắn)
          </div>
          <div className='flex items-center mt-3'>
            <div className='line-through max-w-[50%] text-gray-400 truncate'>
              <span className='text-xs'>₫</span>
              <span>9000</span>
            </div>
            <div className='text-orange-75 truncate ml-1'>
              <span className='text-xs'>₫</span>
              <span>151.000</span>
            </div>
          </div>
        </div>
        <div className='mt-3 flex items-center justify-end p-2'>
          <div className='flex items-center'>
            <div className='relative'>
              <div className='absolute top-0 left-0 h-full overflow-hidden' style={{ width: '50%' }}>
                <svg
                  enableBackground='new 0 0 15 15'
                  viewBox='0 0 15 15'
                  x={0}
                  y={0}
                  className='h-3 w-3 fill-yellow-300 text-yellow-300'
                >
                  <polygon
                    points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeMiterlimit={10}
                  />
                </svg>
              </div>
              <svg
                enableBackground='new 0 0 15 15'
                viewBox='0 0 15 15'
                x={0}
                y={0}
                className='h-3 w-3 fill-current text-gray-300'
              >
                <polygon
                  points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeMiterlimit={10}
                />
              </svg>
            </div>
          </div>
          <div className="ml-2 text-sm">
            <span>5.66k</span>
            <span className='ml-1'>Đã bán</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

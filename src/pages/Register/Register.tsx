import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { getRules } from 'src/utils/rules'

interface FormData {
  email: string
  password: string
  confirm_password: string
}

export default function Register() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<FormData>()

  const rules = getRules(getValues)

  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })
  return (
    <div className='bg-bg-pattern'>
      <div className='h-[700px] bg-banner-pattern bg-contain bg-center bg-no-repeat object-cover'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
            <div className='lg:col-span-2 lg:col-start-4'>
              <form className='rounded bg-white p-10 shadow-md' onSubmit={onSubmit} noValidate>
                <div className='text-2xl'>Đăng ký</div>
                <div className='mt-8'>
                  <input
                    type='email'
                    className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
                    placeholder='Email'
                    {...register('email', rules.email)}
                  />
                  <div className='mt-1 min-h-[1.25rem] text-xs text-red-600'>{errors.email?.message}</div>
                </div>
                <div className='mt-2'>
                  <input
                    type='password'
                    className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
                    autoComplete='on'
                    placeholder='Password'
                    {...register('password', rules.password)}
                  />
                  <div className='mt-1 min-h-[1.25rem] text-xs text-red-600'>{errors.password?.message}</div>
                </div>
                <div className='mt-2'>
                  <input
                    type='password'
                    className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
                    autoComplete='on'
                    placeholder='Confirm Password'
                    {...register('confirm_password', rules.confirm_password)}
                  />
                  <div className='mt-1 min-h-[1.25rem] text-xs text-red-600'>{errors.confirm_password?.message}</div>
                </div>
                <div className='mt-2'>
                  <button className='hover:text-bg-600 w-full bg-red-500 px-2 py-4 text-center text-sm uppercase text-white'>
                    Đăng ký
                  </button>
                </div>
                <div className='mt-8 flex items-center justify-center'>
                  <span className='mr-1 text-qs-form'>Bạn đã có tài khoản?</span>
                  <Link className='text-orange' to='/login'>
                    Đăng nhập
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

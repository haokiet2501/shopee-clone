import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import Input from 'src/components/Input'
import { schema, Schema } from 'src/utils/rules'

type FormData = Schema

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schema) })

  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })
  return (
    <div className='bg-bg-pattern'>
      <div className='h-[700px] bg-banner-pattern bg-contain bg-center bg-no-repeat object-cover'>
        <div className='container'>
          <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-28 lg:pr-10'>
            <div className='lg:col-span-2 lg:col-start-4'>
              <form className='rounded bg-white p-10 shadow-md' onSubmit={onSubmit} noValidate>
                <div className='text-2xl'>Đăng ký</div>
                <Input
                  type='email'
                  className='mt-8'
                  name='email'
                  placeholder='Email'
                  register={register}
                  errorMessage={errors.email?.message}
                />
                <Input
                  type='password'
                  className='mt-2'
                  name='password'
                  placeholder='Password'
                  register={register}
                  errorMessage={errors.password?.message}
                />
                <Input
                  type='password'
                  className='mt-2'
                  name='confirm_password'
                  placeholder='Password'
                  register={register}
                  errorMessage={errors.confirm_password?.message}
                />
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

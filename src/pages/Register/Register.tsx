import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Input from 'src/components/Input'
import { getRules } from 'src/utils/rules'

export interface FormData {
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

  const onSubmit = handleSubmit(
    (data) => {
      // console.log(data)
    },
    (data) => {
      const password = getValues('password')
      console.log(password)
    }
  )
  return (
    <div className='bg-orange-75'>
      <div className='container px-12'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng Kí</div>
              <Input
                name='email'
                type='email'
                placeholder='Email'
                register={register}
                rules={rules.email}
                className='mt-8'
                errorMessage={errors.email?.message}
              />
              <Input
                name='password'
                type='password'
                placeholder='Password'
                register={register}
                rules={rules.password}
                className='mt-2'
                errorMessage={errors.password?.message}
              />
              <Input
                name='confirm_password'
                type='password'
                placeholder='Confirm Password'
                register={register}
                rules={rules.confirm_password}
                className='mt-2'
                errorMessage={errors.confirm_password?.message}
              />
              <div className='mt-2'>
                <button
                  type='submit'
                  className='w-full text-center py-4 px-2 uppercase bg-orange-75 text-white text-sm hover:opacity-[.91]'
                >
                  Đăng kí
                </button>
              </div>
              <div className='flex items-center justify-center mt-8'>
                <span className='text-gray-75 mr-1'>Bạn đã có tài khoản?</span>
                <Link to='/login' className='text-orange-75 cursor-pointer'>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

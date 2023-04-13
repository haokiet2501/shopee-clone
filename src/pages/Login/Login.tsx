import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from 'src/utils/rules'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { omit } from 'lodash'
import { ResponseApi } from 'src/types/utils.type'
import { loginAccount } from 'src/apis/auth.api'
import Input from 'src/components/Input'

type FormData = Omit<Schema, 'confirm_password'>
const loginSchema = schema.omit(['confirm_password'])

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(loginSchema) })

  const LoginAccMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    LoginAccMutation.mutate(data, {
      onSuccess: (data) => {
        console.log(data)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ResponseApi<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  const value = watch()
  console.log(value, errors)

  return (
    <div className='bg-bg-pattern'>
      <div className='h-[700px] bg-banner-pattern bg-contain bg-center bg-no-repeat object-cover'>
        <div className='container'>
          <div className='grid grid-cols-1 py-12 pt-36 lg:grid-cols-5 lg:pr-10'>
            <div className='lg:col-span-2 lg:col-start-4'>
              <form onSubmit={onSubmit} className='rounded bg-white p-10 shadow-md'>
                <div className='text-2xl'>Đăng nhập</div>
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
                  autoComplete='on'
                  register={register}
                  errorMessage={errors.password?.message}
                />
                <div className='mt-3'>
                  <button className='hover:text-bg-600 w-full bg-red-500 px-2 py-4 text-center text-sm uppercase text-white'>
                    Đăng nhập
                  </button>
                </div>
                <div className='mt-8 flex items-center justify-center'>
                  <span className='mr-1 text-qs-form'>Bạn mới biết đến Shopee?</span>
                  <Link className='text-orange' to='/register'>
                    Đăng ký
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

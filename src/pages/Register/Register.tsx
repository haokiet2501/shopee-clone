import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from 'src/utils/rules'
import { useMutation } from '@tanstack/react-query'
import Input from 'src/components/Input'
import { registerAccount } from 'src/apis/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ResponseApi } from 'src/types/utils.type'

type FormData = Schema

export default function Register() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schema) })

  const registerAccMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccMutation.mutate(body, {
      onSuccess: (data) => {
        console.log(data)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ResponseApi<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
        }
      }
    })
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
                  autoComplete='on'
                  register={register}
                  errorMessage={errors.password?.message}
                />
                <Input
                  type='password'
                  className='mt-2'
                  name='confirm_password'
                  autoComplete='on'
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

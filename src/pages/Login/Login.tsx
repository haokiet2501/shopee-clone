import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from 'src/utils/rules'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { omit } from 'lodash'
import { ErrorResponse } from 'src/types/utils.type'
import authApi from 'src/apis/auth.api'
import Input from 'src/components/Input'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import path from 'src/constants/path'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(loginSchema) })

  const loginAccMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) =>
      authApi.loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginAccMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (
          isAxiosUnprocessableEntityError<
            ErrorResponse<Omit<FormData, 'confirm_password'>>
          >(error)
        ) {
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
              <form
                onSubmit={onSubmit}
                className='rounded bg-white p-10 shadow-md'
              >
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
                  <Button
                    isLoading={loginAccMutation.isLoading}
                    disabled={loginAccMutation.isLoading}
                    className='hover:text-bg-600 flex w-full items-center justify-center bg-red-600 px-2 py-4 text-sm uppercase text-white disabled:opacity-80'
                  >
                    Đăng nhập
                  </Button>
                </div>
                <div className='mt-8 flex items-center justify-center'>
                  <span className='mr-1 text-qs-form'>
                    Bạn mới biết đến Shopee?
                  </span>
                  <Link className='text-orange' to={path.register}>
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

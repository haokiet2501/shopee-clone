import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import authApi from 'src/api/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { AppContext } from 'src/contexts/app.context'
import path from 'src/constants/path'
import type { ErrorResponse } from 'src/types/utils.type'
import { schema, type Schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Omit<Schema, 'confirm_password'>
const loginSchema = schema.omit(['confirm_password'])

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // Gọi api để login.
  const loginAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    console.log(data)
    // Gọi loginAM.mutate để xử lí đăng nhập.
    loginAccountMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        // Bắt lỗi 422 từ server.
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
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
    <div className='bg-orange-75'>
      <div className='container px-12'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng Nhập</div>
              <Input
                name='email'
                type='email'
                placeholder='Email'
                register={register}
                className='mt-8'
                errorMessage={errors.email?.message}
              />
              <Input
                name='password'
                type='password'
                placeholder='Password'
                register={register}
                className='mt-2'
                autoComplete='on'
                errorMessage={errors.password?.message}
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='w-full py-4 px-2 uppercase bg-orange-75 text-white text-sm hover:opacity-91 flex justify-center items-center'
                  isLoading={loginAccountMutation.isPending}
                  disabled={!isValid || loginAccountMutation.isPending}
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='flex items-center justify-center mt-8'>
                <span className='text-gray-75 mr-1'>Bạn chưa có tài khoản?</span>
                <Link to={path.register} className='text-orange-75 cursor-pointer'>
                  Đăng kí
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

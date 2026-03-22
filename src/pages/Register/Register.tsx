import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from 'src/components/Input'
import { schema, type Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/api/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import type { ErrorResponse } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import path from 'src/constants/path'

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirm_password: ''
    }
  })

  // Gọi api để register.
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    // Body dùng omit để loại bỏ confirm_password k dùng đến để đăng kí account.
    const body = omit(data, ['confirm_password'])
    // Gọi registerAM.mutate để xử lí đăng kí.
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        // Bắt lỗi 422 từ server.
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
          // if(formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }
          // if(formError?.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   })
          // }
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
              <div className='text-2xl'>Đăng Ký</div>
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
              <Input
                name='confirm_password'
                type='password'
                placeholder='Confirm Password'
                register={register}
                className='mt-2'
                autoComplete='on'
                errorMessage={errors.confirm_password?.message}
              />
              <div className='mt-2'>
                <Button
                  type='submit'
                  className='w-full flex justify-center items-center py-4 px-2 uppercase bg-orange-75 text-white text-sm hover:opacity-91'
                  isLoading={registerAccountMutation.isPending}
                  disabled={!isValid || registerAccountMutation.isPending}
                >
                  Đăng kí
                </Button>
              </div>
              <div className='flex items-center justify-center mt-8'>
                <span className='text-gray-75 mr-1'>Bạn đã có tài khoản?</span>
                <Link to={path.login} className='text-orange-75 cursor-pointer'>
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

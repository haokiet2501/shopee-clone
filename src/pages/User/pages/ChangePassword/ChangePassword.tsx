import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { useForm } from 'react-hook-form'
import { UserSchema, userSchema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { useMutation } from '@tanstack/react-query'
import userAPi from 'src/apis/user.api'
import { omit } from 'lodash'
import { ObjectSchema } from 'yup'

type FormData = Pick<
  UserSchema,
  'password' | 'new_password' | 'confirm_password'
>

const passwordSchema = userSchema.pick([
  'password',
  'new_password',
  'confirm_password'
])

export default function ChangePassword() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(passwordSchema as ObjectSchema<FormData>)
  })
  const updateProfileMutation = useMutation(userAPi.updateProfile)

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(
        omit(data, ['confirm_password'])
      )
      toast.success(res.data.message)
      reset()
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
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
  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>
          Đổi mật khẩu
        </h1>
        <div className='mt-1 text-sm text-gray-700'>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
      </div>
      <form onSubmit={onSubmit} className='mr-auto mt-8 max-w-2xl'>
        <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
          <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>
            Mật khẩu cũ
          </div>
          <div className='sm:w-[80%] sm:pl-5'>
            <Input
              register={register}
              name='password'
              type='password'
              placeholder='Nhập mật khẩu cũ'
              errorMessage={errors.password?.message}
            />
          </div>
          <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>
            Mật khẩu mới
          </div>
          <div className='sm:w-[80%] sm:pl-5'>
            <Input
              register={register}
              name='new_password'
              type='password'
              placeholder='Nhập mật khẩu mới'
              errorMessage={errors.new_password?.message}
            />
          </div>
          <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>
            Nhập lại mật khẩu
          </div>
          <div className='sm:w-[80%] sm:pl-5'>
            <Input
              register={register}
              name='confirm_password'
              type='password'
              placeholder='Nhập lại mật khẩu mới'
              errorMessage={errors.confirm_password?.message}
            />
          </div>
        </div>

        <div className='mt-8 flex flex-col flex-wrap sm:flex-row'>
          <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'></div>
          <div className='sm:w-[80%] sm:pl-5'>
            <Button
              type='submit'
              className='flex h-9 items-center bg-orange px-6 text-center text-sm text-white hover:bg-orange/80'
            >
              Lưu
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

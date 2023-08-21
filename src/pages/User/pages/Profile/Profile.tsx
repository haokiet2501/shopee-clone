import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import userAPi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { UserSchema, userSchema } from 'src/utils/rules'

type FormData = Pick<
  UserSchema,
  'name' | 'address' | 'phone' | 'avatar' | 'date_of_birth'
>

const profileSchema = userSchema.pick([
  'name',
  'address',
  'phone',
  'avatar',
  'date_of_birth'
])

export default function Profile() {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    setValue,
    setError,
    watch
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: userAPi.getProfile
  })

  const profile = profileData?.data.data

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name || '')
      setValue('address', profile.address || '')
      setValue('phone', profile.phone || '')
      setValue('avatar', profile.avatar || '')
      setValue(
        'date_of_birth',
        profile.date_of_birth
          ? new Date(profile.date_of_birth)
          : new Date(1990, 0, 1)
      )
    }
  }, [profile, setValue])

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>
          Hồ sơ của tôi
        </h1>
        <div className='mt-1 text-sm text-gray-700'>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start'>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>
              Email
            </div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>
              Tên
            </div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                register={register}
                name='name'
                placeholder='Tên'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>
              Số điện thoại
            </div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    placeholder='Số điện thoại'
                    errorMessage={errors.phone?.message}
                    {...field}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>
              Địa chỉ
            </div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                register={register}
                name='address'
                placeholder='Địa chỉ'
                errorMessage={errors.address?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>
              Ngày sinh
            </div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='flex justify-between'>
                <select className='h-10 w-[32%] rounded-sm border border-black/10 px-3'>
                  Ngày
                </select>
                <select className='h-10 w-[32%] rounded-sm border border-black/10 px-3'>
                  Tháng
                </select>
                <select className='h-10 w-[32%] rounded-sm border border-black/10 px-3'>
                  Năm
                </select>
              </div>
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
        </div>
        <div className='md:border-l-gray.200 flex justify-center md:w-72 md:border-l'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img
                src='https://images.unsplash.com/photo-1619410283995-43d9134e7656?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'
                alt=''
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <input type='file' accept='.jpg, .jpeg, .png' className='hidden' />
            <button
              type='button'
              className='flex h-10 items-center justify-center rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
            >
              Chọn ảnh
            </button>
            <div className='mt-3 text-xs text-gray-400'>
              <div>Dung lượng ảnh tối đa 1MB</div>
              <div>Định dạng: .JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

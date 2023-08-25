import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect, useRef, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import userAPi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { UserSchema, userSchema } from 'src/utils/rules'
import DateSelect from '../../components/DateSelect'
import { AppContext } from 'src/contexts/app.context'
import { toast } from 'react-toastify'
import { setProfileToLS } from 'src/utils/auth'
import { getAvatarUrl, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import config from 'src/constants/config'

type FormData = Pick<
  UserSchema,
  'name' | 'address' | 'phone' | 'avatar' | 'date_of_birth'
>

type FormDataError = Omit<FormData, 'date_of_birth'> & { date_of_birth: string }

const profileSchema = userSchema.pick([
  'name',
  'address',
  'phone',
  'avatar',
  'date_of_birth'
])

// Flow 1:
// Nhấn upload: upload ảnh lên server luôn => server trả về url ảnh.
// Nhấn submit thì gửi url ảnh cộng với data lên server.
// => Nhanh dễ bị spam -> Dễ bị spam.

// Flow 2:
// Nhấn upload: không upload lên server.
// Nhấn submit thì tiến hành upload lên server, nếu upload thành công thì tiến hành gọi api.
// Chậm hơn flow 1 nhưng đảm bảo hơn.

export default function Profile() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setProfile } = useContext(AppContext)
  const [file, setFile] = useState<File>()
  const filePreviewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : null
  }, [file])

  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userAPi.getProfile
  })

  const profile = profileData?.data.data
  const updateProfileMutation = useMutation(userAPi.updateProfile)
  const uploadAvatarMutation = useMutation(userAPi.uploadAvatar)

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

  const avatar = watch('avatar')

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name || '')
      setValue('phone', profile.phone || '')
      setValue('address', profile.address || '')
      setValue('avatar', profile.avatar || '')
      setValue(
        'date_of_birth',
        profile.date_of_birth
          ? new Date(profile.date_of_birth)
          : new Date(1990, 0, 1)
      )
    }
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data
        setValue('avatar', avatarName)
      }
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      setProfile(res.data.data)
      setProfileToLS(res.data.data)
      refetch()
      toast.success(res.data.message)
    } catch (error) {
      if (
        isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)
      ) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = e.target.files?.[0]
    if (
      fileFromLocal &&
      (fileFromLocal.size >= config.maxSizeUploadAvatar ||
        !fileFromLocal.type.includes('image'))
    ) {
      toast.error('Dung lượng tối đa là 1MB, Định dạng: .JPEG, .PNG', {
        position: 'top-center'
      })
    } else {
      setFile(fileFromLocal)
    }
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

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
      <form
        onSubmit={onSubmit}
        className='mt-8 flex flex-col-reverse md:flex-row md:items-start'
      >
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

          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DateSelect
                errorMessage={errors.date_of_birth?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

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
                src={filePreviewImage || getAvatarUrl(avatar)}
                alt=''
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <input
              type='file'
              accept='.jpg, .jpeg, .png'
              className='hidden'
              ref={fileInputRef}
              onChange={handleInputFile}
              onClick={(e) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(e.target as any).value = null
              }}
            />
            <button
              type='button'
              className='flex h-10 items-center justify-center rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
              onClick={handleUpload}
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

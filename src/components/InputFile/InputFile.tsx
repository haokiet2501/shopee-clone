import { Fragment, useRef } from 'react'
import { toast } from 'react-toastify'
import config from 'src/constants/config'

interface Props {
  onChange?: (file?: File) => void
}

export default function InputFile({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      // setFile(fileFromLocal)
      onChange && onChange(fileFromLocal)
    }
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <Fragment>
      {' '}
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
    </Fragment>
  )
}

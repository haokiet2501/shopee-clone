import type { UseFormRegister, RegisterOptions } from 'react-hook-form'

interface Props {
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  errorMessage?: string
  className: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
  rules?: RegisterOptions
  autoComplete?: string
}

export default function Input({
  type,
  className,
  register,
  errorMessage,
  placeholder,
  rules,
  autoComplete,
  name
}: Props) {
  return (
    <div className={className}>
      <input
        type={type}
        className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...register(name, rules)}
      />
      <div className='mt-1 min-h-[1.25rem] text-xs text-red-600'>{errorMessage}</div>
    </div>
  )
}

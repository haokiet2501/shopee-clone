import { InputHTMLAttributes, forwardRef, useState } from 'react'

export interface InputNumberProps
  extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  function InputNumberInner(
    {
      className,
      errorMessage,
      classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
      classNameError = 'mt-1 min-h-[1.25rem] text-xs text-red-600',
      onChange,
      value = '',
      ...rest
    },
    ref
  ) {
    const [localValue, setLocalValue] = useState<string>(value as string)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      if ((/^\d+$/.test(value) || value === '') && onChange) {
        // Thực thi onChange callback từ bên ngoài truyền vào props
        onChange && onChange(event)
        // Cập nhật localValue state
        setLocalValue(value)
      }
    }
    return (
      <div className={className}>
        <input
          className={classNameInput}
          onChange={handleChange}
          {...rest}
          value={value || localValue}
          ref={ref}
        />
        <div className={classNameError}>{errorMessage}</div>
      </div>
    )
  }
)

export default InputNumber

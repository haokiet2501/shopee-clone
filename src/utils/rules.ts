import type { RegisterOptions } from "react-hook-form"
import type { FormData } from "src/pages/Register/Register"

type Rules = {[K in keyof FormData]?: RegisterOptions<FormData, K>}

export const rules: Rules = {
  email: {
    required: {
      value: true,
      message: 'Email là bắt buộc.'
    }, 
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Email không đúng định dạng.'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài phải từ 5 - 160 kí tự.'
    },
    minLength: {
      value: 5,
      message: 'Độ dài phải từ 5 - 160 kí tự.'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Mật khẩu là bắt buộc.'
    },
    maxLength: {
      value: 160,
      message: 'Mật khẩu phải từ 6 - 160 kí tự.'
    },
    minLength: {
      value: 6,
      message: 'Mật khẩu phải từ 6 - 160 kí tự.'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Nhập lại mật khẩu là bắt buộc.'
    },
    maxLength: {
      value: 160,
      message: 'Mật khẩu phải từ 6 - 160 kí tự.'
    },
    minLength: {
      value: 6,
      message: 'Mật khẩu phải từ 6 - 160 kí tự.'
    }
  }
}
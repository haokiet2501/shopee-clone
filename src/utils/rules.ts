// import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
// import type { FormData } from 'src/pages/Register/Register'
import * as yup from 'yup'

// type Rules = { [K in keyof FormData]?: RegisterOptions<FormData, K> }

// export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
//   email: {
//     required: {
//       value: true,
//       message: 'Email là bắt buộc.'
//     },
//     pattern: {
//       value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//       message: 'Email không đúng định dạng.'
//     },
//     maxLength: {
//       value: 160,
//       message: 'Độ dài phải từ 5 - 160 kí tự.'
//     },
//     minLength: {
//       value: 5,
//       message: 'Độ dài phải từ 5 - 160 kí tự.'
//     }
//   },
//   password: {
//     required: {
//       value: true,
//       message: 'Mật khẩu là bắt buộc.'
//     },
//     maxLength: {
//       value: 160,
//       message: 'Mật khẩu phải từ 6 - 160 kí tự.'
//     },
//     minLength: {
//       value: 6,
//       message: 'Mật khẩu phải từ 6 - 160 kí tự.'
//     }
//   },
//   confirm_password: {
//     required: {
//       value: true,
//       message: 'Nhập lại mật khẩu là bắt buộc.'
//     },
//     maxLength: {
//       value: 160,
//       message: 'Mật khẩu phải từ 6 - 160 kí tự.'
//     },
//     minLength: {
//       value: 6,
//       message: 'Mật khẩu phải từ 6 - 160 kí tự.'
//     },
//     validate:
//       typeof getValues === 'function'
//         ? (value) => value === getValues('password') || 'Nhập lại mật khẩu không khớp'
//         : undefined
//   }
// })

export const schema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc.')
    .email('Email không đúng định dạng.')
    .max(160, 'Độ dài phải từ 5 - 160 kí tự.')
    .min(5, 'Độ dài phải từ 5 - 160 kí tự.'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc.')
    .max(160, 'Mật khẩu phải từ 6 - 160 kí tự.')
    .min(6, 'Mật khẩu phải từ 6 - 160 kí tự.'),
  confirm_password: yup
    .string()
    .required('Nhập lại mật khẩu là bắt buộc.')
    .max(160, 'Nhập lại mật khẩu phải từ 6 - 160 kí tự.')
    .min(6, 'Nhập lại mật khẩu phải từ 6 - 160 kí tự.')
    .oneOf([yup.ref('password')], 'Nhập lại password không khớp.')
})

export type Schema = yup.InferType<typeof schema>
import axios, { AxiosError } from 'axios'
import { HttpStatusCode } from 'src/constants/httpStatusCode.enum'

// Tạo func để bắt lỗi từ server.
export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

// Tạo func để bắt lỗi 422
export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

// Tạo format cho giá tiền và đơn vị.
export function formatCurrenCy(currency: number) {
  return Intl.NumberFormat('de-DE').format(currency)
}

export function formatNumberToSocialStyle(value: number) {
  if(value < 1000) {
    return value.toString()
  }
  return Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
    .toLowerCase()
}

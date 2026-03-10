// Utils này là những interface tiện ích param để trả về message và data.
export interface ResponseApi<Data> {
  message: string
  data?: Data
}

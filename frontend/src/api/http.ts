import axios, { type AxiosRequestConfig } from 'axios'
import { message } from 'ant-design-vue'

const http = axios.create({
  baseURL: '/api',
  timeout: 15000
})

http.interceptors.response.use(
  (response) => {
    const body = response.data
    if (body && typeof body === 'object' && 'code' in body) {
      if (body.code === 0) {
        return body.data
      }
      message.error(body.message || '请求失败')
      return Promise.reject(new Error(body.message || '请求失败'))
    }
    return body
  },
  (error) => {
    const msg = error.response?.data?.message || '网络异常，请稍后重试'
    message.error(msg)
    return Promise.reject(new Error(msg))
  }
)

/** 拦截器已把统一响应体剥壳为 data，这里修正 TS 类型 */
export default http as unknown as {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
}

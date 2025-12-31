import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

// 定义接口返回数据的通用类型
interface ApiResponse<T = any> {
  code: number // 业务状态码（如200成功，401未登录）
  message: string // 提示信息
  data: T // 具体返回数据
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8', // 默认请求头
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
  // config配置对象，headers属性请求头，经常给服务器端携带公共参数

    // 请求头添加token（从pinia/vuex中获取）
    // const userStore = useUserStore()
    // if (userStore.token) {
    //   config.headers.set('Authorization', `Bearer ${userStore.token}`)
    // }
    return config
  },
  (error: AxiosError) => {
    // 请求拦截错误处理
    return Promise.reject(error)
  },
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message, data } = response.data

    // 业务成功（假设code=200为成功）
    if (code === 200) {
      return data
    }

    // 业务错误（如参数错误、数据不存在等）
    // alert(message || '请求失败');
    return Promise.reject(new Error(message || '请求失败'))
  },
  (error: AxiosError) => {
    // 失败回调，处理http网络错误信息
    let message = ''
    // http状态码
    const status = error.response?.status
    switch (status) {
      case 401:
        message = 'token过期'
        break
      case 403:
        message = '无权访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器内部错误'
        break
      default:
        message = `请求失败，状态码：${status}`
        break
    }
    console.error(message)
    // 中断请求
    return Promise.reject(error)
  },
)

// ========== 封装通用请求方法 ==========
/**
 * GET请求
 * @param url 接口地址
 * @param params 请求参数（url参数）
 * @param config 额外配置
 */
export function get<T = any>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
  return api.get(url, { params, ...config })
}

/**
 * POST请求
 * @param url 接口地址
 * @param data 请求体数据
 * @param config 额外配置
 */
export function post<T = any>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
  return api.post(url, data, config)
}

/**
 * PUT请求
 * @param url 接口地址
 * @param data 请求体数据
 * @param config 额外配置
 */
export function put<T = any>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
  return api.put(url, data, config)
}

/**
 * DELETE请求
 * @param url 接口地址
 * @param params 请求参数（url参数）
 * @param config 额外配置
 */
export function del<T = any>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
  return api.delete(url, { params, ...config })
}

// 对外暴露
export { api }

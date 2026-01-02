import type { RequestClientOptions } from '#/types/request-client'
import { refreshTokenApi } from '#/api'

import {
  authenticateResponseInterceptor,
  defaultResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '#/helpers'
import { useAccessStore, useAuthStore } from '#/store'

const apiURL = import.meta.env.VITE_API_BASE

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    baseURL,
  })

  // 重新认证逻辑
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ')
    const accessStore = useAccessStore()
    const authStore = useAuthStore()
    accessStore.setAccessToken(null)
    if (accessStore.isAccessChecked) {
      accessStore.setLoginExpired(true)
    }
    else {
      await authStore.logout()
    }
  }

  // 刷新token逻辑
  async function doRefreshToken() {
    const accessStore = useAccessStore()
    const resp = await refreshTokenApi()
    const newToken = resp.data
    accessStore.setAccessToken(newToken)
    return newToken
  }

  // 格式化token
  function formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null
  }

  // 请求拦截-请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore()

      config.headers.Authorization = formatToken(accessStore.accessToken)
      return config
    },
  })

  // 响应拦截-处理返回的响应数据格式
  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: 'code',
      dataField: 'data',
      successCode: 200,
    }),
  )

  // 响应拦截-token过期的处理
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      formatToken,
    }),
  )

  // 响应拦截-通用的错误处理
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      // 可以根据业务进行定制,拿到 error 内的信息进行定制化处理，根据不同的 code 做不同的提示，而不是直接使用 message.error 提示 msg
      // 当前mock接口返回的错误字段是 error 或者 message
      const responseData = error?.response?.data ?? {}
      const errorMessage = responseData?.error ?? responseData?.message ?? ''
      // 如果没有错误信息，则会根据状态码进行提示
      console.error(errorMessage || msg)
    }),
  )

  return client
}

export const requestClient = createRequestClient(apiURL, {
  responseReturn: 'data',
})

export const baseRequestClient = new RequestClient({ baseURL: apiURL })

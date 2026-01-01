import type { RequestClientConfig, RequestClientOptions } from '#/types/request-client'
import type { AxiosInstance, AxiosResponse } from 'axios'

import axios from 'axios'

import { defu as merge } from 'defu'

import qs from 'qs'

import { isString } from '../utils/inference'
import { FileDownloader } from './downloader'
import { InterceptorManager } from './interceptor'
import { FileUploader } from './uploader'

function getParamsSerializer(
  paramsSerializer: RequestClientOptions['paramsSerializer'],
) {
  if (isString(paramsSerializer)) {
    switch (paramsSerializer) {
      case 'brackets': {
        return (params: any) =>
          qs.stringify(params, { arrayFormat: 'brackets' })
      }
      case 'comma': {
        return (params: any) => qs.stringify(params, { arrayFormat: 'comma' })
      }
      case 'indices': {
        return (params: any) =>
          qs.stringify(params, { arrayFormat: 'indices' })
      }
      case 'repeat': {
        return (params: any) => qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }
  }
  return paramsSerializer
}

class RequestClient {
  public addRequestInterceptor: InterceptorManager['addRequestInterceptor']
  public addResponseInterceptor: InterceptorManager['addResponseInterceptor']

  public download: FileDownloader['download']
  public readonly instance: AxiosInstance
  public isRefreshing = false
  public upload: FileUploader['upload']
  public refreshTokenQueue: ((token: string) => void)[] = []

  /**
   * 构造函数，用于创建Axios实例
   * @param options - Axios请求配置，可选
   */
  constructor(options: RequestClientOptions = {}) {
    // 合并默认配置和传入的配置
    const defaultConfig: RequestClientOptions = {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      responseReturn: 'raw',
      timeout: 10000, // 10s超时
    }
    const { ...axiosConfig } = options
    const requestConfig = merge(axiosConfig, defaultConfig)

    requestConfig.paramsSerializer = getParamsSerializer(
      requestConfig.paramsSerializer,
    )

    this.instance = axios.create(requestConfig)

    // bindMethods(this)

    // 实例化拦截器
    const interceptorManager = new InterceptorManager(this.instance)
    this.addRequestInterceptor = interceptorManager.addRequestInterceptor.bind(interceptorManager)
    this.addResponseInterceptor = interceptorManager.addResponseInterceptor.bind(interceptorManager)

    // 实例化文件上传器
    const fileUploader = new FileUploader(this)
    this.upload = fileUploader.upload.bind(fileUploader)

    // 实例化文件下载器
    const fileDownloader = new FileDownloader(this)
    this.download = fileDownloader.download.bind(fileDownloader)
  }

  //  获取基础URL
  public getBaseUrl() {
    return this.instance.defaults.baseURL
  }

  // DELETE请求方法
  public delete<T = any>(url: string, config?: RequestClientConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' })
  }

  // GET请求方法
  public get<T = any>(url: string, config?: RequestClientConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' })
  }

  // POST请求方法
  public post<T = any>(url: string, data?: any, config?: RequestClientConfig): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'POST' })
  }

  // PUT请求方法
  public put<T = any>(url: string, data?: any, config?: RequestClientConfig): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'PUT' })
  }

  // 通用的请求方法
  public async request<T>(url: string, config: RequestClientConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance({
        url,
        ...config,
        ...(config.paramsSerializer
          ? { paramsSerializer: getParamsSerializer(config.paramsSerializer) }
          : {}),
      })
      return response as T
    }
    catch (error: any) {
      throw error.response ? error.response.data : error
    }
  }
}

export { RequestClient }

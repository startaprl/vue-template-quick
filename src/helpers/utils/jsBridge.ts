/*
 * jsBridge.ts
 * 1. 业务层调用方式统一：jsBridge.xxx()
 * 2. 内部兼容 Android（window.JSBridge.xxx）/ iOS（WebViewJavascriptBridge.callHandler）
 */

import { UAParser } from 'ua-parser-js'

// 全局类型声明
declare global {
  interface Window {
    // Android 注入对象
    JSBridge?: {
      [key: string]: any
    }

    // iOS WebView Bridge
    WebViewJavascriptBridge?: {
      callHandler: (
        handlerName: string,
        data: any,
        callback?: (responseData: any) => void,
      ) => void
    }

    WVJBCallbacks?: Array<(bridge: any) => void>
  }
}

const parser = new UAParser()
const result = parser.getResult()

const isIOS = result.os.name === 'iOS' || result.os.name === 'macOS'
const isAndroid = result.os.name === 'Android'

console.warn('环境检查:', result.os.name)

function setupWebViewJavascriptBridge(callback: (bridge: any) => void) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge)
  }

  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }

  window.WVJBCallbacks = [callback]

  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
  document.documentElement.appendChild(iframe)

  setTimeout(() => {
    document.documentElement.removeChild(iframe)
  }, 0)
}

class JSBridge {
  private iosBridge: any = null
  private readyPromise: Promise<any> | null = null

  /**
   * Promise 超时包装器
   */
  private withTimeout<T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout>
    const timeoutPromise = new Promise<T>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(errorMsg))
      }, ms)
    })

    return Promise.race([
      promise.then((res) => {
        clearTimeout(timeoutId)
        return res
      }),
      timeoutPromise,
    ])
  }

  /**
   * 等待 IOS Bridge 准备就绪
   */
  private async readyBridge(): Promise<any> {
    if (this.iosBridge) {
      return this.iosBridge
    }

    if (this.readyPromise) {
      return this.readyPromise
    }

    this.readyPromise = new Promise((resolve) => {
      setupWebViewJavascriptBridge((bridge) => {
        bridge.init?.(() => { })
        this.iosBridge = bridge
        resolve(bridge)
      })
    })

    try {
      return await this.withTimeout(this.readyPromise, 3000, 'IOS Bridge 初始化超时')
    }
    catch (error) {
      this.readyPromise = null // 超时后允许重试
      throw error
    }
  }

  /**
   * 统一调用 IOS 方法的包装器
   */
  private async callIOSHandler(handlerName: string, data: any = null): Promise<any> {
    await this.readyBridge()
    if (!this.iosBridge?.callHandler) {
      return Promise.reject(new Error('IOS Bridge callHandler 方法不存在'))
    }

    const callPromise = new Promise((resolve) => {
      this.iosBridge.callHandler(handlerName, data, (response: any) => {
        resolve(response)
      })
    })

    return this.withTimeout(callPromise, 3000, `调用原生 ${handlerName} 超时`)
  }

  /*
   * getToken:
   * Android: window.JSBridge.getToken()
   * iOS: this.iosBridge.callHandler('getToken', {}, callback)
   * */
  async getToken(): Promise<string> {
    // iOS
    if (isIOS) {
      try {
        const res = await this.callIOSHandler('getToken')
        return typeof res === 'string' ? res : (res?.token || '')
      }
      catch (error: any) {
        return Promise.reject(new Error(`调用原生 getToken 失败: ${error.message || error}`))
      }
    }

    // Android
    if (isAndroid) {
      if (!window.JSBridge || typeof window.JSBridge.getToken !== 'function') {
        return Promise.reject(new Error('Android JSBridge.getToken 方法不存在'))
      }

      try {
        return Promise.resolve(window.JSBridge.getToken())
      }
      catch (syncError) {
        return Promise.reject(new Error(`调用 Android getToken 失败: ${syncError}`))
      }
    }

    return Promise.reject(new Error('调用原生 getToken 失败: 非移动端环境'))
  }

  /*
   * jumpPage:
   * Android: window.JSBridge.jumpPage(url)
   * iOS: this.iosBridge.callHandler('jumpPage', { url }, callback)
   * */
  async jumpPage(url: string): Promise<any> {
    try {
      // iOS 分支
      if (isIOS) {
        let path = url
        // 如果是/address/list，替换为ios要求的地址路径
        if (url.includes('/address/list')) {
          path = url.replace('/address/list', '/draw/selectAddress')
        }
        console.warn('fullURL:', path)

        return await this.callIOSHandler('jumpPage', { path })
      }

      // Android 分支
      if (isAndroid) {
        console.warn('fullURL:', url)

        if (!window.JSBridge || typeof window.JSBridge.jumpPage !== 'function') {
          return Promise.reject(new Error('Android JSBridge.jumpPage 方法不存在'))
        }

        return Promise.resolve(window.JSBridge.jumpPage(url))
      }

      throw new Error('调用原生 jumpPage 失败: 非移动端环境')
    }
    catch (error: any) {
      return Promise.reject(error instanceof Error ? error : new Error(String(error)))
    }
  }
}

export const jsBridge = new JSBridge()

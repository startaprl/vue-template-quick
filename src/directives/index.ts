import type { App } from 'vue'
import debounce from './debounce'

/**
 * 注册全局自定义指令
 * @param app Vue 实例
 */
export function setupDirectives(app: App) {
  app.directive('debounce', debounce)
}

export {
  debounce,
}

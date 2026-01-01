import type { MenuRecordRaw } from '#/types/menu-record'

import type { RouteRecordRaw } from 'vue-router'

import { acceptHMRUpdate, defineStore } from 'pinia'

type AccessToken = null | string

interface AccessState {
  /**
   * 权限码
   */
  accessCodes: string[]
  /**
   * 可访问的菜单列表
   */
  accessMenus: MenuRecordRaw[]
  /**
   * 可访问的路由列表
   */
  accessRoutes: RouteRecordRaw[]
  /**
   * 登录 accessToken
   */
  accessToken: AccessToken
  /**
   * 是否已经检查过权限
   */
  isAccessChecked: boolean
  /**
   * 是否锁屏状态
   */
  isLockScreen: boolean
  /**
   * 锁屏密码
   */
  lockScreenPassword?: string
  /**
   * 登录是否过期
   */
  loginExpired: boolean
  /**
   * 登录 accessToken
   */
  refreshToken: AccessToken
}

/**
 * @zh_CN 访问权限相关
 */
export const useAccessStore = defineStore('access', {
  state: (): AccessState => ({
    accessCodes: [],
    accessMenus: [],
    accessRoutes: [],
    accessToken: null,
    isAccessChecked: false,
    isLockScreen: false,
    lockScreenPassword: undefined,
    loginExpired: false,
    refreshToken: null,
  }),
  actions: {
    getMenuByPath(path: string) {
      function findMenu(menus: MenuRecordRaw[], path: string): MenuRecordRaw | undefined {
        for (const menu of menus) {
          if (menu.path === path) {
            return menu
          }
          if (menu.children) {
            const matched = findMenu(menu.children, path)
            if (matched) {
              return matched
            }
          }
        }
      }
      return findMenu(this.accessMenus, path)
    },
    lockScreen(password: string) {
      this.isLockScreen = true
      this.lockScreenPassword = password
    },
    setAccessCodes(codes: string[]) {
      this.accessCodes = codes
    },
    setAccessMenus(menus: MenuRecordRaw[]) {
      this.accessMenus = menus
    },
    setAccessRoutes(routes: RouteRecordRaw[]) {
      this.accessRoutes = routes
    },
    setAccessToken(token: AccessToken) {
      this.accessToken = token
    },
    setIsAccessChecked(isAccessChecked: boolean) {
      this.isAccessChecked = isAccessChecked
    },
    setLoginExpired(loginExpired: boolean) {
      this.loginExpired = loginExpired
    },
    setRefreshToken(token: AccessToken) {
      this.refreshToken = token
    },
    unlockScreen() {
      this.isLockScreen = false
      this.lockScreenPassword = undefined
    },
  },
  persist: {
    // key: 'my-cart', // 自定义存储的key
    storage: localStorage, // 可选 sessionStorage
    // 自定义序列化/反序列化逻辑
    serializer: {
      serialize: (state: any) => JSON.stringify(state),
      deserialize: (value: string) => JSON.parse(value),
    },
    // 持久化
    pick: [
      'accessToken',
      'refreshToken',
      'accessCodes',
      'isLockScreen',
      'lockScreenPassword',
    ],
  },
})

// 解决热更新问题
const hot = import.meta.hot
if (hot) {
  hot.accept(acceptHMRUpdate(useAccessStore, hot))
}

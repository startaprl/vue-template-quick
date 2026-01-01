import type { Recordable } from '#/types/helper'
import type { UserInfo } from '#/types/user'
import { getAccessCodesApi, getUserInfoApi, loginApi, logoutApi } from '#/api'
import { LOGIN_PATH } from '#/helpers'
import { useAccessStore, useUserStore } from '#/store'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore()
  const userStore = useUserStore()
  const router = useRouter()

  const loginLoading = ref(false)

  // 登录表单数据
  async function authLogin(
    params: Recordable<any>,
    // onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null
    try {
      loginLoading.value = true
      const { accessToken } = await loginApi(params)

      // 如果成功获取到 accessToken
      if (accessToken) {
        accessStore.setAccessToken(accessToken)

        // 获取用户信息并存储到 accessStore 中
        const [fetchUserInfoResult, accessCodes] = await Promise.all([
          fetchUserInfo(),
          getAccessCodesApi(),
        ])

        userInfo = fetchUserInfoResult

        userStore.setUserInfo(userInfo)
        accessStore.setAccessCodes(accessCodes)

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false)
        }
        else {
          // onSuccess
          //   ? await onSuccess?.()
          //   : await router.push(userInfo.homePath || )
        }
        //  * sidebar-nav 侧边菜单布局
        //  * header-nav 顶部菜单布局
        //  * mixed-nav 侧边&顶部菜单布局
        //  * sidebar-mixed-nav 侧边混合菜单布局
        //  * full-content 全屏内容布局
        // type LayoutType =
        //   | 'full-content'
        //   | 'header-mixed-nav'
        //   | 'header-nav'
        //   | 'header-sidebar-nav'
        //   | 'mixed-nav'
        //   | 'sidebar-mixed-nav'
        //   | 'sidebar-nav';
        // if (userInfo?.roles?.includes('admin')) {
        //   updatePreferences({
        //     app: {
        //       layout: 'sidebar-nav',
        //     },
        //   })
        // }
        // else {
        //   updatePreferences({
        //     app: {
        //       layout: 'header-nav',
        //     },
        //   })
        // }
        // if (userInfo?.realName) {
        //   notification.success({
        //     description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.realName}`,
        //     duration: 3,
        //     message: $t('authentication.loginSuccess'),
        //   })
        // }
      }
    }
    finally {
      loginLoading.value = false
    }

    return {
      userInfo,
    }
  }

  async function logout(redirect: boolean = true) {
    try {
      await logoutApi()
    }
    catch {
      // 不做任何处理
    }
    accessStore.setLoginExpired(false)

    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    })
  }

  async function fetchUserInfo() {
    let userInfo: null | UserInfo = null
    userInfo = await getUserInfoApi()
    userStore.setUserInfo(userInfo)
    return userInfo
  }

  function $reset() {
    loginLoading.value = false
  }

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
  }
})

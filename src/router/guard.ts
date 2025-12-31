import type { Router } from 'vue-router'

const LOGIN_PATH = '/auth/login'

/**
 * 通用守卫配置
 * @param router
 */
function setupCommonGuard(router: Router) {
  // 记录已经加载的页面
  const loadedPaths = new Set<string>()

  router.beforeEach((to) => {
    to.meta.loaded = loadedPaths.has(to.path)

    // 页面加载进度条
    if (!to.meta.loaded) {
      // startProgress();
    }
    return true
  })

  router.afterEach((to) => {
    // 记录页面是否加载,如果已经加载，后续的页面切换动画等效果不在重复执行

    loadedPaths.add(to.path)

    // 关闭页面加载进度条
    // if (preferences.transition.progress) {
    //   stopProgress();
    // }

    return to
  })
}

/**
 * 权限访问守卫配置
 * @param router
 */
function setupAccessGuard(router: Router) {
  router.beforeEach(async (to) => {
    // const accessStore = useAccessStore()
    // const userStore = useUserStore()
    // const authStore = useAuthStore()

    // accessToken 检查  !accessStore.accessToken
    if (false) {
      // 明确声明忽略权限访问权限，则可以访问
      if (to.meta.ignoreAccess) {
        return true
      }

      // 没有访问权限，跳转登录页面
      if (to.fullPath !== LOGIN_PATH) {
        return {
          path: LOGIN_PATH,
          replace: true,
        }
      }
    }

    // 当前登录用户拥有的角色标识列表
    // const userInfo = userStore.userInfo || (await authStore.fetchUserInfo());
    // const userRoles = userInfo.roles ?? [];

    // accessStore.setIsAccessChecked(true)
  })
}

/**
 * 项目守卫配置
 * @param router
 */
function createRouterGuard(router: Router) {
  /** 通用 */
  setupCommonGuard(router)
  /** 权限访问 */
  setupAccessGuard(router)
}

export { createRouterGuard }

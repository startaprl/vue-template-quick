import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { createRouterGuard } from './guard'
import { routes } from './routes'

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === 'hash'
      ? createWebHashHistory(import.meta.env.VITE_BASE)
      : createWebHistory(import.meta.env.VITE_BASE),
  routes,
  // 滚动行为控制
  scrollBehavior: (to, _from, savedPosition) => {
    if (savedPosition) {
      return savedPosition || { top: 0 }
    }
    return to.hash ? { behavior: 'smooth', el: to.hash } : { left: 0, top: 0 }
  },
  // 是否应该禁止尾部斜杠。
  // strict: true,
})

// 创建路由守卫
createRouterGuard(router)

export { router }

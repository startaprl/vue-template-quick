import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-account-balance',
      order: 1000,
      title: '首页',
    },
    name: 'Home',
    path: '/home',
    redirect: '/home/index',
    children: [
      {
        meta: {
          title: '首页',
          icon: 'ic:baseline-accessibility',
        },
        name: 'homeIndex',
        path: '/home/index',
        component: () => import('#/views/home/index.vue'),
      },
    ],
  },
]

export default routes

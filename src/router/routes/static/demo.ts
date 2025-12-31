import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: '',
      order: 9999,
      title: 'Demo',
    },
    name: 'Demo',
    path: '/demo',
    redirect: '/demo/index',
    children: [
      {
        meta: {
          title: '首页',
          icon: '',
        },
        name: 'demoIndex',
        path: '/demo/index',
        component: () => import('#/views/demo/demo.vue'),
      },
    ],
  },
]

export default routes

import type { RouteRecordRaw } from 'vue-router'
import { mergeRouteModules } from '#/helpers'

const staticRouteFiles = import.meta.glob('./static/**/*.ts', { eager: true })
const staticRoutes: RouteRecordRaw[] = mergeRouteModules(staticRouteFiles)

const routes: RouteRecordRaw[] = [
  ...staticRoutes,
]

export { routes }

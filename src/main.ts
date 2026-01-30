import { jsBridge } from '#/helpers'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './App.vue'
import { setupDirectives } from './directives'

import { router } from './router'

import '#/styles/font.scss'
import '#/styles/index.scss'

import 'virtual:svg-icons-register'

const app = createApp(App)

// 配置路由及路由守卫
app.use(router)

// 注册全局自定义指令
setupDirectives(app)

// 配置pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

// JSBridge 实例
app.provide('jsBridge', jsBridge)

app.mount('#app')

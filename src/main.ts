import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

import '#/styles/index.scss'
import 'virtual:svg-icons-register'

const app = createApp(App)

// 配置路由及路由守卫
app.use(router)

// 配置pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

app.mount('#app')

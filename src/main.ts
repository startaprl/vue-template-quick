import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import '@/styles/index.scss'

// svg插件注册脚本
import 'virtual:svg-icons-register'

const app = createApp(App)

// 配置路由及路由守卫
app.use(router)

app.mount('#app')

<script setup lang="ts">
import { getUserInfo, login } from '#/api/demo'
import SvgIcon from '#/components/SvgIcon.vue'
import { onMounted, ref } from 'vue'

const userInfo = ref<any>(null)

// 登录示例
async function handleLogin() {
  try {
    const res = await login('admin', '123456')
    // ElMessage.success('登录成功')
    console.error('token:', res.token)
  }
  catch (error) {
    console.error('登录失败:', error)
  }
}

// 获取用户信息示例
onMounted(async () => {
  try {
    const res = await getUserInfo()
    userInfo.value = res
  }
  catch (error) {
    console.error('获取用户信息失败:', error)
  }
})
</script>

<template>
  <div>
    <button @click="handleLogin">
      发起请求
    </button>
    <div v-if="userInfo">
      <p>用户名：{{ userInfo.username }}</p>
      <p>角色：{{ userInfo.roles.join(',') }}</p>
    </div>

    <!-- SvgIcon组件用法 -->
    <SvgIcon name="vue" class="logo" />
  </div>
</template>

<style scoped lang="scss">
// 全局变量用法
h1 {
  color: $color;
}

.logo {
  width: 80px;
  height: 80px;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
</style>

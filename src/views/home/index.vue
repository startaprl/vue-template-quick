<script setup lang="ts">
import { addUserApi, getUserInfoApi } from '#/api'
import { onMounted } from 'vue'

async function getUserList() {
  const userList = await getUserInfoApi()
  console.warn('userList', userList)
}

async function addUser() {
  const data = await addUserApi({ name: '111' })
  console.warn('addUser', data)
}

onMounted(() => {
  getUserList()
  addUser()
})
</script>

<template>
  <div>
    <h1>home</h1>
  </div>
</template>

<style scoped lang="scss">
h1 {
  color: $color;
}
</style>

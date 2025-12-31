<script setup lang="ts">
import SvgIcon from '#/components/SvgIcon.vue'
</script>

<template>
  <div>
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

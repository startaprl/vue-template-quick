<script setup lang="ts">
import SvgIcon from './components/SvgIcon.vue'
</script>

<template>
  <div>
    <a>
      <SvgIcon name="vue" class="logo" />
    </a>
    <h1>Hello World</h1>
  </div>
</template>

<style scoped lang="scss">
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

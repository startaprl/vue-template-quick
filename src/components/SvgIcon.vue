<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  color?: string
  width?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: '#333',
})

// 计算 symbolId（匹配 vite 插件的 symbolId 规则：icon-[dir]-[name]）
const symbolId = computed(() => `#icon-${props.name}`)
</script>

<template>
  <svg aria-hidden="true" class="svg-icon" :style="{ color, width, height }">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<style scoped>
.svg-icon {
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>

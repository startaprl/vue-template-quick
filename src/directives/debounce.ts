import type { Directive, DirectiveBinding } from 'vue'

interface DebounceElement extends HTMLElement {
  _debounceTimer?: ReturnType<typeof setTimeout>
  _debounceHandler?: (event: Event) => void
}

/**
 * 防抖指令 v-debounce
 * 用法：
 * 1. v-debounce="2000" (点击后禁用元素 2000ms，防止重复点击)
 */
const debounce: Directive = {
  mounted(el: DebounceElement, binding: DirectiveBinding) {
    const delay = Number(binding.value) || 1000

    el._debounceHandler = function () {
      if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        if (el.disabled)
          return

        el.disabled = true
        ;(el as DebounceElement)._debounceTimer = setTimeout(() => {
          el.disabled = false
        }, delay)
      }
      else {
        // 非表单元素使用 pointer-events 控制
        if (el.style.pointerEvents === 'none')
          return

        const originalPointerEvents = el.style.pointerEvents
        el.style.pointerEvents = 'none'
        el._debounceTimer = setTimeout(() => {
          el.style.pointerEvents = originalPointerEvents
        }, delay)
      }
    }

    el.addEventListener('click', el._debounceHandler)
  },

  beforeUnmount(el: DebounceElement) {
    if (el._debounceHandler) {
      el.removeEventListener('click', el._debounceHandler)
    }
    if (el._debounceTimer) {
      clearTimeout(el._debounceTimer)
    }
  },
}

export default debounce

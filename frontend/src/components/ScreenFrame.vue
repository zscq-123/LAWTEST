<template>
  <div class="screen-bg" ref="wrapRef">
    <div
      class="screen-canvas"
      :style="{ transform: `translate(-50%, -50%) scale(${scale})` }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const scale = ref(1)
const wrapRef = ref<HTMLElement | null>(null)

function updateScale() {
  scale.value = Math.min(window.innerWidth / 1920, window.innerHeight / 1080)
}

onMounted(() => {
  updateScale()
  window.addEventListener('resize', updateScale)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScale)
})
</script>

<style scoped>
.screen-canvas {
  position: absolute;
  left: 50%;
  top: 50%;
}
</style>

<template>
  <a-config-provider :theme="themeConfig">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const themeConfig = computed(() => ({
  token: {
    colorPrimary: '#1677FF',
    colorInfo: '#1677FF',
    borderRadius: 8,
    fontSize: 16
  }
}))
</script>

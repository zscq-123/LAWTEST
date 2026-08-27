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
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#c8102e',
    borderRadius: 8,
    fontSize: 16,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
    // 大屏触控：稍大的控件圆角与按钮高度观感
    controlHeight: 36,
    motionDurationMid: '0.25s',
    motionDurationSlow: '0.35s'
  },
  components: {
    Button: {
      fontWeight: 600,
      primaryShadow: '0 0 20px rgba(22, 119, 255, 0.35)'
    },
    Modal: {
      borderRadiusLG: 16
    },
    Card: {
      borderRadiusLG: 12
    }
  }
}))
</script>

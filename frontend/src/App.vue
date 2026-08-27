<template>
  <a-config-provider :theme="themeConfig" :locale="zhCN">
    <router-view />
    <div v-if="showBrandFooter" class="brand-footer">
      <span class="footer-dot" />
      <span>法学院迎新特别活动 · 谨供新生兴趣初步画像参考</span>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

const route = useRoute()

/** 仅在大屏流程页显示底部版权条；手机端报告/收藏页隐藏避免遮挡 */
const showBrandFooter = computed(() => {
  const mobileRoutes = ['report', 'favorites']
  return !mobileRoutes.includes(String(route.name))
})

const themeConfig = computed(() => ({
  token: {
    colorPrimary: '#1677FF',
    colorInfo: '#1677FF',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#c8102e',
    colorTextBase: '#ffffff',
    colorBgBase: '#0b1220',
    colorBgContainer: 'rgba(255, 255, 255, 0.04)',
    colorBgElevated: '#131e33',
    colorBgLayout: 'transparent',
    colorBorder: 'rgba(255, 255, 255, 0.14)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    borderRadiusLG: 14,
    fontSize: 16,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
    controlHeight: 36,
    controlHeightLG: 44,
    motionDurationFast: '0.15s',
    motionDurationMid: '0.25s',
    motionDurationSlow: '0.35s',
    wireframe: false
  },
  components: {
    Button: {
      fontWeight: 600,
      primaryShadow: '0 0 20px rgba(22, 119, 255, 0.35)',
      defaultBorderColor: 'rgba(255, 255, 255, 0.18)'
    },
    Card: {
      colorBgContainer: 'rgba(255, 255, 255, 0.04)',
      colorBorderSecondary: 'rgba(255, 255, 255, 0.08)',
      borderRadiusLG: 14
    },
    Modal: {
      borderRadiusLG: 16,
      colorBgElevated: '#131e33'
    },
    Tag: {
      borderRadiusSM: 6
    },
    Statistic: {
      titleFontSize: 14,
      contentFontSize: 40
    }
  }
}))
</script>

<style scoped>
.brand-footer {
  position: fixed;
  bottom: clamp(8px, 1.4vh, 16px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 11px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.32);
  pointer-events: none;
  z-index: 1;
  white-space: nowrap;
}

.footer-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(122, 184, 255, 0.6);
}
</style>
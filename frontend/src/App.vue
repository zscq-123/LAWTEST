<template>
  <a-config-provider :theme="themeConfig" :locale="zhCN">
    <router-view />
    <!-- 大屏无人操作倒计时浮层（答题页 120s 无触屏触发） -->
    <div v-if="showIdleCountdown" class="idle-countdown" @pointerdown.stop>
      <div class="idle-countdown-mask" />
      <div class="idle-countdown-card">
        <a-result
          status="info"
          title="无人操作，即将返回首页"
          :sub-title="`${idleCountdownLeft} 秒后自动返回，供其他同学使用`"
        >
          <template #extra>
            <a-button size="large" type="primary" @click="cancelIdleCountdown">
              我还在，继续答题
            </a-button>
          </template>
        </a-result>
      </div>
    </div>
    <div v-if="showBrandFooter" class="brand-footer">
      <span class="footer-dot" />
      <span>法学院迎新特别活动 · 谨供新生兴趣初步画像参考</span>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { sendHeartbeat } from '@/api'
import { useIdentityStore } from '@/stores/identity'
import { resolveDevice } from '@/utils/device'

const route = useRoute()
const router = useRouter()
const identity = useIdentityStore()

/** 设备模式（首屏解析一次并缓存：大屏部署 ?screen=1，扫码落地 ?from=mobile） */
const device = resolveDevice()

/** 测试流程路由（答题中） */
const TEST_ROUTES = ['select', 'matching', 'reveal', 'profile', 'fitness']
/** 大屏答题页无操作超时（ms）后开始倒计时 */
const STAGE_IDLE_MS = 120_000
/** 倒计时时长（ms） */
const STAGE_COUNTDOWN_MS = 15_000
/** 手机端心跳间隔（ms） */
const HEARTBEAT_MS = 30_000

/** 仅在大屏流程页显示底部版权条；手机端报告/收藏页隐藏避免遮挡 */
const showBrandFooter = computed(() => {
  const mobileRoutes = ['report', 'favorites']
  return !mobileRoutes.includes(String(route.name))
})

// —— 手机端心跳：答题流程中每 30s 保持活跃（大屏端不发送，避免占用手机活跃位）——
let heartbeatTimer: number | undefined
function startHeartbeat() {
  if (device !== 'mobile') return
  window.clearInterval(heartbeatTimer)
  heartbeatTimer = window.setInterval(() => {
    const no = identity.identity?.studentNo
    if (no && TEST_ROUTES.includes(String(route.name))) {
      sendHeartbeat(no).catch(() => undefined)
    }
  }, HEARTBEAT_MS)
}

// —— 大屏答题页无人操作超时：倒计时后自动回首页（台上没人 → 大屏回到空闲/等待态）——
const idleCountdownLeft = ref(0)
const showIdleCountdown = computed(() => idleCountdownLeft.value > 0)
let idleTimer: number | undefined
let countdownTimer: number | undefined

function clearIdleTimers() {
  window.clearTimeout(idleTimer)
  window.clearInterval(countdownTimer)
  idleTimer = undefined
  countdownTimer = undefined
  idleCountdownLeft.value = 0
}

function resetIdle() {
  if (device !== 'screen') return
  if (!TEST_ROUTES.includes(String(route.name))) return
  clearIdleTimers()
  idleTimer = window.setTimeout(() => {
    idleCountdownLeft.value = Math.floor(STAGE_COUNTDOWN_MS / 1000)
    countdownTimer = window.setInterval(() => {
      idleCountdownLeft.value -= 1
      if (idleCountdownLeft.value <= 0) {
        clearIdleTimers()
        router.push('/')
      }
    }, 1000)
  }, STAGE_IDLE_MS)
}

function cancelIdleCountdown() {
  clearIdleTimers()
  resetIdle()
}

function onGlobalTouch() {
  resetIdle()
}

onMounted(() => {
  window.addEventListener('pointerdown', onGlobalTouch, { passive: true })
  startHeartbeat()
  resetIdle()
})

watch(
  () => route.name,
  () => {
    resetIdle()
  }
)

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', onGlobalTouch)
  window.clearInterval(heartbeatTimer)
  clearIdleTimers()
})

const themeConfig = computed(() => ({
  token: {
    colorPrimary: '#7C9AB8',
    colorPrimaryHover: '#6D89A8',
    colorPrimaryActive: '#5C7693',
    colorInfo: '#7C9AB8',
    colorSuccess: '#7AB87A',
    colorWarning: '#E0A464',
    colorError: '#c8102e',
    colorTextBase: 'rgba(52, 64, 84, 0.92)',
    colorBgBase: '#FAF7F1',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: 'transparent',
    colorBorder: 'rgba(124, 154, 184, 0.16)',
    colorBorderSecondary: 'rgba(124, 154, 184, 0.10)',
    colorText: 'rgba(52, 64, 84, 0.92)',
    colorTextSecondary: 'rgba(52, 64, 84, 0.68)',
    colorTextTertiary: 'rgba(52, 64, 84, 0.48)',
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
      primaryShadow: '0 6px 20px rgba(124, 154, 184, 0.25)',
      defaultBorderColor: 'rgba(124, 154, 184, 0.16)'
    },
    Card: {
      colorBgContainer: '#ffffff',
      colorBorderSecondary: 'rgba(124, 154, 184, 0.10)',
      borderRadiusLG: 14
    },
    Modal: {
      borderRadiusLG: 16,
      colorBgElevated: '#ffffff'
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
  color: var(--text-tertiary);
  pointer-events: none;
  z-index: 1;
  white-space: nowrap;
}

.footer-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(124, 154, 184, 0.55);
  box-shadow: 0 0 8px rgba(124, 154, 184, 0.45);
}

/* 大屏无人操作倒计时浮层 */
.idle-countdown {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.idle-countdown-mask {
  position: absolute;
  inset: 0;
  background: rgba(20, 26, 34, 0.45);
  backdrop-filter: blur(3px);
}

.idle-countdown-card {
  position: relative;
  background: var(--bg-panel);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: clamp(20px, 3vh, 36px) clamp(24px, 3vw, 48px);
  box-shadow: var(--shadow-sm);
  max-width: 480px;
  width: calc(100% - 40px);
}

.idle-countdown-card :deep(.ant-btn-lg) {
  border-radius: var(--radius-pill);
  font-weight: 600;
}
</style>
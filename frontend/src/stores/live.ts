import { computed, reactive, ref } from 'vue'
import { getLandingQr, getLiveOverview } from '@/api'
import type { LandingQr, LiveOverview } from '@/types'

/**
 * 大屏状态机与实时进度（仅大屏使用）
 * state：
 * - idle     空闲：显示落地二维码 + 引导扫码/上台
 * - waiting  手机端答题中：显示整体进度 X/Y + 鼓励文案
 * - finished 测试结束：显示结果汇总
 * （stage 台上答题由路由体现：进入测试流程即脱离本状态机，返回首页后恢复轮询）
 */
type ScreenState = 'idle' | 'waiting' | 'finished'

const state = ref<ScreenState>('idle')
const finishedCount = ref(0)
const targetCount = ref(0)
const activeMobileCount = ref(0)
const landingQr = ref<LandingQr | null>(null)

/** 目标是否已达成（X >= Y 且 Y > 0） */
const finished = computed(() => targetCount.value > 0 && finishedCount.value >= targetCount.value)

let pollTimer: number | undefined

function applyOverview(o: LiveOverview) {
  finishedCount.value = o.finishedCount
  targetCount.value = o.targetCount
  activeMobileCount.value = o.activeMobileCount
  state.value =
    o.targetCount > 0 && o.finishedCount >= o.targetCount
      ? 'finished'
      : o.activeMobileCount > 0
        ? 'waiting'
        : 'idle'
}

async function poll() {
  try {
    applyOverview(await getLiveOverview())
  } catch {
    // 网络抖动时保持上一次进度
  }
}

/** 大屏首页挂载时启动 3s 轮询 */
function startPolling() {
  if (pollTimer) return
  poll()
  pollTimer = window.setInterval(poll, 3000)
}

function stopPolling() {
  window.clearInterval(pollTimer)
  pollTimer = undefined
}

async function loadLandingQr() {
  try {
    landingQr.value = await getLandingQr()
  } catch {
    landingQr.value = null
  }
}

export function useLiveStore() {
  return reactive({
    state,
    finishedCount,
    targetCount,
    activeMobileCount,
    landingQr,
    finished,
    startPolling,
    stopPolling,
    loadLandingQr
  })
}

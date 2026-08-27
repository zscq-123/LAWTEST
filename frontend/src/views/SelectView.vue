<template>
  <ScreenFrame>
    <div class="screen-page">
      <div class="select-head">
        <div>
          <h1 class="screen-title">选择最像你的 10 个特质词</h1>
          <p class="screen-subtitle">
            每个词都属于一个职业方向，颜色代表该职业 · 核心词有虚线边框
          </p>
        </div>
        <div class="select-count">
          <a-badge :count="store.selectedCount" :max="10" show-zero>
            <div class="count-box">已选</div>
          </a-badge>
        </div>
      </div>

      <div class="select-groups">
        <div
          v-for="(career, index) in store.careers"
          :key="career.id"
          class="word-group"
          :style="{ '--career-color': career.colorCode }"
        >
          <div class="group-head">
            <span class="group-dot" :style="{ background: career.colorCode }" />
            {{ career.name }} · {{ career.colorName }}
          </div>
          <div class="group-words">
            <div
              v-for="(keyword, kwIndex) in career.keywords"
              :key="keyword.id"
              class="word-card"
              :class="{
                selected: isSelected(keyword.id),
                'core-tag': keyword.core && !isSelected(keyword.id)
              }"
              :style="{
                ...selectedStyle(career, keyword.id),
                animationDelay: `${0.05 + (index * 15 + kwIndex) * 0.035}s`
              }"
              :ref="(el) => setWordRef(keyword.id, el as HTMLElement | null)"
              @click="handleToggle(career, keyword.id, $event)"
            >
              {{ keyword.word }}
            </div>
          </div>
        </div>
      </div>

      <!-- 光点飞入能量池的飞行轨迹层 -->
      <div ref="flyLayerRef" class="fly-layer">
        <span
          v-for="f in flyingDots"
          :key="f.id"
          class="fly-dot"
          :style="{
            background: f.color,
            left: f.from.x + 'px',
            top: f.from.y + 'px',
            '--tx': f.dx + 'px',
            '--ty': f.dy + 'px'
          }"
        />
      </div>

      <div class="energy-bar">
        <div class="energy-label">实时职业能量池</div>
        <div class="energy-tracks">
          <div
            v-for="career in store.careers"
            :key="career.id"
            class="energy-track"
            :title="`${career.name}：${liveScores[career.id] || 0} 分`"
          >
            <div class="energy-fill-wrap" :ref="(el) => setEnergyRef(career.id, el as HTMLElement | null)">
              <div
                class="energy-fill"
                :class="{ pulse: liveScores[career.id] > 0 }"
                :style="{
                  height: pct(liveScores[career.id]),
                  background: career.colorCode,
                  boxShadow: `0 0 14px ${career.colorCode}88`
                }"
              />
            </div>
            <div class="energy-name">{{ career.name }}</div>
            <div class="energy-score">{{ liveScores[career.id] || 0 }}</div>
          </div>
        </div>
      </div>

      <div class="select-actions">
        <span v-if="store.selectedCount < 3" class="hint-warn">再多选几个词，结果会更准确</span>
        <span v-else class="hint-ok">已满足测试条件，可以开始匹配</span>
        <a-space :size="24">
          <a-button size="large" @click="router.push('/')">返回首页</a-button>
          <a-button
            type="primary"
            size="large"
            class="btn-primary-glow"
            :disabled="store.selectedCount < 3"
            @click="goMatching"
          >
            开始匹配
          </a-button>
        </a-space>
      </div>
    </div>
  </ScreenFrame>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import ScreenFrame from '@/components/ScreenFrame.vue'
import { postMatching } from '@/api'
import { useTestStore } from '@/stores/test'
import type { Career } from '@/types'

const store = useTestStore()
const router = useRouter()
const liveScores = reactive<Record<string, number>>({})
let debounceTimer: number | undefined

/** 词卡 DOM 引用：keywordId → 元素 */
const wordRefs = new Map<number, HTMLElement>()
function setWordRef(id: number, el: HTMLElement | null) {
  if (el) wordRefs.set(id, el)
  else wordRefs.delete(id)
}

/** 能量柱 DOM 引用：careerId → 元素 */
const energyRefs = new Map<number, HTMLElement>()
function setEnergyRef(id: number, el: HTMLElement | null) {
  if (el) energyRefs.set(id, el)
  else energyRefs.delete(id)
}

/** 飞行光点层 */
const flyLayerRef = ref<HTMLElement | null>(null)
interface FlyDot {
  id: number
  from: { x: number; y: number }
  dx: number
  dy: number
  color: string
}
const flyingDots = ref<FlyDot[]>([])
let dotId = 0

function isSelected(id: number) {
  return store.selectedIds.includes(id)
}

function selectedStyle(career: Career, id: number) {
  if (!isSelected(id)) return {}
  return {
    background: career.colorCode + '2e',
    borderColor: career.colorCode,
    boxShadow: `0 0 16px ${career.colorCode}66`
  }
}

function pct(score?: number) {
  return Math.round(((score || 0) / 20) * 100) + '%'
}

/** 点击词卡：选中后从词卡位置放出一个光点飞向该职业能量柱 */
function flyDot(career: Career, keywordId: number) {
  const fromEl = wordRefs.get(keywordId)
  const toEl = energyRefs.get(career.id)
  const layer = flyLayerRef.value
  if (!fromEl || !toEl || !layer) return
  const from = fromEl.getBoundingClientRect()
  const to = toEl.getBoundingClientRect()
  const layerRect = layer.getBoundingClientRect()
  const fx = from.left + from.width / 2 - layerRect.left
  const fy = from.top + from.height / 2 - layerRect.top
  const tx = to.left + to.width / 2 - layerRect.left
  const ty = to.top + to.height / 2 - layerRect.top
  const id = ++dotId
  flyingDots.value.push({
    id,
    from: { x: fx, y: fy },
    dx: tx - fx,
    dy: ty - fy,
    color: career.colorCode
  })
  window.setTimeout(() => {
    flyingDots.value = flyingDots.value.filter((d) => d.id !== id)
  }, 700)
}

function handleToggle(career: Career, id: number, e: MouseEvent) {
  const wasSelected = isSelected(id)
  const ok = store.toggleKeyword(id)
  if (!ok) {
    message.warning('最多只能选择10个特质词')
    return
  }
  // 选中时触发光点飞入能量池
  if (!wasSelected) {
    flyDot(career, id)
    // 词卡上触发一次光效
    const el = e.currentTarget as HTMLElement
    el.classList.remove('card-light')
    void el.offsetWidth
    el.classList.add('card-light')
  }
  scheduleLiveMatch()
}

function scheduleLiveMatch() {
  window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(async () => {
    if (!store.selectedIds.length) {
      Object.keys(liveScores).forEach((k) => (liveScores[k] = 0))
      return
    }
    try {
      const result = await postMatching(store.selectedIds)
      Object.entries(result.scores).forEach(([key, value]) => (liveScores[key] = value))
    } catch {
      // 网络异常时能量池保持上次状态
    }
  }, 300)
}

function goMatching() {
  router.push('/matching')
}

onMounted(async () => {
  try {
    await store.loadCareers()
  } catch {
    // 词库加载失败时页面给出空态，不影响后续重试
  }
  await nextTick()
  if (store.selectedIds.length) scheduleLiveMatch()
})

onBeforeUnmount(() => {
  window.clearTimeout(debounceTimer)
})
</script>

<style scoped>
.select-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.select-count :deep(.ant-badge-count) {
  font-size: clamp(14px, 1.4vw, 22px);
  height: clamp(20px, 2.2vh, 30px);
  line-height: clamp(20px, 2.2vh, 30px);
  min-width: clamp(20px, 2.2vh, 30px);
  padding: 0 clamp(4px, 0.5vw, 10px);
}

.count-box {
  font-size: clamp(14px, 1.3vw, 20px);
  color: rgba(255, 255, 255, 0.7);
}

.select-groups {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(10px, 1.3vw, 22px);
  overflow: hidden;
  margin-top: clamp(8px, 1.6vh, 20px);
}

.word-group {
  border-left: 3px solid var(--career-color);
  padding-left: clamp(8px, 0.9vw, 16px);
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.group-head {
  display: flex;
  align-items: center;
  gap: clamp(4px, 0.5vw, 9px);
  font-size: clamp(13px, 1.15vw, 19px);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: clamp(6px, 1.1vh, 14px);
  flex-shrink: 0;
}

.group-dot {
  width: clamp(9px, 0.7vw, 13px);
  height: clamp(9px, 0.7vw, 13px);
  border-radius: 50%;
  display: inline-block;
}

.group-words {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(6px, 0.75vw, 12px);
  overflow-y: auto;
  padding: clamp(2px, 0.4vh, 6px) clamp(2px, 0.3vw, 6px) clamp(4px, 0.8vh, 10px) 0;
}

/* 词卡悬浮入场：按行交错延迟 */
.group-words .word-card {
  animation: cardFloatIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* 点击光效（与全局 .card-light 不同名，避免与选中动画冲突） */
.card-light {
  animation: cardLight 0.45s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
}

.energy-bar {
  margin-top: clamp(8px, 1.5vh, 20px);
  flex-shrink: 0;
}

.energy-label {
  font-size: clamp(12px, 1vw, 16px);
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: clamp(4px, 0.7vh, 10px);
  letter-spacing: 2px;
}

.energy-tracks {
  display: flex;
  gap: clamp(10px, 1.6vw, 28px);
}

.energy-track {
  flex: 1;
  display: flex;
  align-items: center;
  gap: clamp(6px, 0.7vw, 12px);
}

.energy-fill-wrap {
  width: clamp(8px, 0.7vw, 14px);
  height: clamp(28px, 4.2vh, 52px);
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.energy-fill {
  width: 100%;
  border-radius: 6px;
  transition: height 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.energy-fill.pulse {
  animation: energyPulse 1.2s ease-in-out infinite;
}

.energy-name {
  font-size: clamp(11px, 0.95vw, 15px);
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
}

.energy-score {
  font-size: clamp(12px, 1.05vw, 16px);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

/* 飞行光点层 */
.fly-layer {
  position: fixed;
  inset: 0;
  z-index: 999;
  pointer-events: none;
}

.fly-dot {
  position: absolute;
  width: clamp(8px, 0.9vw, 14px);
  height: clamp(8px, 0.9vw, 14px);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: flyTo 0.65s cubic-bezier(0.3, 0.6, 0.4, 1) forwards;
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.35);
}

@keyframes flyTo {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0.35);
    opacity: 0;
  }
}

.select-actions {
  margin-top: clamp(8px, 1.6vh, 20px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.select-actions :deep(.ant-btn-lg) {
  height: clamp(36px, 4vh, 52px);
  padding: 0 clamp(16px, 1.8vw, 30px);
  font-size: clamp(14px, 1.25vw, 19px);
  border-radius: 24px;
}

.hint-warn {
  color: #faad14;
  font-size: clamp(13px, 1.1vw, 17px);
}

.hint-ok {
  color: #52c41a;
  font-size: clamp(13px, 1.1vw, 17px);
}
</style>

<template>
  <ScreenFrame>
    <div class="screen-page select-page">
      <!-- 顶部：标题 + 进度 -->
      <header class="select-head">
        <div>
          <h1 class="screen-title">勾选最像你的特质词</h1>
          <p class="screen-subtitle">
            每词对应一个职业方向，颜色即该职业 · 虚线边框为核心词
          </p>
        </div>
        <div class="select-progress">
          <div class="progress-label">
            <a-statistic :value="store.selectedCount" :value-style="{ color: '#fff', fontSize: '30px', fontWeight: 700 }">
              <template #suffix>
                <span class="progress-suffix">/ 10</span>
              </template>
            </a-statistic>
            <span class="progress-hint">已选 {{ store.selectedCount }} 个词 · 选满 10 个即可开始匹配</span>
          </div>
          <a-progress
            :percent="progressPercent"
            :show-info="false"
            :stroke-color="progressColor"
            :stroke-width="6"
            stroke-linecap="round"
            class="progress-bar"
          />
        </div>
      </header>

      <!-- 词卡列表 -->
      <div class="select-groups">
        <a-empty
          v-if="!store.careers.length"
          description="词库加载中…"
          class="select-empty"
        />
        <section
          v-for="career in store.careers"
          :key="career.id"
          class="word-group"
          :style="{ '--career-color': career.colorCode }"
          :aria-label="`${career.name} 词库`"
        >
          <header class="group-head">
            <span class="group-dot" />
            <span class="group-name">{{ career.name }}</span>
            <a-tag :color="career.colorCode" bordered class="group-color">
              {{ career.colorName }}
            </a-tag>
          </header>
          <div class="group-words">
            <button
              v-for="(keyword, kwIndex) in career.keywords"
              :key="keyword.id"
              type="button"
              class="word-card"
              :class="{
                selected: isSelected(keyword.id),
                'core-tag': keyword.core && !isSelected(keyword.id)
              }"
              :style="{
                animationDelay: `${0.04 + (kwIndex) * 0.025}s`
              }"
              :aria-pressed="isSelected(keyword.id)"
              :ref="(el) => setWordRef(keyword.id, el as HTMLElement | null)"
              @click="handleToggle(career, keyword.id, $event)"
            >
              {{ keyword.word }}
            </button>
          </div>
        </section>
      </div>

      <!-- 光点飞入能量池的飞行轨迹层 -->
      <div ref="flyLayerRef" class="fly-layer" aria-hidden="true">
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

      <!-- 实时能量池 -->
      <section class="energy-bar panel-in">
        <div class="energy-label">
          <span class="label-dot" />
          实时职业能量池
        </div>
        <div class="energy-tracks">
          <div
            v-for="career in store.careers"
            :key="career.id"
            class="energy-track"
          >
            <div
              class="energy-fill-wrap"
              :ref="(el) => setEnergyRef(career.id, el as HTMLElement | null)"
            >
              <div
                class="energy-fill"
                :class="{ pulse: liveScores[career.id] > 0 }"
                :style="{
                  height: pct(liveScores[career.id]),
                  background: `linear-gradient(180deg, ${career.colorCode}, ${career.colorCode}55)`,
                  boxShadow: `0 0 14px ${career.colorCode}88`
                }"
              />
            </div>
            <div class="energy-info">
              <div class="energy-name">{{ career.name }}</div>
              <div class="energy-score">{{ liveScores[career.id] || 0 }} 分</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 提示与操作 -->
      <footer class="select-actions">
        <a-alert
          v-if="store.selectedCount < 3"
          type="warning"
          show-icon
          class="select-hint"
          message="再多选几个词，结果会更准确"
        />
        <a-alert
          v-else
          type="success"
          show-icon
          class="select-hint"
          message="已满足测试条件，可以开始匹配"
        />
        <a-space :size="16" wrap>
          <a-button size="large" @click="router.push('/')">
            <template #icon><arrow-left-outlined /></template>
            返回首页
          </a-button>
          <a-button
            type="primary"
            size="large"
            class="btn-primary-glow"
            :disabled="store.selectedCount < 3"
            :loading="matching"
            @click="goMatching"
          >
            开始匹配
            <template #icon><arrow-right-outlined /></template>
          </a-button>
        </a-space>
      </footer>
    </div>
  </ScreenFrame>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons-vue'
import ScreenFrame from '@/components/ScreenFrame.vue'
import { postMatching } from '@/api'
import { useTestStore } from '@/stores/test'
import type { Career } from '@/types'

const store = useTestStore()
const router = useRouter()
const liveScores = reactive<Record<string, number>>({})
const matching = ref(false)
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

const progressPercent = computed(() => (store.selectedCount / 10) * 100)
const progressColor = computed(() => {
  if (store.selectedCount < 3) return '#faad14'
  if (store.selectedCount >= 8) return '#52c41a'
  return '#1677ff'
})

function isSelected(id: number) {
  return store.selectedIds.includes(id)
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
    message.warning('最多只能选择 10 个特质词')
    return
  }
  if (!wasSelected) {
    flyDot(career, id)
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
.select-page {
  padding: clamp(20px, 3.6vh, 48px) clamp(20px, 4.6vw, 80px);
  gap: clamp(10px, 1.4vh, 20px);
}

/* 顶部 */
.select-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-6);
  flex-shrink: 0;
}

.select-progress {
  width: clamp(300px, 30vw, 460px);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex-shrink: 0;
}

.progress-bar {
  margin: 0;
  width: 100%;
}

.progress-label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2);
  width: 100%;
}

.progress-suffix {
  font-size: 14px;
  color: var(--text-tertiary);
  font-weight: 400;
  margin-left: 4px;
}

.progress-hint {
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

/* 词卡分组 */
.select-groups {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(10px, 1.3vw, 20px);
  overflow: hidden;
  min-height: 0;
}

.select-empty {
  grid-column: 1 / -1;
  margin: auto;
}

.word-group {
  border-left: 2px solid var(--career-color);
  padding-left: clamp(8px, 0.9vw, 14px);
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.group-head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: clamp(13px, 1.15vw, 18px);
  font-weight: var(--fw-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
  flex-shrink: 0;
}

.group-dot {
  width: clamp(8px, 0.6vw, 12px);
  height: clamp(8px, 0.6vw, 12px);
  border-radius: 50%;
  background: var(--career-color);
  box-shadow: 0 0 8px var(--career-color);
}

.group-name {
  flex: 1;
  letter-spacing: 1px;
}

.group-color {
  margin: 0;
  font-size: 11px;
  font-weight: 400;
}

.group-words {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(6px, 0.7vw, 10px);
  overflow-y: auto;
  padding: 2px clamp(2px, 0.3vw, 6px) clamp(4px, 0.6vh, 10px) 0;
}

.group-words .word-card {
  animation: cardFloatIn 0.45s var(--ease-out) both;
}

.card-light {
  animation: cardLight 0.45s var(--ease-in-out) !important;
}

/* 能量池 */
.energy-bar {
  padding: clamp(10px, 1.4vh, 18px) clamp(14px, 1.8vw, 26px);
  border-radius: var(--radius-lg);
  background: var(--bg-panel);
  border: 1px solid var(--border-default);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.energy-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 12px;
  color: var(--text-tertiary);
  margin-bottom: var(--space-3);
  letter-spacing: 2px;
}

.label-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-primary);
  box-shadow: 0 0 8px rgba(22, 119, 255, 0.4);
}

.energy-tracks {
  display: flex;
  gap: clamp(10px, 1.6vw, 24px);
}

.energy-track {
  flex: 1;
  display: flex;
  align-items: center;
  gap: clamp(8px, 0.8vw, 12px);
}

.energy-fill-wrap {
  width: clamp(10px, 0.8vw, 14px);
  height: clamp(32px, 4.6vh, 56px);
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.energy-fill {
  width: 100%;
  border-radius: var(--radius-sm);
  transition: height 0.5s var(--ease-out);
}

.energy-fill.pulse {
  animation: energyPulse 1.4s ease-in-out infinite;
}

.energy-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.energy-name {
  font-size: clamp(11px, 0.95vw, 14px);
  color: var(--text-secondary);
  letter-spacing: 1px;
}

.energy-score {
  font-size: clamp(12px, 1.05vw, 15px);
  font-weight: var(--fw-bold);
  color: var(--text-primary);
  font-feature-settings: 'tnum';
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
  box-shadow: 0 0 12px 2px rgba(255, 255, 255, 0.6);
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

/* 提示与操作 */
.select-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-shrink: 0;
  padding-top: var(--space-2);
}

.select-hint {
  flex: 1;
  max-width: 380px;
  margin: 0;
}

.select-hint :deep(.ant-alert-message) {
  font-size: 13px;
  letter-spacing: 0.5px;
}

.select-actions :deep(.ant-btn-lg) {
  height: clamp(38px, 4vh, 54px);
  padding: 0 clamp(20px, 2.4vw, 36px);
  font-size: clamp(14px, 1.25vw, 18px);
  border-radius: var(--radius-pill);
  letter-spacing: 1px;
}
</style>
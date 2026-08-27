<template>
  <ScreenFrame>
    <a-config-provider :theme="careerTheme">
      <div class="screen-page profile-page">
        <header class="profile-head">
          <div>
            <h1 class="screen-title" :style="{ color: careerColor }">我的职业画像</h1>
            <p class="screen-subtitle">
              生成于 {{ formattedCreatedAt }} · 报告编号 {{ report?.code }}
            </p>
          </div>
          <a-space :size="8" wrap>
            <a-button size="large" @click="restart">
              <template #icon><reload-outlined /></template>
              重新测试
            </a-button>
          </a-space>
        </header>

        <a-spin
          v-if="loading"
          class="profile-loading"
          size="large"
          tip="正在生成你的专属画像…"
        />

        <template v-else-if="report">
          <section class="profile-body">
            <aside class="profile-left">
              <article
                class="hero-card"
                :style="{
                  '--career-color': careerColor,
                  background: `linear-gradient(150deg, ${careerColor}1f 0%, rgba(255,255,255,0.03) 70%)`,
                  borderColor: careerColor
                }"
              >
                <div v-if="careerIllustration(report.career.id)" class="hero-illust">
                  <img :src="careerIllustration(report.career.id)" :alt="report.career.name" />
                  <div class="hero-illust-mask" />
                </div>

                <header class="hero-header">
                  <CareerAvatar
                    :id="report.career.id"
                    :name="report.career.name"
                    :color="careerColor"
                    size="lg"
                    class="hero-avatar"
                  />
                  <div class="hero-titles">
                    <h2 class="hero-name" :style="{ color: careerColor }">{{ report.career.name }}</h2>
                    <a-tag
                      :color="careerColor"
                      bordered
                      class="hero-color"
                      :style="{ color: textOnColor(careerColor) }"
                    >
                      {{ report.career.colorName }} · {{ report.career.colorCode }}
                    </a-tag>
                  </div>
                </header>

                <a-statistic
                  class="hero-stat"
                  title="匹配度"
                  :value="firstSafe.matchRate"
                  :value-style="{ color: '#fff', fontSize: 'clamp(54px, 5vw, 84px)', fontWeight: 800 }"
                  :suffix="`%`"
                  :title-style="{ color: 'rgba(0, 0, 0, 0.55)', fontSize: '13px', letterSpacing: '3px' }"
                />

                <blockquote class="hero-slogan">“{{ report.profile.slogan }}”</blockquote>

                <div class="hero-second">
                  <span class="second-label">第二适配</span>
                  <a-tag
                    :color="secondSafe.colorCode"
                    bordered
                    :style="{ color: textOnColor(secondSafe.colorCode) }"
                  >
                    {{ secondSafe.name }}
                  </a-tag>
                  <span class="second-rate">{{ secondSafe.matchRate }}%</span>
                </div>
              </article>

              <div class="profile-actions">
                <a-button size="large" type="primary" class="btn-primary-glow" @click="router.push('/fitness')">
                  <template #icon><heart-outlined /></template>
                  查看体能方案
                </a-button>
                <a-button size="large" @click="qrOpen = true">
                  <template #icon><qrcode-outlined /></template>
                  生成二维码
                </a-button>
                <a-button size="large" @click="mentorOpen = true">
                  <template #icon><team-outlined /></template>
                  导师对接
                </a-button>
              </div>
            </aside>

            <div class="profile-right">
              <article class="panel glass-panel panel-in">
                <header class="panel-header">
                  <radar-chart-outlined class="panel-icon" :style="{ color: careerColor }" />
                  <h3 class="panel-title">能力雷达图</h3>
                  <a-tag
                    :color="careerColor"
                    bordered
                    class="panel-tag"
                    :style="{ color: textOnColor(careerColor) }"
                  >六维画像</a-tag>
                </header>
                <RadarChart
                  :axes="RADAR_AXES"
                  :values="radar"
                  :color="careerColor"
                  :height="320"
                />
              </article>

              <article class="panel glass-panel panel-in">
                <header class="panel-header">
                  <check-circle-outlined class="panel-icon" :style="{ color: careerColor }" />
                  <h3 class="panel-title">你的能力优势</h3>
                  <a-tag
                    v-if="hasAi"
                    :color="careerColor"
                    bordered
                    class="panel-tag"
                    :style="{ color: textOnColor(careerColor) }"
                  >AI 生成</a-tag>
                  <a-tag v-else-if="aiLoading" color="processing" bordered>生成中</a-tag>
                </header>
                <div v-if="aiLoading" class="panel-loading">
                  <a-spin size="small" />
                  <span class="panel-loading-text">AI 正在分析你的优势…</span>
                </div>
                <a-list v-else :data-source="displayStrengths" :split="false">
                  <template #renderItem="{ item, index }">
                    <a-list-item class="strength-item">
                      <span class="bullet-num" :style="{ background: careerColor }">
                        {{ index + 1 }}
                      </span>
                      <span class="item-text">{{ item }}</span>
                    </a-list-item>
                  </template>
                </a-list>
              </article>

              <article class="panel glass-panel panel-in">
                <header class="panel-header">
                  <bulb-outlined class="panel-icon" :style="{ color: '#faad14' }" />
                  <h3 class="panel-title">短板与提升建议</h3>
                  <a-tag
                    v-if="hasAi"
                    color="warning"
                    bordered
                  >AI 生成</a-tag>
                  <a-tag v-else-if="aiLoading" color="processing" bordered>生成中</a-tag>
                </header>
                <div v-if="aiLoading" class="panel-loading">
                  <a-spin size="small" />
                  <span class="panel-loading-text">AI 正在分析你的短板…</span>
                </div>
                <a-list v-else :data-source="displayImprovements" :split="false">
                  <template #renderItem="{ item, index }">
                    <a-list-item class="improve-item">
                      <span class="bullet-num" :style="{ background: '#faad14' }">
                        {{ index + 1 }}
                      </span>
                      <span class="item-text">{{ item }}</span>
                    </a-list-item>
                  </template>
                </a-list>
              </article>

              <!-- AI 深度分析 -->
              <article class="panel glass-panel panel-in ai-panel">
                <header class="panel-header">
                  <robot-outlined class="panel-icon" :style="{ color: careerColor }" />
                  <h3 class="panel-title">AI 深度分析</h3>
                  <a-tag :color="careerColor" bordered class="panel-tag" :style="{ color: textOnColor(careerColor) }">
                    MiMo
                  </a-tag>
                </header>

                <div v-if="aiLoading" class="ai-loading">
                  <a-spin size="small" />
                  <span class="ai-loading-text">AI 正在解读你的特质组合…</span>
                </div>

                <a-alert
                  v-else-if="aiError"
                  type="warning"
                  show-icon
                  class="ai-error"
                  :message="aiError"
                />

                <template v-else-if="aiAnalysis">
                  <div class="ai-summary">
                    <robot-outlined :style="{ color: careerColor }" class="ai-summary-icon" />
                    <p class="ai-summary-text">{{ aiAnalysis.summary }}</p>
                  </div>

                  <blockquote v-if="aiAnalysis.motto" class="ai-motto" :style="{ borderColor: careerColor }">
                    {{ aiAnalysis.motto }}
                  </blockquote>

                  <div class="ai-disclaimer">
                    <info-circle-outlined />
                    {{ aiAnalysis.disclaimer }}
                  </div>
                </template>

                <a-button
                  v-if="aiError && !aiLoading && !aiAnalysis"
                  type="primary"
                  block
                  size="large"
                  class="ai-run-btn"
                  :style="{ background: careerColor, borderColor: careerColor }"
                  @click="runAiAnalyze"
                >
                  <template #icon><reload-outlined /></template>
                  重试 AI 分析
                </a-button>
              </article>
            </div>
          </section>

          <footer class="profile-disclaimer">
            {{ report.match.disclaimer }}
          </footer>
        </template>

        <a-modal v-model:open="qrOpen" :footer="null" width="480px" centered>
          <QrPanel :report="report!" />
        </a-modal>

        <MentorModal
          :open="mentorOpen"
          :mentors="report?.mentors || []"
          :career-color="careerColor"
          @update:open="(v) => (mentorOpen = v)"
        />
      </div>
    </a-config-provider>
  </ScreenFrame>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  BulbOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  InfoCircleOutlined,
  QrcodeOutlined,
  RadarChartOutlined,
  ReloadOutlined,
  RiseOutlined,
  RobotOutlined,
  TeamOutlined
} from '@ant-design/icons-vue'
import ScreenFrame from '@/components/ScreenFrame.vue'
import RadarChart from '@/components/RadarChart.vue'
import CareerAvatar from '@/components/CareerAvatar.vue'
import QrPanel from '@/components/QrPanel.vue'
import MentorModal from '@/components/MentorModal.vue'
import { aiAnalyze, createReport } from '@/api'
import { careerIllustration } from '@/utils/illustration'
import { textOnColor } from '@/utils/color'
import { useTestStore } from '@/stores/test'
import { RADAR_AXES, radarValues } from '@/utils/radar'
import type { AiAnalysisVO } from '@/types'

const store = useTestStore()
const router = useRouter()
const loading = ref(false)
const qrOpen = ref(false)
const mentorOpen = ref(false)
const aiLoading = ref(false)
const aiError = ref('')
const aiAnalysis = ref<AiAnalysisVO | null>(null)

const first = computed(() => store.matchResult?.first)
const second = computed(() => store.matchResult?.second)
const career = computed(() => store.report?.career || null)
const careerColor = computed(() => career.value?.colorCode || '#1677FF')
const report = computed(() => store.report)
const firstSafe = computed(() => first.value!)
const secondSafe = computed(() => second.value!)
const radar = computed(() =>
  career.value && first.value ? radarValues(career.value.id, first.value.matchRate) : []
)
const formattedCreatedAt = computed(() => {
  const t = report.value?.createdAt
  if (!t) return ''
  return t.replace('T', ' ').slice(0, 16)
})

const careerTheme = computed(() => ({
  token: {
    colorPrimary: careerColor.value,
    borderRadius: 8
  }
}))

/** 展示内容全部来自 AI 分析（不再使用预设模板） */
const displayStrengths = computed(() => aiAnalysis.value?.strengths || [])
const displayImprovements = computed(() => aiAnalysis.value?.improvements || [])
const hasAi = computed(() => !!aiAnalysis.value)

async function ensureReport() {
  if (!store.matchResult) {
    router.replace('/select')
    return
  }
  const target = store.matchResult.first.careerId
  if (store.report && store.report.career.id === target) {
    // 已有报告：若缓存了 AI 分析则直接展示，否则自动生成
    if (store.report.aiAnalysis) {
      aiAnalysis.value = store.report.aiAnalysis
    } else {
      runAiAnalyze()
    }
    return
  }
  loading.value = true
  try {
    const data = await createReport(store.selectedIds)
    store.setReport(data)
    if (data.aiAnalysis) {
      aiAnalysis.value = data.aiAnalysis
    } else {
      // 新报告无 AI 分析：自动生成
      runAiAnalyze()
    }
  } finally {
    loading.value = false
  }
}

function restart() {
  store.clearSelection()
  router.replace('/')
}

/** 调用 AI 大模型生成深度分析（按报告编号，已缓存直接返回） */
async function runAiAnalyze() {
  if (!report.value) return
  aiLoading.value = true
  aiError.value = ''
  try {
    const data = await aiAnalyze(report.value.code)
    aiAnalysis.value = data
    // 同步更新 store.report，让体能页/重新进入也可见
    if (store.report) {
      store.report.aiAnalysis = data
    }
  } catch (e) {
    aiError.value = e instanceof Error ? e.message : 'AI 分析失败，请稍后重试'
  } finally {
    aiLoading.value = false
  }
}

onMounted(() => {
  ensureReport()
})
</script>

<style scoped>
.profile-page {
  padding: clamp(14px, 3vh, 44px) clamp(20px, 4.6vw, 80px);
  gap: clamp(12px, 1.6vh, 22px);
}

.profile-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
  flex-shrink: 0;
}

.profile-head :deep(.ant-btn-lg) {
  height: clamp(38px, 4vh, 52px);
  padding: 0 clamp(16px, 1.8vw, 26px);
  font-size: clamp(13px, 1.2vw, 17px);
  border-radius: var(--radius-pill);
}

.profile-loading {
  margin: auto;
}

.profile-body {
  flex: 1;
  display: grid;
  grid-template-columns: minmax(320px, 30vw) 1fr;
  gap: clamp(14px, 1.8vw, 28px);
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.profile-left {
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 1.6vh, 20px);
  min-height: 0;
}

/* hero 卡片 */
.hero-card {
  flex: 1;
  position: relative;
  overflow: hidden;
  border: 1px solid;
  border-radius: var(--radius-lg);
  padding: clamp(20px, 2.4vw, 36px) clamp(16px, 2vw, 32px);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(10px, 1.4vh, 18px);
  animation: panelReveal 0.55s var(--ease-out) both;
  min-height: 0;
}

.hero-illust {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.hero-illust img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 28%;
  display: block;
  opacity: 0.42;
}

.hero-illust-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.55) 100%);
}

.hero-header {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(6px, 0.8vh, 10px);
  width: 100%;
}

.hero-avatar {
  margin-bottom: var(--space-1);
}

.hero-titles {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.hero-name {
  font-size: clamp(28px, 3vw, 44px);
  font-weight: var(--fw-heavy);
  letter-spacing: clamp(2px, 0.4vw, 8px);
  margin: 0;
  line-height: 1.1;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.45);
}

.hero-color {
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 12px;
}

.hero-stat {
  position: relative;
  z-index: 1;
}

.hero-stat :deep(.ant-statistic-content) {
  font-feature-settings: 'tnum';
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
}

.hero-slogan {
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: clamp(14px, 1.4vw, 20px);
  color: var(--text-primary);
  font-style: italic;
  letter-spacing: 1px;
  padding: 0 var(--space-3);
}

.hero-second {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: clamp(5px, 0.7vh, 8px) clamp(10px, 1.2vw, 18px);
  border-radius: var(--radius-pill);
  background: var(--bg-panel);
  border: 1px solid var(--border-subtle);
  font-size: 13px;
  color: var(--text-secondary);
}

.second-label {
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--text-tertiary);
}

.second-rate {
  font-weight: var(--fw-bold);
  font-feature-settings: 'tnum';
  color: var(--text-primary);
}

/* 操作栏 */
.profile-actions {
  display: flex;
  gap: clamp(8px, 0.9vw, 14px);
  flex-wrap: wrap;
  justify-content: center;
}

.profile-actions :deep(.ant-btn-lg) {
  height: clamp(40px, 4.2vh, 56px);
  padding: 0 clamp(16px, 1.8vw, 28px);
  font-size: clamp(13px, 1.2vw, 18px);
  border-radius: var(--radius-pill);
}

.profile-actions :deep(.ant-btn-primary) {
  color: var(--text-inverse);
  font-weight: var(--fw-bold);
}

/* 面板 */
.profile-right {
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 1.6vh, 20px);
  min-height: 0;
}

.panel {
  padding: clamp(14px, 1.9vh, 26px) clamp(14px, 1.8vw, 28px);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: clamp(8px, 1.2vh, 18px);
}

.panel-icon {
  font-size: 18px;
}

.panel-title {
  font-size: clamp(15px, 1.5vw, 20px);
  font-weight: var(--fw-semibold);
  margin: 0;
  color: var(--text-primary);
  flex: 1;
}

.panel-tag {
  margin: 0;
  font-weight: 400;
}

.strength-item,
.improve-item {
  padding: clamp(5px, 0.8vh, 12px) 0 !important;
  border-bottom: 1px dashed var(--border-subtle);
  display: flex !important;
  align-items: flex-start !important;
  gap: clamp(8px, 0.8vw, 12px);
}

.strength-item:last-child,
.improve-item:last-child {
  border-bottom: none;
}

.bullet-num {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: var(--fw-bold);
  margin-top: 2px;
}

.item-text {
  flex: 1;
  font-size: clamp(13px, 1.15vw, 17px);
  line-height: 1.7;
  color: var(--text-secondary);
}

/* AI 深度分析面板 */
.ai-panel {
  grid-column: 1 / -1;
  border: 1px dashed var(--border-strong);
}

.ai-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: clamp(24px, 4vh, 48px) 0;
  color: var(--text-tertiary);
}

.ai-loading-text {
  font-size: 14px;
  letter-spacing: 1px;
}

/* 面板内加载态（优势/短板面板） */
.panel-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: clamp(20px, 3.4vh, 40px) 0;
  color: var(--text-tertiary);
}

.panel-loading-text {
  font-size: 13px;
  letter-spacing: 1px;
}

.ai-error {
  margin: 0;
}

.ai-summary {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: clamp(12px, 1.6vh, 20px);
  background: var(--bg-panel-strong);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
}

.ai-summary-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.ai-summary-text {
  margin: 0;
  font-size: clamp(14px, 1.3vw, 17px);
  line-height: 1.8;
  color: var(--text-primary);
}

.ai-section {
  margin-bottom: var(--space-4);
}

.ai-section-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 14px;
  font-weight: var(--fw-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  letter-spacing: 1px;
}

.ai-item {
  padding: clamp(5px, 0.8vh, 12px) 0 !important;
  border-bottom: 1px dashed var(--border-subtle);
  display: flex !important;
  align-items: flex-start !important;
  gap: clamp(8px, 0.8vw, 12px);
}

.ai-item:last-child {
  border-bottom: none;
}

.ai-badge {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: var(--fw-bold);
  margin-top: 2px;
}

.ai-motto {
  margin: var(--space-4) 0 0;
  padding: clamp(10px, 1.4vh, 16px) clamp(14px, 1.6vw, 20px);
  border-left: 3px solid;
  border-radius: var(--radius-sm);
  background: var(--bg-panel-strong);
  font-size: clamp(14px, 1.3vw, 17px);
  font-style: italic;
  color: var(--text-primary);
  line-height: 1.7;
}

.ai-disclaimer {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
  font-size: 12px;
  color: var(--text-tertiary);
  letter-spacing: 0.5px;
  line-height: 1.6;
}

.ai-run-btn {
  margin-top: var(--space-2);
}

.profile-disclaimer {
  text-align: center;
  font-size: 12px;
  color: var(--text-tertiary);
  letter-spacing: 1px;
  margin-top: clamp(4px, 0.6vh, 10px);
  flex-shrink: 0;
}
</style>
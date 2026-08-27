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

                <div class="hero-body">
                  <CareerAvatar
                    :id="report.career.id"
                    :name="report.career.name"
                    :color="careerColor"
                    size="lg"
                    class="hero-avatar"
                  />
                  <h2 class="hero-name" :style="{ color: careerColor }">{{ report.career.name }}</h2>
                  <a-tag :color="careerColor" bordered class="hero-color">
                    {{ report.career.colorName }} · 专属色 {{ report.career.colorCode }}
                  </a-tag>
                  <a-statistic
                    class="hero-stat"
                    title="匹配度"
                    :value="firstSafe.matchRate"
                    :value-style="{ color: '#fff', fontSize: 'clamp(54px, 5vw, 84px)', fontWeight: 800 }"
                    :suffix="`%`"
                    :title-style="{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '13px', letterSpacing: '3px' }"
                  />
                  <blockquote class="hero-slogan">“{{ report.profile.slogan }}”</blockquote>
                  <div class="hero-second">
                    <span class="second-label">第二适配</span>
                    <a-tag :color="secondSafe.colorCode" bordered>{{ secondSafe.name }}</a-tag>
                    <span class="second-rate">{{ secondSafe.matchRate }}%</span>
                  </div>
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
                  <a-tag :color="careerColor" bordered class="panel-tag">六维画像</a-tag>
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
                  <a-tag color="success" bordered>{{ report.profile.strengths.length }} 项</a-tag>
                </header>
                <a-list :data-source="report.profile.strengths" :split="false">
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
                  <a-tag color="warning" bordered>{{ report.profile.improvements.length }} 项</a-tag>
                </header>
                <a-list :data-source="report.profile.improvements" :split="false">
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
  QrcodeOutlined,
  RadarChartOutlined,
  ReloadOutlined,
  TeamOutlined
} from '@ant-design/icons-vue'
import ScreenFrame from '@/components/ScreenFrame.vue'
import RadarChart from '@/components/RadarChart.vue'
import CareerAvatar from '@/components/CareerAvatar.vue'
import QrPanel from '@/components/QrPanel.vue'
import MentorModal from '@/components/MentorModal.vue'
import { createReport } from '@/api'
import { careerIllustration } from '@/utils/illustration'
import { useTestStore } from '@/stores/test'
import { RADAR_AXES, radarValues } from '@/utils/radar'

const store = useTestStore()
const router = useRouter()
const loading = ref(false)
const qrOpen = ref(false)
const mentorOpen = ref(false)

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

async function ensureReport() {
  if (!store.matchResult) {
    router.replace('/select')
    return
  }
  const target = store.matchResult.first.careerId
  if (store.report && store.report.career.id === target) return
  loading.value = true
  try {
    const data = await createReport(store.selectedIds)
    store.setReport(data)
  } finally {
    loading.value = false
  }
}

function restart() {
  store.clearSelection()
  router.replace('/')
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
  padding: clamp(16px, 2.4vw, 32px) clamp(14px, 2vw, 28px);
  text-align: center;
  display: flex;
  flex-direction: column;
  animation: panelReveal 0.55s var(--ease-out) both;
  min-height: 0;
}

.hero-illust {
  position: absolute;
  inset: 0 0 auto 0;
  height: clamp(80px, 12vh, 180px);
  overflow: hidden;
  pointer-events: none;
}

.hero-illust img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 22%;
  display: block;
}

.hero-illust-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 60%, rgba(6, 13, 26, 0.4));
}

.hero-body {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(8px, 1vh, 14px);
  padding-top: clamp(70px, 10vh, 160px);
  flex: 1;
}

.hero-avatar {
  margin-bottom: var(--space-2);
}

.hero-name {
  font-size: clamp(28px, 3vw, 48px);
  font-weight: var(--fw-heavy);
  letter-spacing: clamp(2px, 0.4vw, 8px);
  margin: 0;
  line-height: 1.1;
}

.hero-color {
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 12px;
}

.hero-stat {
  margin-top: var(--space-2);
}

.hero-stat :deep(.ant-statistic-content) {
  font-feature-settings: 'tnum';
}

.hero-slogan {
  margin: 0;
  font-size: clamp(14px, 1.4vw, 20px);
  color: rgba(255, 255, 255, 0.85);
  font-style: italic;
  letter-spacing: 1px;
  padding: 0 var(--space-3);
}

.hero-second {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: clamp(4px, 0.6vh, 8px);
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
  color: rgba(255, 255, 255, 0.5);
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

.profile-disclaimer {
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
  margin-top: clamp(4px, 0.6vh, 10px);
  flex-shrink: 0;
}
</style>
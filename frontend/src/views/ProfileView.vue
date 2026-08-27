<template>
  <ScreenFrame>
    <a-config-provider :theme="careerTheme">
      <div class="screen-page profile-page">
        <div class="profile-head">
          <h1 class="screen-title" :style="{ color: careerColor }">我的职业画像</h1>
          <a-button size="large" @click="restart">重新测试</a-button>
        </div>

        <a-spin v-if="loading" class="profile-loading" size="large" tip="正在生成你的专属画像…" />

        <template v-else-if="report">
          <div class="profile-body">
            <div class="profile-left">
              <div
                class="hero-card"
                :style="{
                  background: `linear-gradient(150deg, ${careerColor}33 0%, rgba(255,255,255,0.05) 60%)`,
                  borderColor: careerColor
                }"
              >
                <div v-if="careerIllustration(report.career.id)" class="hero-illust">
                  <img :src="careerIllustration(report.career.id)" :alt="report.career.name" />
                </div>
                <div class="hero-icon" :style="{ background: careerColor }">
                  {{ report.career.name.charAt(0) }}
                </div>
                <div class="hero-name" :style="{ color: careerColor }">{{ report.career.name }}</div>
                <div class="hero-color">
                  {{ report.career.colorName }} · 专属色 {{ report.career.colorCode }}
                </div>
                <div class="hero-rate">
                  <span class="hero-rate-num">{{ report.match.first.matchRate }}%</span>
                  <span class="hero-rate-label">匹配度</span>
                </div>
                <div class="hero-slogan">“{{ report.profile.slogan }}”</div>
                <div class="hero-second">
                  第二适配：<b :style="{ color: report.match.second.colorCode }">
                    {{ report.match.second.name }}
                  </b>
                  （{{ report.match.second.matchRate }}%）
                </div>
              </div>

              <div class="profile-actions">
                <a-button size="large" type="primary" class="btn-primary-glow" @click="router.push('/fitness')">
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
            </div>

            <div class="profile-right">
              <div class="panel glass-panel panel-in">
                <div class="panel-title">能力雷达图</div>
                <RadarChart
                  :axes="RADAR_AXES"
                  :values="radar"
                  :color="careerColor"
                  :height="300"
                />
              </div>

              <div class="panel glass-panel panel-in">
                <div class="panel-title">你的能力优势</div>
                <a-list :data-source="report.profile.strengths" :split="false">
                  <template #renderItem="{ item }">
                    <a-list-item class="strength-item">
                      <check-circle-outlined :style="{ color: careerColor }" class="item-icon" />
                      {{ item }}
                    </a-list-item>
                  </template>
                </a-list>
              </div>

              <div class="panel glass-panel panel-in">
                <div class="panel-title">短板与提升建议</div>
                <a-list :data-source="report.profile.improvements" :split="false">
                  <template #renderItem="{ item }">
                    <a-list-item class="improve-item">
                      <bulb-outlined :style="{ color: '#FAAD14' }" class="item-icon" />
                      {{ item }}
                    </a-list-item>
                  </template>
                </a-list>
              </div>
            </div>
          </div>

          <div class="profile-disclaimer">{{ report.match.disclaimer }}</div>
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
  QrcodeOutlined,
  TeamOutlined
} from '@ant-design/icons-vue'
import ScreenFrame from '@/components/ScreenFrame.vue'
import RadarChart from '@/components/RadarChart.vue'
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
const radar = computed(() =>
  career.value && first.value ? radarValues(career.value.id, first.value.matchRate) : []
)

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
  // 已有报告但职业与当前匹配结果不一致（例如 sessionStorage 残留旧报告）时强制重建
  const current = store.matchResult.first.careerId
  if (store.report && store.report.career.id === current) return
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
  padding-top: clamp(14px, 3vh, 44px);
}

.profile-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.profile-loading {
  margin: auto;
}

.profile-body {
  flex: 1;
  display: grid;
  grid-template-columns: minmax(280px, 32vw) 1fr;
  gap: clamp(16px, 2vw, 36px);
  margin-top: clamp(10px, 2vh, 26px);
  min-height: 0;
}

.profile-left {
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 1.8vh, 24px);
}

.hero-card {
  flex: 1;
  position: relative;
  overflow: hidden;
  border: 1px solid;
  border-radius: 12px;
  padding: clamp(16px, 2.4vw, 40px) clamp(14px, 2vw, 34px);
  text-align: center;
  animation: panelReveal 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.hero-illust {
  position: absolute;
  inset: 0 0 auto 0;
  height: clamp(70px, 11vh, 180px);
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

.hero-illust::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 65%, rgba(11, 18, 32, 0.55));
}

.hero-icon {
  position: relative;
  width: clamp(56px, 5.6vw, 110px);
  height: clamp(56px, 5.6vw, 110px);
  border-radius: 50%;
  margin: clamp(60px, 8.5vh, 130px) auto clamp(8px, 1.4vh, 20px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(24px, 2.6vw, 48px);
  font-weight: 700;
  color: #fff;
  box-shadow: 0 0 36px currentColor;
}

.hero-name {
  position: relative;
  font-size: clamp(26px, 2.8vw, 48px);
  font-weight: 800;
  letter-spacing: clamp(2px, 0.4vw, 8px);
}

.hero-color {
  position: relative;
  margin-top: clamp(2px, 0.5vh, 8px);
  font-size: clamp(11px, 0.95vw, 16px);
  color: rgba(255, 255, 255, 0.55);
}

.hero-rate {
  position: relative;
  margin-top: clamp(10px, 1.8vh, 26px);
  display: flex;
  flex-direction: column;
}

.hero-rate-num {
  font-size: clamp(42px, 4.6vw, 76px);
  font-weight: 800;
  color: rgba(255, 255, 255, 0.95);
}

.hero-rate-label {
  font-size: clamp(12px, 1.05vw, 17px);
  color: rgba(255, 255, 255, 0.55);
}

.hero-slogan {
  position: relative;
  margin-top: clamp(8px, 1.3vh, 18px);
  font-size: clamp(14px, 1.35vw, 21px);
  color: rgba(255, 255, 255, 0.78);
}

.hero-second {
  position: relative;
  margin-top: clamp(8px, 1.2vh, 16px);
  font-size: clamp(12px, 1.15vw, 17px);
  color: rgba(255, 255, 255, 0.62);
}

.profile-actions {
  display: flex;
  gap: clamp(8px, 0.9vw, 16px);
  justify-content: center;
}

.profile-actions :deep(.ant-btn-lg) {
  height: clamp(38px, 4vh, 56px);
  padding: 0 clamp(14px, 1.8vw, 32px);
  font-size: clamp(14px, 1.25vw, 19px);
  border-radius: 26px;
}

.profile-actions :deep(.ant-btn-primary) {
  color: #000;
}

.profile-right {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: clamp(10px, 1.6vh, 24px);
  min-height: 0;
  overflow-y: auto;
}

.panel {
  padding: clamp(12px, 1.6vh, 26px) clamp(14px, 1.8vw, 28px);
  min-width: 0;
}

.panel-title {
  font-size: clamp(15px, 1.5vw, 22px);
  font-weight: 600;
  margin-bottom: clamp(6px, 1vh, 16px);
  color: rgba(255, 255, 255, 0.92);
}

.strength-item,
.improve-item {
  padding: clamp(4px, 0.6vh, 10px) 0 !important;
  color: rgba(255, 255, 255, 0.82);
  font-size: clamp(13px, 1.15vw, 17px);
  line-height: 1.6;
}

.item-icon {
  margin-right: clamp(6px, 0.7vw, 12px);
  font-size: clamp(14px, 1.2vw, 19px);
}

.profile-disclaimer {
  text-align: center;
  font-size: clamp(12px, 0.9vw, 15px);
  color: rgba(255, 255, 255, 0.4);
  margin-top: clamp(6px, 1.2vh, 16px);
  flex-shrink: 0;
}
</style>

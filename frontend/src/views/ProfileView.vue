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
              <div class="panel glass-panel">
                <div class="panel-title">能力雷达图</div>
                <RadarChart
                  :axes="RADAR_AXES"
                  :values="radar"
                  :color="careerColor"
                  :height="300"
                />
              </div>

              <div class="panel glass-panel">
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

              <div class="panel glass-panel">
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
  if (store.report) return
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
  padding-top: 36px;
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
  grid-template-columns: 480px 1fr;
  gap: 32px;
  margin-top: 20px;
  min-height: 0;
}

.profile-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-card {
  flex: 1;
  border: 1px solid;
  border-radius: 12px;
  padding: 34px 30px;
  text-align: center;
}

.hero-icon {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 0 36px currentColor;
}

.hero-name {
  font-size: 40px;
  font-weight: 800;
  letter-spacing: 6px;
}

.hero-color {
  margin-top: 6px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.55);
}

.hero-rate {
  margin-top: 22px;
  display: flex;
  flex-direction: column;
}

.hero-rate-num {
  font-size: 64px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.95);
}

.hero-rate-label {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.55);
}

.hero-slogan {
  margin-top: 16px;
  font-size: 19px;
  color: rgba(255, 255, 255, 0.78);
}

.hero-second {
  margin-top: 14px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.62);
}

.profile-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.profile-actions :deep(.ant-btn-lg) {
  height: 52px;
  padding: 0 28px;
  font-size: 17px;
  border-radius: 26px;
}

.profile-right {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 20px;
  min-height: 0;
  overflow-y: auto;
}

.panel {
  padding: 22px 24px;
  min-width: 0;
}

.panel-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 14px;
  color: rgba(255, 255, 255, 0.92);
}

.strength-item,
.improve-item {
  padding: 8px 0 !important;
  color: rgba(255, 255, 255, 0.82);
  font-size: 16px;
  line-height: 1.6;
}

.item-icon {
  margin-right: 10px;
  font-size: 18px;
}

.profile-disclaimer {
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 14px;
  flex-shrink: 0;
}
</style>

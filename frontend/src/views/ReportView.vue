<template>
  <div class="mobile-page" ref="pageRef">
    <a-spin v-if="loading" class="report-loading" size="large" tip="报告加载中…" />

    <a-result
      v-else-if="error"
      status="warning"
      title="报告不存在或已过期"
      sub-title="请回到活动现场重新生成专属报告"
    >
      <template #extra>
        <a-button type="primary" href="#/">返回首页</a-button>
      </template>
    </a-result>

    <div v-else-if="report" id="report-capture" ref="captureRef">
      <!-- 职业主视觉 -->
      <div
        class="report-hero"
        :style="{
          background: `linear-gradient(160deg, ${careerColor} 0%, ${careerColor}cc 45%, ${careerColor}88 100%)`
        }"
      >
        <div v-if="careerIllustration(career.id)" class="hero-illust">
          <img :src="careerIllustration(career.id)" :alt="career.name" />
          <div class="hero-illust-mask" />
        </div>
        <div class="hero-badge">五彩法途 · 职业画像</div>
        <div class="hero-name">{{ career.name }}</div>
        <div class="hero-slogan">“{{ report.profile.slogan }}”</div>
        <div class="hero-rate">
          <span class="rate-num">{{ first.matchRate }}%</span>
          <span class="rate-label">匹配度</span>
        </div>
        <div class="hero-second">
          第二适配：{{ second.name }}（{{ second.matchRate }}%）
        </div>
        <div class="hero-code">报告编号 {{ report.code }}</div>
      </div>

      <!-- 匹配词 -->
      <div class="report-section">
        <div class="section-title">你选择的特质词</div>
        <div class="word-chips">
          <span v-for="id in report.match.keywordIds" :key="id" class="word-chip" :style="{ background: careerColor + '1a', color: careerColor, borderColor: careerColor + '55' }">
            {{ wordOf(id) }}
          </span>
        </div>
        <div v-if="report.match.tie" class="tie-tip">并列双适配：{{ tieNames }}</div>
        <div v-if="report.match.tip" class="soft-tip">{{ report.match.tip }}</div>
      </div>

      <!-- 能力优势 -->
      <div class="report-section">
        <div class="section-title">你的能力优势</div>
        <div v-for="(item, index) in report.profile.strengths" :key="index" class="check-line">
          <check-circle-filled :style="{ color: careerColor }" class="line-icon" />
          {{ item }}
        </div>
      </div>

      <!-- 短板建议 -->
      <div class="report-section">
        <div class="section-title">短板与提升建议</div>
        <div v-for="(item, index) in report.profile.improvements" :key="index" class="check-line">
          <bulb-filled style="color: #faad14" class="line-icon" />
          {{ item }}
        </div>
      </div>

      <!-- 能力雷达图 -->
      <div class="report-section">
        <div class="section-title">能力雷达图</div>
        <RadarChart :axes="RADAR_AXES" :values="radar" :color="careerColor" :height="280" />
      </div>

      <!-- 体能 -->
      <div class="report-section">
        <div class="section-title">身体素质达标要求</div>
        <div v-for="(item, index) in report.fitnessRequirements" :key="item.id" class="req-line">
          <span class="req-no" :style="{ background: careerColor }">{{ index + 1 }}</span>
          <span class="req-text">{{ item.content }}</span>
        </div>
      </div>

      <div class="report-section">
        <div class="section-title">大学四年锻炼计划</div>
        <a-timeline>
          <a-timeline-item v-for="plan in report.fitnessPlans" :key="plan.id" :color="careerColor">
            <div class="plan-stage">{{ plan.yearStage }}</div>
            <div class="plan-content">{{ plan.content }}</div>
          </a-timeline-item>
        </a-timeline>
        <div class="medical-tip">{{ disclaimer }}</div>
      </div>

      <!-- 导师 -->
      <div class="report-section">
        <div class="section-title">实务导师对接</div>
        <a-empty v-if="!report.mentors.length" description="导师名单待学院确认，敬请期待" />
        <div v-for="mentor in report.mentors" :key="mentor.id" class="mentor-card">
          <div class="mentor-head">
            <a-avatar :size="44" :style="{ background: careerColor }">
              {{ mentor.name.charAt(0) }}
            </a-avatar>
            <div>
              <div class="mentor-name">{{ mentor.name }}</div>
              <div class="mentor-title">{{ mentor.title }}</div>
            </div>
          </div>
          <div v-if="mentor.contact" class="mentor-contact">
            <phone-outlined /> {{ mentor.contact }}
          </div>
          <a-button
            v-if="mentor.bookingUrl"
            type="primary"
            block
            :href="mentor.bookingUrl"
            target="_blank"
            class="mentor-btn"
            :style="{ background: careerColor, borderColor: careerColor }"
          >
            预约交流
          </a-button>
        </div>
      </div>

      <div class="report-disclaimer">{{ report.match.disclaimer }}</div>
    </div>

    <div v-if="report && !error" class="fav-entry" @click="router.push('/favorites')">
      <star-outlined />
      我的收藏
      <right-outlined class="fav-entry-arrow" />
    </div>

    <!-- 底部操作栏 -->
    <div v-if="report && !error" class="action-bar">
      <a-button size="large" class="action-btn" :loading="saving" @click="saveImage">
        <template #icon><picture-outlined /></template>
        保存长图
      </a-button>
      <a-button size="large" class="action-btn" :class="{ favorited: isFavorite }" @click="toggleFavorite">
        <template #icon><star-filled v-if="isFavorite" /><star-outlined v-else /></template>
        {{ isFavorite ? '已收藏' : '收藏' }}
      </a-button>
      <a-button size="large" class="action-btn" @click="copyLink">
        <template #icon><link-outlined /></template>
        复制链接
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  BulbFilled,
  CheckCircleFilled,
  LinkOutlined,
  PhoneOutlined,
  PictureOutlined,
  RightOutlined,
  StarFilled,
  StarOutlined
} from '@ant-design/icons-vue'
import RadarChart from '@/components/RadarChart.vue'
import { getReport } from '@/api'
import { careerIllustration } from '@/utils/illustration'
import { useTestStore } from '@/stores/test'
import { RADAR_AXES, radarValues } from '@/utils/radar'
import type { Report } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useTestStore()
const loading = ref(true)
const error = ref(false)
const saving = ref(false)
const report = ref<Report | null>(null)
const captureRef = ref<HTMLElement | null>(null)
const pageRef = ref<HTMLElement | null>(null)

const FAV_KEY = 'lawtest_favorites'

const first = computed(() => report.value!.match.first)
const second = computed(() => report.value!.match.second)
const career = computed(() => report.value!.career)
const careerColor = computed(() => career.value.colorCode)
const radar = computed(() => radarValues(career.value.id, first.value.matchRate))
const disclaimer = '本内容为通识性建议，非医疗意见；如有健康问题请遵医嘱。'

const favorites = ref<string[]>(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'))
const isFavorite = computed(() => favorites.value.includes(report.value?.code || ''))
const tieNames = computed(() =>
  report.value
    ? report.value.match.tieCareerIds
        .map((id) => store.careerById(id)?.name || '')
        .filter(Boolean)
        .join('、')
    : ''
)

function wordOf(id: number): string {
  for (const c of store.careers) {
    const k = c.keywords?.find((kw) => kw.id === id)
    if (k) return k.word
  }
  return `#${id}`
}

async function load() {
  loading.value = true
  error.value = false
  const code = String(route.params.code || '')
  try {
    const data = await getReport(code)
    report.value = data
    store.careers.length || (await store.loadCareers())
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

async function saveImage() {
  saving.value = true
  try {
    const html2canvas = (await import('html2canvas')).default
    const node = captureRef.value
    if (!node) return
    const canvas = await html2canvas(node, {
      backgroundColor: '#f5f7fa',
      scale: 2,
      useCORS: true
    })
    const link = document.createElement('a')
    link.download = `五彩法途-${career.value.name}-${report.value!.code}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    message.success('长图已保存，请在相册/下载中查看')
  } catch {
    message.error('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

function toggleFavorite() {
  const code = report.value?.code || ''
  const idx = favorites.value.indexOf(code)
  if (idx >= 0) {
    favorites.value.splice(idx, 1)
    message.success('已取消收藏')
  } else {
    favorites.value.push(code)
    message.success('已收藏，可在「我的收藏」中随时查看')
  }
  localStorage.setItem(FAV_KEY, JSON.stringify(favorites.value))
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(report.value!.qrUrl)
    message.success('报告链接已复制')
  } catch {
    message.warning('复制失败，请长按链接手动复制')
  }
}

onMounted(() => {
  load()
})
</script>

<style scoped>
.report-loading {
  display: block;
  margin: 120px auto;
}

.report-hero {
  position: relative;
  color: #fff;
  text-align: center;
  padding: 40px 20px 36px;
  overflow: hidden;
}

.hero-illust {
  position: absolute;
  inset: 0;
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
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.45));
}

.hero-badge {
  position: relative;
  display: inline-block;
  padding: 4px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  font-size: 12px;
  letter-spacing: 2px;
  margin-bottom: 14px;
}

.hero-name {
  position: relative;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 6px;
}

.hero-slogan {
  position: relative;
  margin-top: 10px;
  font-size: 15px;
  opacity: 0.92;
}

.hero-rate {
  position: relative;
  margin-top: 20px;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.rate-num {
  font-size: 52px;
  font-weight: 800;
}

.rate-label {
  font-size: 15px;
  opacity: 0.85;
}

.hero-second {
  position: relative;
  margin-top: 10px;
  font-size: 14px;
  opacity: 0.9;
}

.hero-code {
  position: relative;
  margin-top: 18px;
  font-size: 12px;
  opacity: 0.75;
  letter-spacing: 1px;
}

.section-title {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.word-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.word-chip {
  border: 1px solid;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 13px;
}

.tie-tip {
  margin-top: 12px;
  color: #d48806;
  font-size: 13px;
}

.soft-tip {
  margin-top: 8px;
  color: rgba(0, 0, 0, 0.55);
  font-size: 13px;
}

.check-line {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  line-height: 1.65;
  color: rgba(0, 0, 0, 0.78);
  margin-bottom: 10px;
}

.line-icon {
  margin-top: 3px;
  font-size: 16px;
  flex-shrink: 0;
}

.req-line {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}

.req-no {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-top: 2px;
}

.req-line .req-text {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  line-height: 1.65;
  color: rgba(0, 0, 0, 0.78);
}

.plan-stage {
  font-weight: 700;
  font-size: 15px;
}

.plan-content {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.68);
  margin-top: 2px;
  line-height: 1.6;
}

.medical-tip {
  margin-top: 12px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.mentor-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 12px;
}

.mentor-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mentor-name {
  font-weight: 600;
  font-size: 15px;
}

.mentor-title {
  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
  margin-top: 2px;
}

.mentor-contact {
  margin-top: 10px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
}

.mentor-btn {
  margin-top: 10px;
}

.report-disclaimer {
  text-align: center;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
  padding: 20px 16px 90px;
}

.fav-entry {
  text-align: center;
  font-size: 14px;
  color: #1677ff;
  padding: 4px 0 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.fav-entry-arrow {
  font-size: 12px;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.96);
  border-top: 1px solid #f0f0f0;
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
  display: flex;
  gap: 10px;
  z-index: 20;
}

.action-btn {
  flex: 1;
  border-radius: 24px;
}

.action-btn.favorited {
  color: #faad14;
  border-color: #faad14;
}
</style>

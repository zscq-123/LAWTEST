<template>
  <div class="mobile-page report-page">
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
      <section
        class="report-hero"
        :style="{
          background: `linear-gradient(160deg, ${careerColor} 0%, ${careerColor}cc 45%, ${careerColor}88 100%)`
        }"
      >
        <div v-if="careerIllustration(career.id)" class="hero-illust">
          <img :src="careerIllustration(career.id)" :alt="career.name" />
          <div class="hero-illust-mask" />
        </div>
        <div class="hero-content">
          <div class="hero-badge">
            <star-filled style="font-size: 11px" />
            五彩法途 · 职业画像
          </div>
          <h1 class="hero-name">{{ career.name }}</h1>
          <div class="hero-slogan">“{{ report.profile.slogan }}”</div>
          <a-statistic
            class="hero-stat"
            title="匹配度"
            :value="first.matchRate"
            :value-style="{ color: '#fff', fontSize: '52px', fontWeight: 800 }"
            :suffix="`%`"
            :title-style="{ color: 'rgba(255, 255, 255, 0.92)', fontSize: '13px', letterSpacing: '3px' }"
          />
          <a-divider class="hero-divider" />
          <div class="hero-second">
            <span class="second-label">第二适配</span>
            <a-tag
              :color="second.colorCode"
              bordered
              class="second-tag"
              :style="{ color: textOnColor(second.colorCode) }"
            >
              {{ second.name }}
            </a-tag>
            <span class="second-rate">{{ second.matchRate }}%</span>
          </div>
          <div class="hero-code">报告编号 {{ report.code }}</div>
        </div>
      </section>

      <!-- 章节容器 -->
      <div class="report-chapters">
        <!-- 勾选词 -->
        <section class="report-section">
          <header class="section-head">
            <bulb-filled class="section-icon" />
            <h2 class="section-title">你勾选的特质词</h2>
            <a-tag color="blue" bordered>{{ report.match.keywordIds.length }} 个</a-tag>
          </header>
          <div class="word-chips">
            <a-tag
              v-for="id in report.match.keywordIds"
              :key="id"
              :color="careerColor"
              bordered
              class="word-chip"
              :style="{ color: textOnColor(careerColor) }"
            >
              {{ wordOfID(id) }}
            </a-tag>
          </div>
          <div v-if="report.match.tie" class="status-tip">
            <warning-filled />
            <span>并列双适配：{{ tieNames }}</span>
          </div>
          <div v-if="report.match.tip" class="status-tip soft">
            <info-circle-filled />
            <span>{{ report.match.tip }}</span>
          </div>
        </section>

        <!-- 能力优势 -->
        <section class="report-section">
          <header class="section-head">
            <check-circle-filled :style="{ color: careerColor }" class="section-icon" />
            <h2 class="section-title">你的能力优势</h2>
            <a-tag color="success" bordered>{{ report.profile.strengths.length }} 项</a-tag>
          </header>
          <a-list :data-source="report.profile.strengths" :split="false">
            <template #renderItem="{ item, index }">
              <a-list-item class="check-line">
                <span class="bullet-num" :style="{ background: careerColor }">{{ index + 1 }}</span>
                <span class="line-text">{{ item }}</span>
              </a-list-item>
            </template>
          </a-list>
        </section>

        <!-- 短板 -->
        <section class="report-section">
          <header class="section-head">
            <bulb-filled style="color: #faad14" class="section-icon" />
            <h2 class="section-title">短板与提升建议</h2>
            <a-tag color="warning" bordered>{{ report.profile.improvements.length }} 项</a-tag>
          </header>
          <a-list :data-source="report.profile.improvements" :split="false">
            <template #renderItem="{ item, index }">
              <a-list-item class="check-line">
                <span class="bullet-num warn">{{ index + 1 }}</span>
                <span class="line-text">{{ item }}</span>
              </a-list-item>
            </template>
          </a-list>
        </section>

        <!-- 雷达图 -->
        <section class="report-section">
          <header class="section-head">
            <radar-chart-outlined :style="{ color: careerColor }" class="section-icon" />
            <h2 class="section-title">能力雷达图</h2>
            <a-tag
              :color="careerColor"
              bordered
              :style="{ color: textOnColor(careerColor) }"
            >六维</a-tag>
          </header>
          <RadarChart :axes="RADAR_AXES" :values="radar" :color="careerColor" :height="280" />
        </section>

        <!-- 体能要求 -->
        <section class="report-section">
          <header class="section-head">
            <check-circle-filled :style="{ color: careerColor }" class="section-icon" />
            <h2 class="section-title">身体素质达标要求</h2>
            <a-tag
              :color="careerColor"
              bordered
              :style="{ color: textOnColor(careerColor) }"
            >{{ report.fitnessRequirements.length }} 项</a-tag>
          </header>
          <a-list :data-source="report.fitnessRequirements" :split="false">
            <template #renderItem="{ item }">
              <a-list-item class="req-line">
                <span class="req-no" :style="{ background: careerColor }">{{ item.seq }}</span>
                <span class="req-text">{{ item.content }}</span>
              </a-list-item>
            </template>
          </a-list>
        </section>

        <!-- 四年计划 -->
        <section class="report-section">
          <header class="section-head">
            <rise-outlined :style="{ color: careerColor }" class="section-icon" />
            <h2 class="section-title">大学四年锻炼计划</h2>
            <a-tag
              :color="careerColor"
              bordered
              :style="{ color: textOnColor(careerColor) }"
            >{{ report.fitnessPlans.length }} 年</a-tag>
          </header>
          <a-timeline>
            <a-timeline-item
              v-for="plan in report.fitnessPlans"
              :key="plan.id"
              :color="careerColor"
            >
              <div class="plan-stage">{{ plan.yearStage }}</div>
              <div class="plan-content">{{ plan.content }}</div>
            </a-timeline-item>
          </a-timeline>
          <div class="medical-tip">
            <info-circle-filled />
            <span>{{ disclaimer }}</span>
          </div>
        </section>

        <!-- 导师 -->
        <section class="report-section">
          <header class="section-head">
            <team-outlined :style="{ color: careerColor }" class="section-icon" />
            <h2 class="section-title">实务导师对接</h2>
            <a-tag
              :color="careerColor"
              bordered
              :style="{ color: textOnColor(careerColor) }"
            >{{ report.mentors.length }} 位</a-tag>
          </header>
          <a-empty
            v-if="!report.mentors.length"
            description="导师名单待学院确认，敬请期待"
            :image-style="{ height: '60px' }"
          />
          <a-list v-else :data-source="report.mentors" :split="false">
            <template #renderItem="{ item }">
              <a-list-item class="mentor-item">
                <a-card size="small" class="mentor-card" :bordered="false">
                  <div class="mentor-head">
                    <a-avatar :size="44" :style="{ background: careerColor }">
                      {{ item.name.charAt(0) }}
                    </a-avatar>
                    <div class="mentor-info">
                      <div class="mentor-name">{{ item.name }}</div>
                      <div class="mentor-title">{{ item.title }}</div>
                    </div>
                  </div>
                  <div v-if="item.contact" class="mentor-contact">
                    <phone-outlined /> {{ item.contact }}
                  </div>
                  <a-button
                    v-if="item.bookingUrl"
                    type="primary"
                    block
                    :href="item.bookingUrl"
                    target="_blank"
                    class="mentor-btn"
                    :style="{ background: careerColor, borderColor: careerColor }"
                  >
                    预约交流
                  </a-button>
                  <div v-else class="mentor-tip">可至「导师面对面」交流区现场咨询</div>
                </a-card>
              </a-list-item>
            </template>
          </a-list>
        </section>

        <div class="report-disclaimer">{{ report.match.disclaimer }}</div>
      </div>
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
      <a-button
        size="large"
        class="action-btn"
        :class="{ favorited: isFavorite }"
        @click="toggleFavorite"
      >
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
  InfoCircleFilled,
  LinkOutlined,
  PhoneOutlined,
  PictureOutlined,
  RadarChartOutlined,
  RightOutlined,
  RiseOutlined,
  StarFilled,
  StarOutlined,
  TeamOutlined,
  WarningFilled
} from '@ant-design/icons-vue'
import RadarChart from '@/components/RadarChart.vue'
import { getReport } from '@/api'
import { careerIllustration } from '@/utils/illustration'
import { textOnColor } from '@/utils/color'
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

function wordOfID(id: number): string {
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
    if (!store.careers.length) await store.loadCareers()
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

/* hero */
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

.hero-content {
  position: relative;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  font-size: 12px;
  letter-spacing: 2px;
  margin-bottom: 14px;
}

.hero-name {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 6px;
  margin: 0;
}

.hero-slogan {
  margin-top: 10px;
  font-size: 15px;
  opacity: 0.92;
  letter-spacing: 0.5px;
}

.hero-stat {
  margin-top: 18px;
}

.hero-stat :deep(.ant-statistic-content) {
  font-feature-settings: 'tnum';
}

.hero-divider {
  margin: 18px 24px;
  border-color: rgba(255, 255, 255, 0.25);
}

.hero-second {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  opacity: 0.92;
}

.second-label {
  font-size: 12px;
  letter-spacing: 2px;
  opacity: 0.7;
}

.second-tag {
  font-weight: 600;
}

.second-rate {
  font-weight: 700;
  font-feature-settings: 'tnum';
}

.hero-code {
  margin-top: 12px;
  font-size: 12px;
  opacity: 0.75;
  letter-spacing: 1px;
}

/* 章节 */
.report-chapters {
  padding-top: 8px;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.section-icon {
  font-size: 18px;
  color: #1677ff;
}

.section-title {
  font-size: 17px;
  font-weight: 700;
  margin: 0;
  flex: 1;
  letter-spacing: 1px;
}

.word-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.word-chip {
  margin: 0;
  font-size: 13px;
}

.status-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  padding: 10px 14px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  color: #d48806;
  font-size: 13px;
}

.status-tip.soft {
  background: #f0f5ff;
  border-color: #adc6ff;
  color: #1d39c4;
}

.check-line {
  padding: 8px 0 !important;
  display: flex !important;
  align-items: flex-start !important;
  gap: 10px;
  border-bottom: 1px dashed #f0f0f0;
}

.check-line:last-child {
  border-bottom: none;
}

.bullet-num {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #1677ff;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  margin-top: 2px;
}

.bullet-num.warn {
  background: #faad14;
}

.line-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.65;
  color: rgba(0, 0, 0, 0.78);
}

.req-line {
  padding: 8px 0 !important;
  display: flex !important;
  align-items: flex-start !important;
  gap: 10px;
  border-bottom: 1px dashed #f0f0f0;
}

.req-line:last-child {
  border-bottom: none;
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

.req-text {
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
  margin-top: 4px;
  line-height: 1.65;
}

.medical-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.mentor-item {
  padding: 8px 0 !important;
}

.mentor-card {
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.mentor-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mentor-info {
  flex: 1;
  min-width: 0;
}

.mentor-name {
  font-weight: 600;
  font-size: 15px;
}

.mentor-title {
  color: rgba(0, 0, 0, 0.55);
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

.mentor-tip {
  margin-top: 10px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 13px;
}

.report-disclaimer {
  text-align: center;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
  padding: 20px 16px 90px;
  letter-spacing: 0.5px;
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
  backdrop-filter: blur(10px);
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
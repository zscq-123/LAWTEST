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
        :class="{ 'hero-light': isLightCareer }"
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
            :value-style="{ color: careerFg, fontSize: '52px', fontWeight: 800 }"
            :suffix="`%`"
            :title-style="{ color: careerFg, fontSize: '13px', letterSpacing: '3px', opacity: 0.75 }"
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
            <a-tag :color="careerColor" bordered :style="{ color: textOnColor(careerColor) }">{{ report.match.keywordIds.length }} 个</a-tag>
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

        <!-- 能力优势（AI 生成，不再使用预设模板字段） -->
        <section class="report-section">
          <header class="section-head">
            <check-circle-filled :style="{ color: careerAccent }" class="section-icon" />
            <h2 class="section-title">你的能力优势</h2>
            <a-tag v-if="hasAi" :color="careerColor" bordered :style="{ color: textOnColor(careerColor) }">{{ displayStrengths.length }} 项</a-tag>
            <a-tag v-else-if="aiLoading" color="processing" bordered>AI 生成中</a-tag>
          </header>
          <div v-if="aiLoading" class="ai-loading">
            <a-spin size="small" />
            <span class="ai-loading-text">AI 正在分析你的优势…</span>
          </div>
          <a-list v-else :data-source="displayStrengths" :split="false">
            <template #renderItem="{ item, index }">
              <a-list-item class="check-line">
                <span class="bullet-num" :style="{ background: careerAccent }">{{ index + 1 }}</span>
                <span class="line-text">{{ item }}</span>
              </a-list-item>
            </template>
          </a-list>
        </section>

        <!-- 短板（AI 生成，不再使用预设模板字段） -->
        <section class="report-section">
          <header class="section-head">
            <bulb-filled style="color: #e0a464" class="section-icon" />
            <h2 class="section-title">短板与提升建议</h2>
            <a-tag v-if="hasAi" color="warning" bordered>{{ displayImprovements.length }} 项</a-tag>
            <a-tag v-else-if="aiLoading" color="processing" bordered>AI 生成中</a-tag>
          </header>
          <div v-if="aiLoading" class="ai-loading">
            <a-spin size="small" />
            <span class="ai-loading-text">AI 正在分析你的短板…</span>
          </div>
          <a-list v-else :data-source="displayImprovements" :split="false">
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
            <radar-chart-outlined :style="{ color: careerAccent }" class="section-icon" />
            <h2 class="section-title">能力雷达图</h2>
            <a-tag
              :color="careerColor"
              bordered
              :style="{ color: textOnColor(careerColor) }"
            >六维</a-tag>
          </header>
          <RadarChart :axes="RADAR_AXES" :values="radar" :color="careerAccent" :height="280" />
        </section>

        <!-- 体能要求 -->
        <section class="report-section">
          <header class="section-head">
            <check-circle-filled :style="{ color: careerAccent }" class="section-icon" />
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
                <span class="req-no" :style="{ background: careerAccent }">{{ item.seq }}</span>
                <span class="req-text">{{ item.content }}</span>
              </a-list-item>
            </template>
          </a-list>
        </section>

        <!-- 四年计划 -->
        <section class="report-section">
          <header class="section-head">
            <rise-outlined :style="{ color: careerAccent }" class="section-icon" />
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
            <team-outlined :style="{ color: careerAccent }" class="section-icon" />
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
                    <a-avatar :size="44" :style="{ background: careerAccent }">
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
                    :style="{ background: careerAccent, borderColor: careerAccent }"
                  >
                    预约交流
                  </a-button>
                  <div v-else class="mentor-tip">可至「导师面对面」交流区现场咨询</div>
                </a-card>
              </a-list-item>
            </template>
          </a-list>
        </section>

        <!-- AI 深度分析 -->
        <section class="report-section ai-section">
          <header class="section-head">
            <robot-outlined :style="{ color: careerAccent }" class="section-icon" />
            <h2 class="section-title">AI 深度分析</h2>
            <a-tag
              :color="careerColor"
              bordered
              :style="{ color: textOnColor(careerColor) }"
            >MiMo</a-tag>
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
          >
            <template #action>
              <a-button size="small" type="primary" @click="runAiAnalyze">
                <template #icon><reload-outlined /></template>
                重试
              </a-button>
            </template>
          </a-alert>

          <template v-else-if="aiAnalysis">
            <div class="ai-summary">
              <robot-outlined :style="{ color: careerAccent }" class="ai-summary-icon" />
              <p class="ai-summary-text">{{ aiAnalysis.summary }}</p>
            </div>

            <!-- 优势/短板已在上方章节展示（AI 生成），此处仅保留四年发展建议 -->
            <div v-if="aiAnalysis.plans.length" class="ai-block">
              <div class="ai-block-title">
                <rise-outlined :style="{ color: careerAccent }" />
                四年发展建议
              </div>
              <div v-for="(s, i) in aiAnalysis.plans" :key="i" class="ai-line">
                <span class="ai-badge" :style="{ background: careerAccent }">{{ i + 1 }}</span>
                <span class="ai-text">{{ s }}</span>
              </div>
            </div>

            <blockquote v-if="aiAnalysis.motto" class="ai-motto" :style="{ borderColor: careerAccent }">
              {{ aiAnalysis.motto }}
            </blockquote>

            <div class="ai-disclaimer">
              <info-circle-filled />
              {{ aiAnalysis.disclaimer }}
            </div>
          </template>
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

    <!-- 长图保存预览（兜底：长按图片保存到相册） -->
    <a-modal
      v-model:open="previewOpen"
      :footer="null"
      title="长图已生成"
      :width="'min(92vw, 420px)'"
      centered
    >
      <div class="preview-tip">
        <info-circle-filled />
        长按下方图片，选择「保存到相册」
      </div>
      <img :src="previewUrl" alt="报告长图预览" class="preview-img" />
      <a-button
        type="primary"
        block
        size="large"
        class="preview-download"
        @click="downloadFromPreview"
      >
        <template #icon><download-outlined /></template>
        直接下载到设备
      </a-button>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  BulbFilled,
  CheckCircleFilled,
  DownloadOutlined,
  InfoCircleFilled,
  LinkOutlined,
  PhoneOutlined,
  PictureOutlined,
  RadarChartOutlined,
  ReloadOutlined,
  RightOutlined,
  RiseOutlined,
  RobotOutlined,
  StarFilled,
  StarOutlined,
  TeamOutlined,
  WarningFilled
} from '@ant-design/icons-vue'
import RadarChart from '@/components/RadarChart.vue'
import { aiAnalyze, getReport } from '@/api'
import { careerIllustration } from '@/utils/illustration'
import { isNearWhite, textOnColor } from '@/utils/color'
import { isMobile } from '@/utils/device'
import { useTestStore } from '@/stores/test'
import { RADAR_AXES, radarValues } from '@/utils/radar'
import type { AiAnalysisVO, Report } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useTestStore()
const loading = ref(true)
const error = ref(false)
const saving = ref(false)
const report = ref<Report | null>(null)
const captureRef = ref<HTMLElement | null>(null)
const aiAnalysis = ref<AiAnalysisVO | null>(null)
const aiLoading = ref(false)
const aiError = ref('')

const FAV_KEY = 'lawtest_favorites'

const first = computed(() => report.value!.match.first)
const second = computed(() => report.value!.match.second)
const career = computed(() => report.value!.career)
const careerColor = computed(() => career.value.colorCode)
/** 职业色接近纯白（如律师皓月白）：hero 区需用深色调文字/边框保证可读 */
const isLightCareer = computed(() => isNearWhite(careerColor.value))
/** hero 区前景色：浅色职业用深蓝灰，深色职业用白 */
const careerFg = computed(() => (isLightCareer.value ? 'rgba(52, 64, 84, 0.95)' : '#ffffff'))
/** 章节强调色（图标/序号/雷达图）：浅色职业用深蓝灰保证可见 */
const careerAccent = computed(() => (isLightCareer.value ? '#5C7693' : careerColor.value))
const radar = computed(() => radarValues(career.value.id, first.value.matchRate))
const disclaimer = '本内容为通识性建议，非医疗意见；如有健康问题请遵医嘱。'

/** AI 生成内容：能力优势/短板一律来自 AI 分析，不再使用预设模板字段 */
const hasAi = computed(() => !!aiAnalysis.value)
const displayStrengths = computed(() => aiAnalysis.value?.strengths || [])
const displayImprovements = computed(() => aiAnalysis.value?.improvements || [])

/** 长图保存：预览弹窗兜底（手机浏览器/微信不支持 download 直接入相册） */
const previewOpen = ref(false)
const previewUrl = ref('')

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
    // 报告缓存了 AI 分析则直接展示（生成一次，扫码打开可复用）
    if (data.aiAnalysis) {
      aiAnalysis.value = data.aiAnalysis
    } else {
      // 无缓存：自动调用 AI 生成（大屏画像页同款逻辑），优势/短板等章节均以 AI 内容为准
      runAiAnalyze()
    }
    if (!store.careers.length) await store.loadCareers()
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

/** 保存长图：优先系统分享入相册，兜底预览图长按保存（兼容 iOS Safari / 微信内置浏览器） */
async function saveImage() {
  saving.value = true
  try {
    // html2canvas-pro：维护版分支，支持 color-mix 等现代 CSS（1.4.1 会解析失败）
    const html2canvas = (await import('html2canvas-pro')).default
    const node = captureRef.value
    if (!node) return
    // 手机端画布有尺寸/内存上限：按总像素封顶缩放（约 450 万像素），避免超限生成失败
    const width = node.offsetWidth || 375
    const height = node.offsetHeight || 4000
    const scale = isMobile()
      ? Math.max(0.5, Math.min(2, Math.sqrt(4_500_000 / (width * height))))
      : 2
    const canvas = await html2canvas(node, {
      backgroundColor: '#faf7f1',
      scale,
      useCORS: true
    })
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('图片导出失败'))), 'image/png')
    )
    const fileName = `五彩法途-${career.value.name}-${report.value!.code}.png`

    // 方案一：系统分享（iOS 分享面板选「存储图像」即入相册；Android 可保存/下载）
    const file = new File([blob], fileName, { type: 'image/png' })
    const shareData: ShareData = { files: [file] }
    const canShareFiles =
      typeof navigator.share === 'function' &&
      (typeof navigator.canShare !== 'function' || navigator.canShare(shareData))
    if (canShareFiles) {
      try {
        await navigator.share(shareData)
        message.success('已调起系统分享，请选择「存储图像/保存到相册」')
        return
      } catch (e) {
        // 用户主动取消分享不算失败；其余异常落入预览兜底
        if ((e as DOMException)?.name === 'AbortError') return
      }
    }

    // 方案二：预览弹窗，长按图片保存到相册
    // 用 data URL（微信内置浏览器对 blob URL 长按保存兼容性差，data URL 最稳）
    previewUrl.value = canvas.toDataURL('image/png')
    previewOpen.value = true
  } catch {
    message.error('长图生成失败，请重试')
  } finally {
    saving.value = false
  }
}

/** 预览弹窗内“直接下载”（Android Chrome 会存入下载目录） */
function downloadFromPreview() {
  if (!previewUrl.value) return
  const link = document.createElement('a')
  link.href = previewUrl.value
  link.download = `五彩法途-${career.value.name}-${report.value!.code}.png`
  link.click()
  message.success('已尝试下载，如未成功请长按预览图保存到相册')
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

/** 手机端按报告编号生成 AI 分析（已缓存则直接返回并展示） */
async function runAiAnalyze() {
  if (!report.value) return
  aiLoading.value = true
  aiError.value = ''
  try {
    const data = await aiAnalyze(report.value.code)
    aiAnalysis.value = data
    if (report.value) report.value.aiAnalysis = data
  } catch (e) {
    aiError.value = e instanceof Error ? e.message : 'AI 分析失败，请稍后重试'
  } finally {
    aiLoading.value = false
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

/* 浅色职业（如律师皓月白）：hero 底色接近白色，文字与描边换深色保证可读 */
.report-hero.hero-light {
  color: rgba(52, 64, 84, 0.95);
}

.report-hero.hero-light .hero-badge {
  background: rgba(52, 64, 84, 0.1);
}

.report-hero.hero-light .hero-divider {
  border-color: rgba(52, 64, 84, 0.2);
}

.report-hero.hero-light .hero-illust-mask {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.35), rgba(250, 247, 241, 0.85));
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
  background: linear-gradient(180deg, rgba(52, 64, 84, 0.08), rgba(52, 64, 84, 0.40));
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
  color: var(--brand-primary);
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
  background: rgba(244, 200, 163, 0.18);
  border: 1px solid rgba(244, 200, 163, 0.55);
  border-radius: 8px;
  color: #b8754a;
  font-size: 13px;
}

.status-tip.soft {
  background: rgba(228, 238, 247, 0.55);
  border-color: rgba(124, 154, 184, 0.30);
  color: rgba(52, 64, 84, 0.75);
}

.check-line {
  padding: 8px 0 !important;
  display: flex !important;
  align-items: flex-start !important;
  gap: 10px;
  border-bottom: 1px dashed rgba(124, 154, 184, 0.16);
}

.check-line:last-child {
  border-bottom: none;
}

.bullet-num {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--brand-primary);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  margin-top: 2px;
}

.bullet-num.warn {
  background: #e0a464;
}

.line-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.65;
  color: rgba(52, 64, 84, 0.85);
}

.req-line {
  padding: 8px 0 !important;
  display: flex !important;
  align-items: flex-start !important;
  gap: 10px;
  border-bottom: 1px dashed rgba(124, 154, 184, 0.16);
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
  color: rgba(52, 64, 84, 0.85);
}

.plan-stage {
  font-weight: 700;
  font-size: 15px;
}

.plan-content {
  font-size: 14px;
  color: rgba(52, 64, 84, 0.68);
  margin-top: 4px;
  line-height: 1.65;
}

.medical-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 12px;
  color: rgba(52, 64, 84, 0.48);
}

.mentor-item {
  padding: 8px 0 !important;
}

.mentor-card {
  background: rgba(228, 238, 247, 0.40);
  border-radius: 8px;
  border: 1px solid rgba(124, 154, 184, 0.16);
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
  color: rgba(52, 64, 84, 0.55);
  font-size: 12px;
  margin-top: 2px;
}

.mentor-contact {
  margin-top: 10px;
  font-size: 13px;
  color: rgba(52, 64, 84, 0.68);
}

.mentor-btn {
  margin-top: 10px;
}

.mentor-tip {
  margin-top: 10px;
  color: rgba(52, 64, 84, 0.48);
  font-size: 13px;
}

.report-disclaimer {
  text-align: center;
  font-size: 12px;
  color: rgba(52, 64, 84, 0.42);
  padding: 20px 16px 90px;
  letter-spacing: 0.5px;
}

.fav-entry {
  text-align: center;
  font-size: 14px;
  color: var(--brand-primary);
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
  border-top: 1px solid rgba(124, 154, 184, 0.16);
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
  color: #e0a464;
  border-color: #e0a464;
}

/* 长图保存预览弹窗 */
.preview-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(52, 64, 84, 0.68);
  margin-bottom: 12px;
}

.preview-img {
  width: 100%;
  max-height: 62vh;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid rgba(124, 154, 184, 0.16);
  background: #fff;
  display: block;
}

.preview-download {
  margin-top: 14px;
  border-radius: 24px;
  font-weight: 600;
}

/* AI 深度分析（手机端） */
.ai-section {
  border: 1px dashed rgba(124, 154, 184, 0.30);
}

.ai-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px 0;
  color: rgba(52, 64, 84, 0.50);
}

.ai-loading-text {
  font-size: 13px;
  letter-spacing: 1px;
}

.ai-error {
  margin: 0;
}

.ai-summary {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: rgba(228, 238, 247, 0.50);
  border-radius: 8px;
  margin-bottom: 16px;
}

.ai-summary-icon {
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 2px;
}

.ai-summary-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
  color: rgba(52, 64, 84, 0.85);
}

.ai-block {
  margin-bottom: 16px;
}

.ai-block-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(52, 64, 84, 0.92);
  margin-bottom: 8px;
}

.ai-line {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px dashed rgba(124, 154, 184, 0.16);
}

.ai-line:last-child {
  border-bottom: none;
}

.ai-badge {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  margin-top: 2px;
}

.ai-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.7;
  color: rgba(52, 64, 84, 0.85);
}

.ai-motto {
  margin: 4px 0 0;
  padding: 10px 14px;
  border-left: 3px solid;
  border-radius: 6px;
  background: rgba(228, 238, 247, 0.50);
  font-size: 14px;
  font-style: italic;
  color: rgba(52, 64, 84, 0.85);
  line-height: 1.7;
}

.ai-disclaimer {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 12px;
  color: rgba(52, 64, 84, 0.48);
  line-height: 1.6;
}

.ai-run-btn {
  margin-top: 8px;
}
</style>
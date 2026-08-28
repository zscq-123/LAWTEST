<template>
  <ScreenFrame>
    <a-config-provider :theme="careerTheme">
      <div class="screen-page fitness-page">
        <header class="fitness-head">
          <div>
            <h1 class="screen-title">
              <span :style="{ color: careerFg }">{{ report?.career?.name || '' }}</span>
              · 体能赋能方案
            </h1>
            <p class="screen-subtitle">身体是职业长跑的本钱，大学四年一步一步来</p>
          </div>
          <a-space :size="8" wrap>
            <a-button size="large" @click="router.push('/profile')">
              <template #icon><arrow-left-outlined /></template>
              返回画像
            </a-button>
          </a-space>
        </header>

        <a-spin v-if="!report" class="fitness-loading" size="large" />

        <template v-else>
          <section class="fitness-body">
            <aside v-if="careerIllustration(report.career.id)" class="fitness-side panel-in">
              <div class="side-illust">
                <img :src="careerIllustration(report.career.id)" :alt="report.career.name" />
                <div class="side-illust-mask" />
              </div>
              <div class="side-meta">
                <CareerAvatar
                  :id="report.career.id"
                  :name="report.career.name"
                  :color="careerAccent"
                  size="md"
                  class="side-avatar"
                />
                <div class="side-name" :style="{ color: careerFg }">{{ report.career.name }}</div>
                <a-tag
                  :color="careerColor"
                  bordered
                  class="side-color"
                  :style="{ color: textOnColor(careerColor) }"
                >
                  {{ report.career.colorName }}
                </a-tag>
                <div class="side-slogan">“{{ report.profile.slogan }}”</div>
              </div>
            </aside>

            <article class="panel glass-panel panel-in">
              <header class="panel-header">
                <check-circle-outlined :style="{ color: careerAccent }" class="panel-icon" />
                <h3 class="panel-title">身体素质达标要求</h3>
                <a-tag
                  :color="careerColor"
                  bordered
                  :style="{ color: textOnColor(careerColor) }"
                >
                  {{ report.fitnessRequirements.length }} 项
                </a-tag>
              </header>
              <a-list :data-source="report.fitnessRequirements" :split="false">
                <template #renderItem="{ item }">
                  <a-list-item class="req-item">
                    <span class="req-badge" :style="{ background: careerAccent }">
                      {{ item.seq }}
                    </span>
                    <span class="req-text">{{ item.content }}</span>
                  </a-list-item>
                </template>
              </a-list>
            </article>

            <article class="panel glass-panel panel-in">
              <header class="panel-header">
                <rise-outlined :style="{ color: careerAccent }" class="panel-icon" />
                <h3 class="panel-title">大学四年锻炼计划</h3>
                <a-tag
                  v-if="hasAi"
                  :color="careerColor"
                  bordered
                  :style="{ color: textOnColor(careerColor) }"
                >AI 生成</a-tag>
                <a-tag v-else color="processing" bordered>待生成</a-tag>
              </header>
              <a-empty
                v-if="!displayPlans.length"
                description="在画像页生成 AI 分析后，此处展示个性化锻炼计划"
                :image-style="{ height: '50px' }"
                class="plan-empty"
              />
              <a-timeline v-else class="plan-timeline">
                <a-timeline-item
                  v-for="(plan, index) in displayPlans"
                  :key="index"
                  :color="careerColor"
                >
                  <div class="plan-stage">{{ plan.stage }}</div>
                  <div class="plan-content pre-line">{{ plan.content }}</div>
                </a-timeline-item>
              </a-timeline>
            </article>
          </section>

          <footer class="fitness-actions">
            <a-space :size="12" wrap>
              <a-button size="large" type="primary" class="btn-primary-glow" @click="qrOpen = true">
                <template #icon><qrcode-outlined /></template>
                扫码带走
              </a-button>
              <a-button size="large" ghost @click="mentorOpen = true">
                <template #icon><team-outlined /></template>
                导师对接
              </a-button>
            </a-space>
          </footer>

          <div class="fitness-disclaimer">
            <info-circle-outlined />
            {{ disclaimer }} · {{ report.match.disclaimer }}
          </div>
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  QrcodeOutlined,
  RiseOutlined,
  TeamOutlined
} from '@ant-design/icons-vue'
import ScreenFrame from '@/components/ScreenFrame.vue'
import QrPanel from '@/components/QrPanel.vue'
import MentorModal from '@/components/MentorModal.vue'
import { careerIllustration } from '@/utils/illustration'
import { isNearWhite, textOnColor } from '@/utils/color'
import { useTestStore } from '@/stores/test'

const store = useTestStore()
const router = useRouter()
const qrOpen = ref(false)
const mentorOpen = ref(false)

const report = computed(() => store.report)
const career = computed(() => store.report?.career || null)
const careerColor = computed(() => career.value?.colorCode || '#7C9AB8')
/** 职业色接近纯白（如律师皓月白）时在浅色卡片上需用深色调文字保证可读 */
const isLightCareer = computed(() => isNearWhite(careerColor.value))
const careerFg = computed(() => (isLightCareer.value ? 'rgba(52, 64, 84, 0.92)' : careerColor.value))
/** 职业强调色（图标/头像/序号底）：浅色职业用深蓝灰，深色职业用原职业色 */
const careerAccent = computed(() => (isLightCareer.value ? '#5C7693' : careerColor.value))
const disclaimer = '本内容为通识性建议，非医疗意见；如有健康问题请遵医嘱。'

/** AI 深度分析（由画像页生成后同步到 store.report） */
const aiAnalysis = computed(() => report.value?.aiAnalysis || null)
const hasAi = computed(() => !!aiAnalysis.value)

/** 四年锻炼计划：全部来自 AI 生成的个性化体育锻炼计划（不再使用预设模板） */
const displayPlans = computed(() => {
  if (!aiAnalysis.value?.plans?.length) return []
  return aiAnalysis.value.plans.map((content, i) => {
    // 每条以换行分隔：第一行为阶段标题（如「大一：筑基适应年｜打好体能基础」），
    // 其余行（核心目标 / 年度细分小目标）作为正文保留换行展示
    const lines = content.split(/\n/).map((l) => l.trim()).filter(Boolean)
    if (!lines.length) return { stage: `锻炼建议 ${i + 1}`, content: '', details: [] }
    return {
      stage: lines[0],
      content: lines.slice(1).join('\n'),
      details: lines.slice(1)
    }
  })
})

const careerTheme = computed(() => ({
  token: {
    colorPrimary: careerAccent.value,
    borderRadius: 8
  }
}))
</script>

<style scoped>
.fitness-page {
  padding: clamp(14px, 3vh, 44px) clamp(20px, 4.6vw, 80px);
  gap: clamp(12px, 1.6vh, 22px);
}

.fitness-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
  flex-shrink: 0;
}

.fitness-head :deep(.ant-btn-lg) {
  height: clamp(38px, 4vh, 52px);
  padding: 0 clamp(16px, 1.8vw, 26px);
  font-size: clamp(13px, 1.2vw, 17px);
  border-radius: var(--radius-pill);
}

.fitness-loading {
  margin: auto;
}

.fitness-body {
  flex: 1;
  display: grid;
  grid-template-columns: minmax(200px, 0.8fr) 1fr 1.2fr;
  gap: clamp(14px, 1.8vw, 28px);
  align-items: start;
  padding-right: 4px;
  padding-bottom: clamp(8px, 1.2vh, 16px);
}

/* 侧边插画卡 */
.fitness-side {
  position: relative;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--bg-panel);
  backdrop-filter: blur(12px);
}

.side-illust {
  position: relative;
  height: clamp(140px, 20vh, 220px);
  overflow: hidden;
}

.side-illust img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 28%;
  display: block;
}

.side-illust-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 100%);
}

.side-meta {
  flex: 1;
  padding: clamp(12px, 1.6vh, 22px) clamp(12px, 1.4vw, 22px);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.side-avatar {
  margin-bottom: var(--space-2);
}

.side-name {
  font-size: clamp(20px, 2vw, 28px);
  font-weight: var(--fw-heavy);
  letter-spacing: 2px;
}

.side-color {
  margin: 0;
  font-weight: 400;
}

.side-slogan {
  font-size: clamp(12px, 1.05vw, 14px);
  color: var(--text-secondary);
  letter-spacing: 0.5px;
  font-style: italic;
  margin-top: var(--space-2);
  line-height: 1.5;
}

/* 面板 */
.panel {
  padding: clamp(14px, 1.9vh, 28px) clamp(14px, 1.8vw, 28px);
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
  letter-spacing: 1px;
}

.req-item {
  padding: clamp(6px, 0.8vh, 12px) 0 !important;
  display: flex !important;
  align-items: flex-start !important;
  gap: clamp(8px, 0.8vw, 14px);
  border-bottom: 1px dashed var(--border-subtle);
}

.req-item:last-child {
  border-bottom: none;
}

.req-badge {
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

.req-text {
  flex: 1;
  min-width: 0;
  font-size: clamp(13px, 1.15vw, 16px);
  line-height: 1.7;
  color: var(--text-secondary);
}

.plan-timeline {
  padding-top: 6px;
}

.plan-stage {
  font-size: clamp(14px, 1.35vw, 18px);
  font-weight: var(--fw-bold);
  color: var(--text-primary);
  letter-spacing: 1px;
}

.plan-content {
  font-size: clamp(13px, 1.15vw, 16px);
  line-height: 1.7;
  color: var(--text-secondary);
  margin-top: var(--space-1);
}

.plan-content.pre-line {
  white-space: pre-line;
}

.fitness-actions {
  flex-shrink: 0;
}

.fitness-actions :deep(.ant-btn-lg) {
  height: clamp(40px, 4.2vh, 56px);
  padding: 0 clamp(20px, 2.4vw, 36px);
  font-size: clamp(13px, 1.2vw, 17px);
  border-radius: var(--radius-pill);
}

.fitness-actions :deep(.ant-btn-primary) {
  color: var(--text-inverse);
  font-weight: var(--fw-bold);
}

.fitness-disclaimer {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 12px;
  color: var(--text-tertiary);
  letter-spacing: 1px;
  margin: 0 auto;
  text-align: center;
  flex-shrink: 0;
}
</style>
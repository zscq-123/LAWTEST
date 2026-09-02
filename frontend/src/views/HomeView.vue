<template>
  <ScreenFrame>
    <div class="screen-page home-page">
      <!-- 顶部品牌区 -->
      <header class="home-head">
        <div class="home-tag fade-in">
          <span class="tag-dot" />
          法学院迎新特别活动 · V1.0
        </div>
        <h1 class="home-title glow-text fade-in">五彩法途 · 筑梦未来</h1>
        <p class="home-subtitle fade-in">
          90 个特质词 · 6 大法律职业方向 · 3 分钟生成专属职业画像
        </p>
      </header>

      <!-- 流程步骤 -->
      <a-steps
        class="home-steps fade-in"
        :current="-1"
        size="small"
        responsive="false"
        :items="stepItems"
      />

      <!-- 大屏实时区：空闲引导 / 手机答题进度 / 活动结束汇总（仅大屏渲染） -->
      <section v-if="isBigScreenView" class="home-live fade-in">
        <template v-if="live.state === 'finished'">
          <div class="summary-wrap">
            <header class="summary-head">
              <div class="summary-tag"><span class="tag-dot" />活动测试已结束</div>
              <h2 class="summary-title">本次职业兴趣测试汇总</h2>
            </header>
            <div class="summary-stats">
              <a-statistic
                title="完成人数"
                :value="live.finishedCount"
                :value-style="{ color: 'var(--brand-primary)', fontWeight: 700 }"
              />
              <a-statistic title="目标人数" :value="live.targetCount" />
              <a-statistic title="手机端实时答题" :value="live.activeMobileCount" />
            </div>
            <div v-if="summary" class="summary-chart">
              <div class="summary-chart-title">职业分布</div>
              <div v-for="item in summary.careerDistribution" :key="item.careerId" class="summary-bar-row">
                <span class="summary-bar-name">{{ item.name }}</span>
                <div class="summary-bar-track">
                  <div class="summary-bar-fill" :style="{ width: barPercent(item.count) }" />
                </div>
                <span class="summary-bar-count">{{ item.count }} 人</span>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div v-if="live.landingQr" class="live-qr">
            <img :src="live.landingQr.image" alt="手机扫码测试二维码" class="live-qr-img" />
            <div class="live-qr-caption">手机扫码 · 也能完成测试</div>
          </div>
          <div class="live-info">
            <template v-if="live.state === 'waiting'">
              <div class="live-progress">
                <a-statistic
                  :value="live.finishedCount"
                  :value-style="{ color: 'var(--brand-primary)', fontSize: 'clamp(30px, 3.2vw, 48px)', fontWeight: 800 }"
                >
                  <template #suffix>
                    <span class="live-progress-suffix">/ {{ live.targetCount }}</span>
                  </template>
                </a-statistic>
              </div>
              <div class="live-encourage">
                已有 {{ live.finishedCount }} 位同学完成测试，还有同学正在手机上答题，一起加油！
              </div>
            </template>
            <template v-else>
              <h2 class="live-idle-title">选择你的测试方式</h2>
              <p class="live-idle-sub">
                上台直接勾选特质词（每组最多 10 个），或扫码在手机上完成 · 已完成 {{ live.finishedCount }} 人
              </p>
            </template>
          </div>
        </template>
      </section>

      <!-- 职业卡片 -->
      <section v-if="!showFinished" class="home-section">
        <a-spin v-if="!store.careers.length" />
        <div v-else class="home-grid">
          <article
            v-for="(career, index) in store.careers"
            :key="career.id"
            class="career-card"
            :style="{
              '--career-color': career.colorCode,
              animationDelay: `${0.1 + index * 0.08}s`
            }"
            tabindex="0"
            role="button"
            :aria-label="`${career.name} · 点击开始测试`"
            @click="start"
            @keyup.enter="start"
          >
            <div class="career-illust" v-if="careerIllustration(career.id)">
              <img :src="careerIllustration(career.id)" :alt="career.name" loading="lazy" />
              <div class="illust-mask" />
            </div>

            <div class="career-card-body">
              <CareerAvatar
                :id="career.id"
                :name="career.name"
                :color="career.colorCode"
                size="md"
              />
              <div class="career-name">{{ career.name }}</div>
              <a-tag
                :color="career.colorCode"
                class="career-color-tag"
                bordered
                :style="{ color: textOnColor(career.colorCode) }"
              >
                {{ career.colorName }}
              </a-tag>
              <div class="career-slogan">“{{ career.slogan }}”</div>
            </div>
          </article>
        </div>
      </section>

      <!-- 底部操作 -->
      <footer v-if="!showFinished" class="home-footer fade-in">
        <a-space :size="16" wrap>
          <a-button
            type="primary"
            size="large"
            class="btn-primary-glow"
            :loading="loading"
            @click="start"
          >
            <template #icon><rocket-outlined /></template>
            开始测试
          </a-button>
          <a-button size="large" ghost @click="goFavorites">
            <template #icon><star-outlined /></template>
            我的收藏
          </a-button>
        </a-space>
        <div class="home-tip">
          本结果为兴趣初步画像，仅供参考 · 测试时长约 2 分钟
        </div>
      </footer>
    </div>
  </ScreenFrame>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { RocketOutlined, StarOutlined } from '@ant-design/icons-vue'
import ScreenFrame from '@/components/ScreenFrame.vue'
import CareerAvatar from '@/components/CareerAvatar.vue'
import { careerIllustration } from '@/utils/illustration'
import { textOnColor } from '@/utils/color'
import { useTestStore } from '@/stores/test'
import { useIdentityStore } from '@/stores/identity'
import { useLiveStore } from '@/stores/live'
import { getStatsSummary } from '@/api'
import { isBigScreen, isMobile } from '@/utils/device'
import type { StatsSummary } from '@/types'

const store = useTestStore()
const identity = useIdentityStore()
const live = useLiveStore()
const router = useRouter()
const loading = ref(false)

/** 大屏端：状态机/落地二维码/汇总；手机端不渲染该区域 */
const isBigScreenView = isBigScreen()
/** 活动结束（大屏端 X>=Y）：隐藏职业卡片，展示汇总 */
const showFinished = computed(() => isBigScreenView && live.state === 'finished')
/** 结束态汇总（复用统计接口） */
const summary = ref<StatsSummary | null>(null)

const stepItems = [
  { title: '勾选特质' },
  { title: '匹配职业' },
  { title: '揭晓画像' },
  { title: '扫码保存' }
]

watch(
  () => live.state,
  (s) => {
    if (s === 'finished') {
      getStatsSummary()
        .then((data) => (summary.value = data))
        .catch(() => undefined)
    }
  }
)

onMounted(() => {
  store.loadCareers().catch(() => undefined)
  if (isBigScreenView) {
    live.loadLandingQr()
    live.startPolling()
  }
})

onBeforeUnmount(() => {
  live.stopPolling()
})

function barPercent(count: number): string {
  const max = Math.max(...(summary.value?.careerDistribution.map((c) => c.count) || [0]), 1)
  return Math.round((count / max) * 100) + '%'
}

async function start() {
  loading.value = true
  try {
    // 词库已在 store 缓存，无需强制重新拉取
    await store.loadCareers()
    store.clearSelection()
    // 两条路径统一先录入身份：大屏每次开始都重新登记（防止上一人身份残留）；
    // 手机端已登记过则直接进入
    if (isMobile() && identity.identity) {
      router.push('/select')
    } else {
      router.push({ name: 'signin', query: { next: '/select' } })
    }
  } finally {
    loading.value = false
  }
}

function goFavorites() {
  router.push('/favorites')
}
</script>

<style scoped>
.home-page {
  padding: clamp(28px, 5vh, 72px) clamp(32px, 6vw, 100px);
  gap: clamp(32px, 4.5vh, 64px);
}

/* 顶部 */
.home-head {
  text-align: center;
  padding-top: clamp(6px, 1.2vh, 20px);
}

.home-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(124, 154, 184, 0.30);
  background: rgba(124, 154, 184, 0.08);
  font-size: var(--fs-caption);
  letter-spacing: 2px;
  color: var(--text-secondary);
}

.tag-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-primary);
  box-shadow: 0 0 8px rgba(124, 154, 184, 0.45);
}

.home-title {
  margin-top: clamp(14px, 2.2vh, 26px);
  font-size: var(--fs-display);
  font-weight: 800;
  letter-spacing: 6px;
  line-height: 1.1;
}

.home-subtitle {
  margin-top: clamp(12px, 1.8vh, 22px);
  font-size: var(--fs-body);
  color: var(--text-secondary);
  letter-spacing: 1px;
}

/* 步骤条 */
.home-steps {
  margin: clamp(12px, 2vh, 28px) auto 0;
  max-width: 760px;
  padding: clamp(14px, 2vh, 24px) clamp(20px, 2.6vw, 40px);
  background: var(--bg-panel);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
}

.home-steps :deep(.ant-steps-item-title) {
  font-size: 13px;
  color: var(--text-secondary);
}

/* 职业卡片网格 */
.home-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: clamp(8px, 1.4vh, 20px);
}

.home-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(20px, 2.8vw, 44px);
}

.career-card {
  position: relative;
  padding: clamp(20px, 3vh, 44px) clamp(18px, 2.4vw, 36px);
  text-align: center;
  border-top: 2px solid var(--career-color);
  border-radius: var(--radius-lg);
  background: var(--bg-panel);
  backdrop-filter: blur(12px);
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.3s var(--ease-in-out),
    box-shadow 0.3s var(--ease-in-out),
    border-color 0.3s var(--ease-in-out),
    background 0.3s var(--ease-in-out);
  outline: none;
  animation: cardFloatIn 0.6s var(--ease-out) both;
}

.career-card:hover,
.career-card:focus-visible {
  transform: translateY(-6px);
  box-shadow:
    0 12px 32px rgba(124, 154, 184, 0.18),
    0 0 0 1px var(--career-color);
  background: var(--bg-panel-strong);
  border-color: var(--career-color);
}

/* 插画顶部淡入 */
.career-illust {
  position: absolute;
  inset: 0 0 auto 0;
  height: clamp(96px, 13vh, 190px);
  overflow: hidden;
  pointer-events: none;
}

.career-illust img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 22%;
  transition: transform 0.5s var(--ease-out);
}

.career-card:hover .career-illust img {
  transform: scale(1.06);
}

.career-illust .illust-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--career-color) 30%, transparent),
    transparent 60%
  );
}

.career-card-body {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: clamp(110px, 14vh, 210px);
  gap: clamp(10px, 1.4vh, 20px);
}

.career-name {
  font-size: clamp(18px, 1.9vw, 30px);
  font-weight: var(--fw-bold);
  letter-spacing: 2px;
  color: var(--text-primary);
}

.career-color-tag {
  margin: 0;
  font-weight: 500;
  letter-spacing: 1px;
}

.career-slogan {
  font-size: clamp(13px, 1.15vw, 18px);
  color: var(--text-secondary);
  letter-spacing: 0.5px;
  line-height: 1.6;
  margin-top: clamp(4px, 0.6vh, 10px);
}

/* 底部 */
.home-footer {
  text-align: center;
  padding-bottom: clamp(20px, 3vh, 36px);
  margin-top: clamp(8px, 1.4vh, 20px);
}

.home-footer :deep(.ant-btn-lg) {
  height: clamp(44px, 4.6vh, 64px);
  padding: 0 clamp(28px, 3.5vw, 56px);
  font-size: clamp(16px, 1.6vw, 22px);
  border-radius: var(--radius-pill);
  letter-spacing: 1px;
}

.home-tip {
  margin-top: clamp(20px, 3vh, 36px);
  font-size: 12px;
  color: var(--text-tertiary);
  letter-spacing: 1px;
  padding-top: clamp(12px, 1.8vh, 20px);
  border-top: 1px solid var(--border-subtle);
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

/* 大屏实时区 */
.home-live {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(20px, 3vw, 48px);
  padding: clamp(14px, 2vh, 22px) clamp(24px, 4vw, 64px);
  background: var(--bg-panel);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
  margin-top: clamp(8px, 1.4vh, 20px);
}

.live-qr {
  text-align: center;
  flex-shrink: 0;
}

.live-qr-img {
  width: clamp(120px, 10vw, 170px);
  height: clamp(120px, 10vw, 170px);
  display: block;
  background: #fff;
  border-radius: 10px;
  padding: 8px;
  box-shadow: 0 6px 20px rgba(124, 154, 184, 0.20);
}

.live-qr-caption {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-tertiary);
  letter-spacing: 2px;
}

.live-info {
  text-align: left;
  max-width: 560px;
}

.live-progress-suffix {
  font-size: clamp(16px, 1.6vw, 22px);
  color: var(--text-secondary);
  font-weight: 400;
  margin-left: 6px;
}

.live-encourage {
  margin-top: clamp(8px, 1.2vh, 14px);
  font-size: clamp(14px, 1.3vw, 18px);
  color: var(--text-secondary);
  letter-spacing: 1px;
  line-height: 1.7;
}

.live-idle-title {
  margin: 0;
  font-size: clamp(18px, 1.8vw, 26px);
  font-weight: 700;
  letter-spacing: 2px;
}

.live-idle-sub {
  margin-top: clamp(8px, 1.2vh, 14px);
  font-size: clamp(13px, 1.2vw, 16px);
  color: var(--text-secondary);
  letter-spacing: 0.5px;
  line-height: 1.7;
}

/* 活动结束汇总 */
.summary-wrap {
  width: 100%;
  text-align: center;
}

.summary-head {
  margin-bottom: clamp(12px, 1.8vh, 20px);
}

.summary-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 4px 14px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(124, 154, 184, 0.30);
  background: rgba(124, 154, 184, 0.08);
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--text-secondary);
}

.summary-title {
  margin-top: clamp(10px, 1.6vh, 16px);
  font-size: clamp(20px, 2.2vw, 32px);
  font-weight: 800;
  letter-spacing: 3px;
}

.summary-stats {
  display: flex;
  justify-content: center;
  gap: clamp(28px, 6vw, 96px);
  margin-bottom: clamp(14px, 2vh, 24px);
}

.summary-chart {
  max-width: 620px;
  margin: 0 auto;
  text-align: left;
}

.summary-chart-title {
  font-size: 13px;
  color: var(--text-tertiary);
  letter-spacing: 3px;
  margin-bottom: var(--space-3);
  text-align: center;
}

.summary-bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.summary-bar-name {
  width: 96px;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  text-align: right;
}

.summary-bar-track {
  flex: 1;
  height: 12px;
  border-radius: 999px;
  background: rgba(124, 154, 184, 0.10);
  overflow: hidden;
}

.summary-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--brand-primary), var(--brand-primary-hover));
  transition: width 0.6s var(--ease-out);
}

.summary-bar-count {
  width: 56px;
  flex-shrink: 0;
  font-size: 13px;
  color: var(--text-secondary);
  font-feature-settings: 'tnum';
}

/* 手机端落地页：隐藏大屏实时区与职业卡片，突出开始按钮 */
@media (max-width: 768px) {
  .home-live {
    display: none;
  }
  .home-section {
    display: none;
  }
  .home-page {
    padding: 24px 16px;
    gap: 24px;
  }
  .home-steps {
    padding: 12px 10px;
  }
  .home-footer :deep(.ant-btn-lg) {
    width: 100%;
  }
}
</style>

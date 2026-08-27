<template>
  <ScreenFrame>
    <template v-if="store.matchResult">
      <ParticleCanvas :color="careerColor" :active="true" />
      <!-- 揭晓插画背景 -->
      <div v-if="careerIllustration(first.careerId)" class="reveal-bg" :style="{ '--career-color': careerColor }">
        <img :src="careerIllustration(first.careerId)" :alt="careerName" />
        <div class="reveal-bg-mask" />
      </div>
      <!-- 中心光爆 -->
      <div class="burst-glow" :style="{ background: careerColor }" />

      <div class="screen-page reveal-page">
        <a-steps
          class="reveal-steps fade-in"
          :current="2"
          size="small"
          :items="stepItems"
        />

        <div class="reveal-inner fade-in">
          <div class="reveal-tag" :style="{ color: careerColor, borderColor: careerColor }">
            <span class="tag-dot" />
            你的职业画像已生成
          </div>

          <section class="reveal-career">
            <CareerAvatar
              :id="first.careerId"
              :name="careerName"
              :color="careerColor"
              size="xl"
              shape="rounded"
              class="reveal-avatar"
            />
            <h1 class="reveal-name" :style="{ color: careerColor }">
              {{ careerName }}
            </h1>
            <div class="reveal-meta">
              <a-tag
                :color="careerColor"
                bordered
                :style="{ color: textOnColor(careerColor) }"
              >
                {{ matchMeta.colorName }}
              </a-tag>
              <span class="reveal-slogan">“{{ first.slogan }}”</span>
            </div>

            <a-statistic
              class="reveal-stat"
              title="匹配度"
              :value="first.matchRate"
              :value-style="{ color: careerColor, fontSize: 'clamp(64px, 7vw, 112px)', fontWeight: 800 }"
              :suffix="`%`"
              :title-style="{ color: 'rgba(0, 0, 0, 0.55)', fontSize: '14px', letterSpacing: '4px' }"
            />
          </section>

          <a-alert
            v-if="store.matchResult.tie"
            :message="`并列双适配：${tieNames}`"
            type="warning"
            show-icon
            class="reveal-alert"
          />

          <div class="reveal-second">
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

          <div class="reveal-actions">
            <a-button size="large" class="btn-primary-glow" type="primary" @click="goProfile">
              <template #icon><user-outlined /></template>
              查看职业画像
            </a-button>
            <a-button size="large" ghost @click="restart">
              <template #icon><reload-outlined /></template>
              重新测试
            </a-button>
          </div>

          <div class="reveal-tip">
            <info-circle-outlined />
            {{ store.matchResult.disclaimer }}
          </div>
        </div>
      </div>
    </template>
  </ScreenFrame>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  InfoCircleOutlined,
  ReloadOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import ScreenFrame from '@/components/ScreenFrame.vue'
import ParticleCanvas from '@/components/ParticleCanvas.vue'
import CareerAvatar from '@/components/CareerAvatar.vue'
import { careerIllustration } from '@/utils/illustration'
import { textOnColor } from '@/utils/color'
import { useTestStore } from '@/stores/test'

const store = useTestStore()
const router = useRouter()

const first = computed(() => store.matchResult!.first)
const second = computed(() => store.matchResult!.second)
const careerName = computed(() => first.value.name)
const careerColor = computed(() => first.value.colorCode)
const matchMeta = computed(() => store.matchResult!.first)
const tieNames = computed(() => {
  if (!store.matchResult) return ''
  return store.matchResult.tieCareerIds
    .map((id) => store.careerById(id)?.name || '')
    .filter(Boolean)
    .join('、')
})

const stepItems = [
  { title: '勾选特质' },
  { title: '匹配职业' },
  { title: '揭晓画像' },
  { title: '扫码保存' }
]

onMounted(() => {
  if (!store.matchResult) router.replace('/select')
})

function goProfile() {
  router.push('/profile')
}

function restart() {
  store.clearSelection()
  router.replace('/')
}
</script>

<style scoped>
.reveal-page {
  padding: clamp(20px, 3.6vh, 48px) clamp(20px, 4.6vw, 80px);
  gap: clamp(10px, 1.4vh, 20px);
  align-items: center;
  justify-content: center;
  text-align: center;
}

.reveal-steps {
  max-width: 720px;
  margin: 0 auto;
  padding: clamp(10px, 1.4vh, 16px) clamp(16px, 2vw, 32px);
  background: var(--bg-panel);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
}

.reveal-steps :deep(.ant-steps-item-title) {
  font-size: 13px;
  color: var(--text-secondary);
}

/* 揭晓插画背景 */
.reveal-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.reveal-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  opacity: 0.18;
  filter: blur(3px) saturate(1.1);
  animation: bgZoom 1.2s var(--ease-out) both;
}

@keyframes bgZoom {
  from {
    transform: scale(1.15);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 0.18;
  }
}

.reveal-bg-mask {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at center, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.85) 75%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.92));
}

/* 中心彩色光爆 */
.burst-glow {
  position: absolute;
  left: 50%;
  top: 50%;
  width: clamp(200px, 28vw, 460px);
  height: clamp(200px, 28vw, 460px);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: burstGlow 1.1s var(--ease-out) both;
  pointer-events: none;
  opacity: 0.22;
  filter: blur(20px);
}

/* 内容层 */
.reveal-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(12px, 1.6vh, 22px);
  animation: floatUp 0.6s var(--ease-in-out) both;
  max-width: 720px;
}

.reveal-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: clamp(5px, 0.7vh, 10px) clamp(16px, 2vw, 32px);
  border: 1px solid;
  border-radius: var(--radius-pill);
  font-size: 13px;
  letter-spacing: 4px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  box-shadow: var(--shadow-sm);
}

.tag-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
}

.reveal-career {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
}

.reveal-avatar {
  animation: pulseGlow 2s ease-in-out infinite;
}

.reveal-name {
  font-size: var(--fs-display);
  font-weight: var(--fw-heavy);
  letter-spacing: clamp(4px, 0.6vw, 12px);
  margin: 0;
  line-height: 1.1;
  animation: cardLight 0.8s var(--ease-in-out) both;
}

.reveal-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: clamp(13px, 1.2vw, 17px);
  color: var(--text-secondary);
  letter-spacing: 1px;
}

.reveal-slogan {
  font-style: italic;
  opacity: 0.85;
}

.reveal-stat {
  margin-top: clamp(8px, 1.2vh, 16px);
  text-align: center;
}

.reveal-stat :deep(.ant-statistic-content) {
  font-feature-settings: 'tnum';
  letter-spacing: 1px;
}

.reveal-alert {
  max-width: 480px;
}

.reveal-second {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  padding: clamp(6px, 0.8vh, 10px) clamp(14px, 1.6vw, 22px);
  border-radius: var(--radius-pill);
  background: var(--bg-panel);
  border: 1px solid var(--border-default);
  font-size: 14px;
  color: var(--text-secondary);
}

.second-label {
  letter-spacing: 2px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.second-tag {
  font-weight: var(--fw-semibold);
  letter-spacing: 1px;
}

.second-rate {
  font-weight: var(--fw-bold);
  font-feature-settings: 'tnum';
  color: var(--text-primary);
}

.reveal-actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  justify-content: center;
  margin-top: clamp(8px, 1.2vh, 14px);
}

.reveal-actions :deep(.ant-btn-lg) {
  height: clamp(44px, 4.6vh, 60px);
  padding: 0 clamp(28px, 3.4vw, 52px);
  font-size: clamp(15px, 1.4vw, 20px);
  border-radius: var(--radius-pill);
  letter-spacing: 1px;
}

.reveal-tip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 12px;
  color: var(--text-tertiary);
  letter-spacing: 1px;
  margin-top: clamp(4px, 0.6vh, 10px);
}
</style>
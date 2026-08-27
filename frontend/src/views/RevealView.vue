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
        <div class="reveal-inner fade-in">
          <div class="reveal-tag" :style="{ color: careerColor, borderColor: careerColor }">
            你的职业画像已生成
          </div>

          <div class="reveal-career">
            <div
              class="reveal-icon"
              :style="{ background: careerColor, boxShadow: `0 0 60px ${careerColor}88` }"
            >
              <img v-if="careerIllustration(first.careerId)" :src="careerIllustration(first.careerId)" :alt="careerName" />
              <template v-else>{{ careerName.charAt(0) }}</template>
            </div>
            <h1 class="reveal-name" :style="{ color: careerColor }">{{ careerName }}</h1>
            <div class="reveal-rate">
              匹配度 <b>{{ first.matchRate }}%</b>
            </div>
            <div class="reveal-slogan">{{ first.slogan }}</div>
          </div>

          <a-alert
            v-if="store.matchResult.tie"
            :message="`并列双适配：${tieNames}`"
            type="warning"
            show-icon
            class="reveal-alert"
          />

          <div class="reveal-second">
            你可能也适合：<b :style="{ color: second.colorCode }">{{ second.name }}</b>
          </div>

          <div class="reveal-actions">
            <a-button size="large" class="btn-primary-glow" type="primary" @click="goProfile">
              查看我的职业画像
            </a-button>
            <a-button size="large" @click="restart">重新测试</a-button>
          </div>
          <div class="reveal-tip">{{ store.matchResult.disclaimer }}</div>
        </div>
      </div>
    </template>
  </ScreenFrame>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ScreenFrame from '@/components/ScreenFrame.vue'
import ParticleCanvas from '@/components/ParticleCanvas.vue'
import { careerIllustration } from '@/utils/illustration'
import { useTestStore } from '@/stores/test'

const store = useTestStore()
const router = useRouter()

const first = computed(() => store.matchResult!.first)
const second = computed(() => store.matchResult!.second)
const careerName = computed(() => first.value.name)
const careerColor = computed(() => first.value.colorCode)
const tieNames = computed(() => {
  if (!store.matchResult) return ''
  return store.matchResult.tieCareerIds
    .map((id) => store.careerById(id)?.name || '')
    .join('、')
})

onMounted(() => {
  // 直接刷新/直达揭晓页时无匹配结果，回到选词页
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
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* 揭晓插画背景：职业色渐变遮罩 + 暗化，突出前景 */
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
  opacity: 0.5;
  animation: bgZoom 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes bgZoom {
  from {
    transform: scale(1.15);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 0.5;
  }
}

.reveal-bg-mask {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at center, rgba(11, 18, 32, 0.25) 0%, rgba(11, 18, 32, 0.78) 70%),
    linear-gradient(180deg, rgba(11, 18, 32, 0.5), rgba(11, 18, 32, 0.82));
}

/* 中心光爆（配合 ParticleCanvas 的光爆） */
.burst-glow {
  position: absolute;
  left: 50%;
  top: 50%;
  width: clamp(160px, 24vw, 420px);
  height: clamp(160px, 24vw, 420px);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: burstGlow 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
  pointer-events: none;
  opacity: 0.32;
}

.reveal-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: floatUp 0.6s cubic-bezier(0.645, 0.045, 0.355, 1) both;
}

.reveal-tag {
  display: inline-block;
  padding: clamp(5px, 0.7vh, 10px) clamp(16px, 2vw, 32px);
  border: 1px solid;
  border-radius: 999px;
  font-size: clamp(14px, 1.4vw, 20px);
  letter-spacing: 4px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
}

.reveal-career {
  margin-top: clamp(20px, 3.4vh, 44px);
}

.reveal-icon {
  width: clamp(120px, 13vw, 240px);
  height: clamp(68px, 7.4vw, 136px);
  border-radius: clamp(18px, 2vw, 28px);
  margin: 0 auto clamp(14px, 2.2vh, 30px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(32px, 3.2vw, 60px);
  font-weight: 700;
  color: #fff;
  overflow: hidden;
  animation: pulseGlow 2s ease-in-out infinite;
}

.reveal-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
}

.reveal-name {
  font-size: clamp(44px, 5.2vw, 88px);
  font-weight: 800;
  letter-spacing: clamp(4px, 0.6vw, 12px);
  margin: 0;
  animation: cardLight 0.8s cubic-bezier(0.645, 0.045, 0.355, 1) both;
}

.reveal-rate {
  font-size: clamp(16px, 1.5vw, 24px);
  color: rgba(255, 255, 255, 0.8);
  margin-top: clamp(10px, 1.8vh, 22px);
}

.reveal-rate b {
  font-size: clamp(22px, 2.2vw, 34px);
}

.reveal-slogan {
  font-size: clamp(15px, 1.4vw, 22px);
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 2px;
  margin-top: clamp(6px, 1vh, 14px);
}

.reveal-alert {
  margin-top: clamp(12px, 2.2vh, 28px);
  width: clamp(380px, 32vw, 580px);
}

.reveal-second {
  margin-top: clamp(10px, 1.8vh, 22px);
  font-size: clamp(15px, 1.4vw, 20px);
  color: rgba(255, 255, 255, 0.7);
}

.reveal-actions {
  margin-top: clamp(22px, 4vh, 48px);
}

.reveal-actions :deep(.ant-btn-lg) {
  height: clamp(42px, 4.4vh, 60px);
  padding: 0 clamp(26px, 3.2vw, 50px);
  font-size: clamp(16px, 1.5vw, 22px);
  border-radius: 28px;
}

.reveal-tip {
  margin-top: clamp(10px, 1.8vh, 22px);
  font-size: clamp(12px, 0.95vw, 15px);
  color: rgba(255, 255, 255, 0.4);
}
</style>

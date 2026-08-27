<template>
  <ScreenFrame>
    <ParticleCanvas :color="careerColor" :active="true" />
    <div class="screen-page reveal-page">
      <div class="reveal-inner fade-in">
        <div class="reveal-tag" :style="{ color: careerColor, borderColor: careerColor }">
          你的职业画像已生成
        </div>

        <template v-if="store.matchResult">
          <div class="reveal-career">
            <div
              class="reveal-icon"
              :style="{ background: careerColor, boxShadow: `0 0 60px ${careerColor}88` }"
            >
              {{ careerName.charAt(0) }}
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
        </template>
      </div>
    </div>
  </ScreenFrame>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import ScreenFrame from '@/components/ScreenFrame.vue'
import ParticleCanvas from '@/components/ParticleCanvas.vue'
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

.reveal-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: floatUp 0.6s cubic-bezier(0.645, 0.045, 0.355, 1) both;
}

.reveal-tag {
  display: inline-block;
  padding: 8px 28px;
  border: 1px solid;
  border-radius: 999px;
  font-size: 18px;
  letter-spacing: 4px;
  background: rgba(255, 255, 255, 0.05);
}

.reveal-career {
  margin-top: 34px;
}

.reveal-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52px;
  font-weight: 700;
  color: #fff;
  animation: pulseGlow 2s ease-in-out infinite;
}

.reveal-name {
  font-size: 72px;
  font-weight: 800;
  letter-spacing: 10px;
  margin: 0;
  animation: cardLight 0.8s cubic-bezier(0.645, 0.045, 0.355, 1) both;
}

.reveal-rate {
  font-size: 22px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 18px;
}

.reveal-rate b {
  font-size: 30px;
}

.reveal-slogan {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 2px;
  margin-top: 10px;
}

.reveal-alert {
  margin-top: 24px;
  width: 520px;
}

.reveal-second {
  margin-top: 18px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
}

.reveal-actions {
  margin-top: 40px;
}

.reveal-actions :deep(.ant-btn-lg) {
  height: 56px;
  padding: 0 44px;
  font-size: 20px;
  border-radius: 28px;
}

.reveal-tip {
  margin-top: 18px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
}
</style>

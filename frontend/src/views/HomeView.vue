<template>
  <ScreenFrame>
    <div class="screen-page">
      <div class="home-head fade-in">
        <div class="home-badge">法学院迎新特别活动</div>
        <h1 class="screen-title glow-text">五彩法途 · 筑梦未来</h1>
        <p class="screen-subtitle">75 个特质词 · 5 大法律职业方向 · 找到你的职业画像</p>
      </div>

      <div class="home-cards">
        <a-spin v-if="!store.careers.length" />
        <div
          v-for="(career, index) in store.careers"
          :key="career.id"
          class="career-card glass-panel fade-in"
          :style="{
            animationDelay: `${0.1 + index * 0.08}s`,
            '--career-color': career.colorCode
          }"
          @click="start"
        >
          <div class="career-illust" v-if="careerIllustration(career.id)">
            <img :src="careerIllustration(career.id)" :alt="career.name" loading="lazy" />
            <div class="illust-mask" :style="{ background: career.colorCode }" />
          </div>
          <div class="career-icon" :style="{ background: career.colorCode }">
            {{ career.name.charAt(0) }}
          </div>
          <div class="career-name">{{ career.name }}</div>
          <div class="career-color">{{ career.colorName }}</div>
          <div class="career-slogan">{{ career.slogan }}</div>
        </div>
      </div>

      <div class="home-footer fade-in">
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
        <div class="home-tip">本测试为兴趣初步画像，仅供参考</div>
      </div>
    </div>
  </ScreenFrame>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { RocketOutlined } from '@ant-design/icons-vue'
import ScreenFrame from '@/components/ScreenFrame.vue'
import { careerIllustration } from '@/utils/illustration'
import { useTestStore } from '@/stores/test'

const store = useTestStore()
const router = useRouter()
const loading = ref(false)

onMounted(() => {
  store.loadCareers().catch(() => undefined)
})

async function start() {
  loading.value = true
  try {
    await store.loadCareers(true)
    store.clearSelection()
    router.push('/select')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.home-head {
  text-align: center;
  padding-top: clamp(16px, 3.5vh, 48px);
}

.home-badge {
  display: inline-block;
  padding: clamp(4px, 0.6vh, 8px) clamp(12px, 1.6vw, 26px);
  border-radius: 999px;
  border: 1px solid rgba(122, 184, 255, 0.5);
  color: rgba(255, 255, 255, 0.75);
  font-size: clamp(13px, 1.3vw, 20px);
  letter-spacing: 3px;
  margin-bottom: clamp(10px, 1.8vh, 24px);
  background: rgba(22, 119, 255, 0.12);
}

.home-cards {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(12px, 1.8vw, 32px);
  align-content: center;
  padding: clamp(12px, 2.5vh, 32px) 0;
}

.career-card {
  position: relative;
  padding: clamp(14px, 2.2vw, 34px) clamp(12px, 1.6vw, 26px);
  text-align: center;
  border-top: 3px solid var(--career-color);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.career-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px var(--career-color) 22;
  border-color: var(--career-color);
}

/* 插画：卡片顶部渐显，hover 放大提亮 */
.career-illust {
  position: absolute;
  inset: 0 0 auto 0;
  height: clamp(72px, 10.5vh, 160px);
  overflow: hidden;
  transition: height 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
  pointer-events: none;
}

.career-card:hover .career-illust {
  height: clamp(96px, 14.5vh, 220px);
}

.career-illust img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 22%;
  display: block;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.career-card:hover .career-illust img {
  transform: scale(1.06);
}

.career-illust .illust-mask {
  position: absolute;
  inset: 0;
  opacity: 0.35;
  mix-blend-mode: color;
  transition: opacity 0.3s;
}

.career-card:hover .career-illust .illust-mask {
  opacity: 0.2;
}

.career-icon {
  position: relative;
  width: clamp(52px, 5.4vw, 96px);
  height: clamp(52px, 5.4vw, 96px);
  border-radius: 50%;
  margin: clamp(78px, 11.5vh, 170px) auto clamp(10px, 1.6vh, 22px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(24px, 2.6vw, 44px);
  font-weight: 700;
  color: #fff;
  box-shadow: 0 0 28px var(--career-color) 66;
}

.career-name {
  font-size: clamp(18px, 1.9vw, 30px);
  font-weight: 700;
}

.career-color {
  font-size: clamp(12px, 1vw, 16px);
  color: rgba(255, 255, 255, 0.55);
  margin-top: 4px;
}

.career-slogan {
  font-size: clamp(13px, 1.15vw, 18px);
  color: rgba(255, 255, 255, 0.75);
  margin-top: clamp(8px, 1.2vh, 18px);
  letter-spacing: 1px;
}

.home-footer {
  text-align: center;
  padding-bottom: clamp(14px, 2.6vh, 36px);
}

.home-footer :deep(.ant-btn-lg) {
  height: clamp(44px, 4.6vh, 68px);
  padding: 0 clamp(32px, 4vw, 68px);
  font-size: clamp(18px, 1.7vw, 26px);
  border-radius: 32px;
}

.home-tip {
  margin-top: clamp(8px, 1.4vh, 20px);
  font-size: clamp(12px, 0.9vw, 15px);
  color: rgba(255, 255, 255, 0.4);
}
</style>

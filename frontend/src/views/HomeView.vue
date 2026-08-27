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
        >
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
  padding-top: 36px;
}

.home-badge {
  display: inline-block;
  padding: 6px 22px;
  border-radius: 999px;
  border: 1px solid rgba(122, 184, 255, 0.5);
  color: rgba(255, 255, 255, 0.75);
  font-size: 18px;
  letter-spacing: 3px;
  margin-bottom: 20px;
  background: rgba(22, 119, 255, 0.12);
}

.home-cards {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 28px;
  align-content: center;
  padding: 24px 0;
}

.career-card {
  padding: 30px 22px;
  text-align: center;
  border-top: 3px solid var(--career-color);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.career-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px var(--career-color) 22;
  border-color: var(--career-color);
}

.career-icon {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 0 28px var(--career-color) 66;
}

.career-name {
  font-size: 26px;
  font-weight: 700;
}

.career-color {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 4px;
}

.career-slogan {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 14px;
  letter-spacing: 1px;
}

.home-footer {
  text-align: center;
  padding-bottom: 28px;
}

.home-footer :deep(.ant-btn-lg) {
  height: 64px;
  padding: 0 64px;
  font-size: 24px;
  border-radius: 32px;
}

.home-tip {
  margin-top: 16px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
}
</style>

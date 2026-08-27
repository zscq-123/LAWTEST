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
          75 个特质词 · 5 大法律职业方向 · 3 分钟生成专属职业画像
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

      <!-- 职业卡片 -->
      <section class="home-section">
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
              <a-tag :color="career.colorCode" class="career-color-tag" bordered>
                {{ career.colorName }}
              </a-tag>
              <div class="career-slogan">“{{ career.slogan }}”</div>
            </div>
          </article>
        </div>
      </section>

      <!-- 底部操作 -->
      <footer class="home-footer fade-in">
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
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { RocketOutlined, StarOutlined } from '@ant-design/icons-vue'
import ScreenFrame from '@/components/ScreenFrame.vue'
import CareerAvatar from '@/components/CareerAvatar.vue'
import { careerIllustration } from '@/utils/illustration'
import { useTestStore } from '@/stores/test'

const store = useTestStore()
const router = useRouter()
const loading = ref(false)

const stepItems = [
  { title: '勾选特质' },
  { title: '匹配职业' },
  { title: '揭晓画像' },
  { title: '扫码保存' }
]

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

function goFavorites() {
  router.push('/favorites')
}
</script>

<style scoped>
.home-page {
  padding: clamp(20px, 3.6vh, 56px) clamp(20px, 4.6vw, 80px);
  gap: clamp(12px, 1.6vh, 22px);
}

/* 顶部 */
.home-head {
  text-align: center;
  padding-top: clamp(8px, 1.4vh, 24px);
}

.home-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(22, 119, 255, 0.3);
  background: rgba(22, 119, 255, 0.06);
  font-size: var(--fs-caption);
  letter-spacing: 2px;
  color: var(--text-secondary);
}

.tag-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1677ff;
  box-shadow: 0 0 8px rgba(22, 119, 255, 0.35);
}

.home-title {
  margin-top: clamp(10px, 1.6vh, 18px);
  font-size: var(--fs-display);
  font-weight: 800;
  letter-spacing: 6px;
  line-height: 1.1;
}

.home-subtitle {
  margin-top: var(--space-3);
  font-size: var(--fs-body);
  color: var(--text-secondary);
  letter-spacing: 1px;
}

/* 步骤条 */
.home-steps {
  margin: clamp(4px, 0.8vh, 10px) auto 0;
  max-width: 720px;
  padding: clamp(10px, 1.4vh, 16px) clamp(16px, 2vw, 32px);
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
}

.home-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(12px, 1.6vw, 26px);
}

.career-card {
  position: relative;
  padding: clamp(14px, 2.2vw, 30px) clamp(12px, 1.6vw, 22px);
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
    0 12px 32px rgba(15, 23, 42, 0.12),
    0 0 0 1px var(--career-color);
  background: var(--bg-panel-strong);
  border-color: var(--career-color);
}

/* 插画顶部淡入 */
.career-illust {
  position: absolute;
  inset: 0 0 auto 0;
  height: clamp(80px, 11vh, 170px);
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
  padding-top: clamp(90px, 12vh, 180px);
  gap: clamp(6px, 0.8vh, 12px);
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
  line-height: 1.5;
}

/* 底部 */
.home-footer {
  text-align: center;
  padding-bottom: clamp(20px, 3vh, 32px);
}

.home-footer :deep(.ant-btn-lg) {
  height: clamp(44px, 4.6vh, 64px);
  padding: 0 clamp(28px, 3.5vw, 56px);
  font-size: clamp(16px, 1.6vw, 22px);
  border-radius: var(--radius-pill);
  letter-spacing: 1px;
}

.home-tip {
  margin-top: var(--space-3);
  font-size: 12px;
  color: var(--text-tertiary);
  letter-spacing: 1px;
}
</style>
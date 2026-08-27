<template>
  <ScreenFrame>
    <div class="screen-page matching-page">
      <a-steps
        class="matching-steps fade-in"
        :current="1"
        size="small"
        :items="stepItems"
      />

      <header class="matching-head fade-in">
        <h1 class="screen-title shine-title">正在为你匹配职业方向…</h1>
        <p class="screen-subtitle">五色能量柱正在竞速 · 你的特质正在汇聚成答案</p>
      </header>

      <section class="matching-body">
        <a-result
          v-if="error"
          status="warning"
          title="匹配失败，请重试"
          sub-title="网络异常或服务暂时不可达，请稍后再试"
        >
          <template #extra>
            <a-space>
              <a-button size="large" @click="router.push('/select')">
                <template #icon><arrow-left-outlined /></template>
                返回重选
              </a-button>
              <a-button size="large" type="primary" class="btn-primary-glow" @click="run">
                重试
              </a-button>
            </a-space>
          </template>
        </a-result>

        <MatchRace v-else-if="scoresReady" :careers="store.careers" :scores="scores" />

        <div v-else class="matching-loading">
          <a-spin size="large" />
          <span class="loading-text">匹配算法运行中…</span>
        </div>
      </section>

      <footer v-if="!error" class="matching-foot fade-in">
        <span class="foot-hint">
          {{ store.matchResult?.disclaimer || '' }}
        </span>
      </footer>
    </div>
  </ScreenFrame>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import ScreenFrame from '@/components/ScreenFrame.vue'
import MatchRace from '@/components/MatchRace.vue'
import { postMatching } from '@/api'
import { useTestStore } from '@/stores/test'

const store = useTestStore()
const router = useRouter()
const scores = ref<Record<string, number>>({})
const scoresReady = ref(false)
const error = ref(false)
let timer: number | undefined

const stepItems = [
  { title: '勾选特质' },
  { title: '匹配职业' },
  { title: '揭晓画像' },
  { title: '扫码保存' }
]

async function run() {
  error.value = false
  scoresReady.value = false
  if (!store.selectedIds.length) {
    router.replace('/select')
    return
  }
  try {
    const result = await postMatching(store.selectedIds)
    store.setMatch(result)
    scores.value = result.scores
    scoresReady.value = true
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      router.replace('/reveal')
    }, 3400)
  } catch {
    error.value = true
  }
}

onMounted(() => {
  run()
})

onBeforeUnmount(() => {
  window.clearTimeout(timer)
})
</script>

<style scoped>
.matching-page {
  padding: clamp(20px, 3.6vh, 48px) clamp(20px, 4.6vw, 80px);
  gap: clamp(12px, 1.6vh, 24px);
  align-items: stretch;
}

.matching-steps {
  max-width: 720px;
  margin: 0 auto;
  padding: clamp(10px, 1.4vh, 16px) clamp(16px, 2vw, 32px);
  background: var(--bg-panel);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.matching-steps :deep(.ant-steps-item-title) {
  font-size: 13px;
  color: var(--text-secondary);
}

.matching-head {
  text-align: center;
  margin-top: clamp(8px, 1.2vh, 16px);
  flex-shrink: 0;
}

.matching-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: clamp(260px, 42vh, 520px);
}

.matching-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  color: var(--text-tertiary);
  font-size: 14px;
  letter-spacing: 2px;
}

.loading-text {
  letter-spacing: 2px;
}

.matching-foot {
  text-align: center;
  font-size: 12px;
  color: var(--text-tertiary);
  letter-spacing: 1px;
  flex-shrink: 0;
}
</style>
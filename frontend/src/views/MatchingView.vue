<template>
  <ScreenFrame>
    <div class="screen-page matching-page">
      <h1 class="screen-title matching-title">正在为你匹配职业方向…</h1>
      <p class="screen-subtitle">五色能量柱正在竞速，你的特质正在汇聚成答案</p>

      <div v-if="error" class="matching-error">
        <a-result status="warning" title="匹配失败，请重试">
          <template #extra>
            <a-space>
              <a-button size="large" @click="router.push('/select')">返回重新选择</a-button>
              <a-button size="large" type="primary" @click="run">重试</a-button>
            </a-space>
          </template>
        </a-result>
      </div>

      <div v-else class="matching-race">
        <MatchRace v-if="scoresReady" :careers="store.careers" :scores="scores" />
        <a-spin v-else size="large" />
      </div>

      <div class="matching-tip">{{ store.matchResult?.disclaimer || '' }}</div>
    </div>
  </ScreenFrame>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
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
  align-items: center;
  justify-content: center;
}

.matching-title {
  text-align: center;
}

.matching-race {
  width: 100%;
  margin-top: clamp(16px, 3.5vh, 48px);
  display: flex;
  justify-content: center;
  min-height: clamp(260px, 42vh, 520px);
  align-items: center;
}

.matching-tip {
  margin-top: clamp(12px, 2.5vh, 32px);
  font-size: clamp(12px, 1vw, 16px);
  color: rgba(255, 255, 255, 0.45);
}

.matching-error {
  margin-top: 40px;
}
</style>

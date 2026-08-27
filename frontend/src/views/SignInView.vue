<template>
  <ScreenFrame>
    <div class="screen-page signin-page">
      <div class="signin-card fade-in">
        <header class="signin-head">
          <div class="signin-tag">
            <span class="tag-dot" />
            参与登记
          </div>
          <h1 class="signin-title">测试前先登记一下</h1>
          <p class="signin-subtitle">填写姓名与学号即可开始 · 同一学号只计入一次</p>
        </header>

        <a-form layout="vertical" class="signin-form" @submit.prevent="submit">
          <a-form-item label="姓名">
            <a-input
              v-model:value="name"
              size="large"
              placeholder="请输入姓名"
              maxlength="20"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="学号">
            <a-input
              v-model:value="studentNo"
              size="large"
              placeholder="请输入学号"
              maxlength="20"
              allow-clear
            />
          </a-form-item>
          <a-button
            type="primary"
            size="large"
            block
            class="signin-submit"
            :loading="loading"
            html-type="submit"
          >
            开始测试
          </a-button>
        </a-form>

        <!-- 已参加过：引导查看报告或继续测试（不重复计数） -->
        <div v-if="alreadyParticipated" class="signin-rejoin">
          <a-alert type="info" show-icon :message="rejoinMessage" class="signin-alert" />
          <a-space :size="10" wrap class="rejoin-actions">
            <a-button v-if="reportCode" type="primary" size="large" @click="goReport">
              <template #icon><file-text-outlined /></template>
              查看我的报告
            </a-button>
            <a-button size="large" @click="continueTest">继续测试（不重复计数）</a-button>
          </a-space>
        </div>

        <div class="signin-tip">信息仅用于活动现场统计去重，不会在大屏公开展示</div>
      </div>
    </div>
  </ScreenFrame>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { FileTextOutlined } from '@ant-design/icons-vue'
import ScreenFrame from '@/components/ScreenFrame.vue'
import { useIdentityStore } from '@/stores/identity'
import { isMobile } from '@/utils/device'

const identity = useIdentityStore()
const route = useRoute()
const router = useRouter()

const name = ref('')
const studentNo = ref('')
const loading = ref(false)
const alreadyParticipated = ref(false)
const reportCode = ref<string | null>(null)

const rejoinMessage = computed(() =>
  reportCode.value
    ? '你已参加过本次测试，可直接查看报告，或继续测试（不重复计数）'
    : '你已参加过本次测试，继续测试不会重复计数'
)

function nextPath(): string {
  return typeof route.query.next === 'string' ? route.query.next : '/select'
}

async function submit() {
  const n = name.value.trim()
  const s = studentNo.value.trim()
  if (!n) {
    message.warning('请输入姓名')
    return
  }
  if (!s) {
    message.warning('请输入学号')
    return
  }
  loading.value = true
  try {
    const p = await identity.signIn(n, s, isMobile() ? 'mobile' : 'screen')
    alreadyParticipated.value = p.alreadyParticipated
    reportCode.value = p.reportCode || null
    if (!p.alreadyParticipated) {
      router.replace(nextPath())
    }
    // 已参加过：停留本页展示「查看报告 / 继续测试」
  } catch {
    // 错误提示已由 axios 拦截器统一弹出
  } finally {
    loading.value = false
  }
}

function goReport() {
  if (reportCode.value) router.replace('/report/' + reportCode.value)
}

function continueTest() {
  router.replace(nextPath())
}
</script>

<style scoped>
.signin-page {
  align-items: center;
  justify-content: center;
  padding: clamp(24px, 5vh, 64px) clamp(20px, 6vw, 80px);
}

.signin-card {
  width: 100%;
  max-width: 480px;
  padding: clamp(28px, 4vh, 48px) clamp(24px, 3vw, 40px);
  background: var(--bg-panel);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-sm);
  text-align: center;
}

.signin-head {
  margin-bottom: clamp(20px, 3vh, 32px);
}

.signin-tag {
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

.tag-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-primary);
  box-shadow: 0 0 8px rgba(124, 154, 184, 0.45);
}

.signin-title {
  margin-top: clamp(14px, 2.4vh, 22px);
  font-size: var(--fs-display);
  font-weight: 800;
  letter-spacing: 4px;
  line-height: 1.2;
}

.signin-subtitle {
  margin-top: clamp(8px, 1.4vh, 14px);
  font-size: var(--fs-body);
  color: var(--text-secondary);
  letter-spacing: 1px;
}

.signin-form {
  text-align: left;
}

.signin-form :deep(.ant-form-item-label label) {
  font-size: 14px;
  color: var(--text-secondary);
  letter-spacing: 1px;
}

.signin-form :deep(.ant-input-lg) {
  height: clamp(44px, 5vh, 54px);
  border-radius: var(--radius-md);
}

.signin-submit {
  height: clamp(46px, 5.4vh, 58px);
  font-size: clamp(15px, 1.4vw, 18px);
  border-radius: var(--radius-pill);
  letter-spacing: 2px;
  margin-top: var(--space-2);
}

.signin-rejoin {
  margin-top: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.signin-alert {
  text-align: left;
}

.rejoin-actions {
  justify-content: center;
}

.rejoin-actions :deep(.ant-btn-lg) {
  border-radius: var(--radius-pill);
  font-weight: 600;
}

.signin-tip {
  margin-top: clamp(18px, 2.6vh, 28px);
  font-size: 12px;
  color: var(--text-tertiary);
  letter-spacing: 1px;
}
</style>

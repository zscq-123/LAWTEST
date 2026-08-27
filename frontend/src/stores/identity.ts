import { reactive, ref } from 'vue'
import { registerParticipant } from '@/api'
import type { Participant } from '@/types'

const IDENTITY_KEY = 'lawtest_identity'

/** 当前参与者身份（会话级持久化，刷新不丢失） */
const identity = ref<Participant | null>(JSON.parse(sessionStorage.getItem(IDENTITY_KEY) || 'null'))

function persist() {
  sessionStorage.setItem(IDENTITY_KEY, JSON.stringify(identity.value))
}

/** 是否已登记身份（路由守卫使用，避免实例化 store） */
export function hasIdentity(): boolean {
  return !!identity.value
}

/** 登记身份：学号已存在且姓名一致时返回 alreadyParticipated=true（不重复计数） */
async function signIn(name: string, studentNo: string, source: 'screen' | 'mobile' = 'mobile') {
  const p = await registerParticipant({ name, studentNo, source })
  identity.value = p
  persist()
  return p
}

function signOut() {
  identity.value = null
  sessionStorage.removeItem(IDENTITY_KEY)
}

export function useIdentityStore() {
  return reactive({
    identity,
    signIn,
    signOut
  })
}

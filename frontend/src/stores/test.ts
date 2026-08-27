import { computed, reactive, ref } from 'vue'
import { getCareers } from '@/api'
import type { Career, MatchResult, Report } from '@/types'

const SELECTED_KEY = 'lawtest_selected'
const REPORT_KEY = 'lawtest_report'

/** 当前选中的特质词ID（会话级持久化，防止刷新丢失） */
const selectedIds = ref<number[]>(JSON.parse(sessionStorage.getItem(SELECTED_KEY) || '[]'))

/** 匹配结果（大屏流程共享） */
const matchResult = ref<MatchResult | null>(null)

/** 生成的报告（大屏流程共享） */
const report = ref<Report | null>(JSON.parse(sessionStorage.getItem(REPORT_KEY) || 'null'))

/** 职业词库缓存 */
const careers = ref<Career[]>([])

const selectedCount = computed(() => selectedIds.value.length)

function persist() {
  sessionStorage.setItem(SELECTED_KEY, JSON.stringify(selectedIds.value))
}

function persistReport() {
  sessionStorage.setItem(REPORT_KEY, JSON.stringify(report.value))
}

async function loadCareers(force = false) {
  if (careers.value.length && !force) return careers.value
  careers.value = await getCareers()
  return careers.value
}

function toggleKeyword(id: number): boolean {
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) {
    selectedIds.value.splice(idx, 1)
    persist()
    return true
  }
  if (selectedIds.value.length >= 10) {
    return false
  }
  selectedIds.value.push(id)
  persist()
  return true
}

function clearSelection() {
  selectedIds.value = []
  matchResult.value = null
  report.value = null
  sessionStorage.removeItem(SELECTED_KEY)
  sessionStorage.removeItem(REPORT_KEY)
}

function setMatch(result: MatchResult) {
  matchResult.value = result
}

function setReport(value: Report) {
  report.value = value
  persistReport()
}

function clearReport() {
  report.value = null
  sessionStorage.removeItem(REPORT_KEY)
}

function careerById(id: number): Career | undefined {
  return careers.value.find((c) => c.id === id)
}

export function useTestStore() {
  return reactive({
    selectedIds,
    matchResult,
    report,
    careers,
    selectedCount,
    loadCareers,
    toggleKeyword,
    clearSelection,
    setMatch,
    setReport,
    clearReport,
    careerById
  })
}

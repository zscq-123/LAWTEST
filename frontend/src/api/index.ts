import http from './http'
import type { AiAnalysisVO, Career, MatchResult, Mentor, Report, StatsSummary } from '@/types'

/** 获取职业与词库 */
export function getCareers() {
  return http.get<Career[]>('/careers')
}

/** 提交勾选词，获取匹配结果 */
export function postMatching(keywordIds: number[]) {
  return http.post<MatchResult>('/matching', { keywordIds })
}

/** 生成报告（含二维码） */
export function createReport(keywordIds: number[]) {
  return http.post<Report>('/report', { keywordIds })
}

/** 按编号查询报告 */
export function getReport(code: string) {
  return http.get<Report>(`/report/${code}`)
}

/** 获取职业导师列表 */
export function getMentors(careerId: number) {
  return http.get<Mentor[]>('/mentors', { params: { careerId } })
}

/** 保存测试记录 */
export function saveTestRecord(keywordIds: number[]) {
  return http.post('/test-records', { keywordIds })
}

/** 统计汇总 */
export function getStatsSummary() {
  return http.get<StatsSummary>('/stats/summary')
}

/** AI 深度分析：按报告编号生成（已缓存则直接返回）；大模型响应较慢，超时放宽到 120s */
export function aiAnalyze(code: string) {
  return http.post<AiAnalysisVO>('/ai/analyze', { code }, { timeout: 120000 })
}

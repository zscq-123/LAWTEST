import http from './http'
import type { AiAnalysisVO, Career, LandingQr, LiveOverview, MatchResult, Mentor, Participant, Report, StatsSummary } from '@/types'

/** 获取职业与词库 */
export function getCareers() {
  return http.get<Career[]>('/careers')
}

/** 提交勾选词，获取匹配结果 */
export function postMatching(keywordIds: number[]) {
  return http.post<MatchResult>('/matching', { keywordIds })
}

/** 生成报告（含二维码），可选携带学号关联参与者（用于人数去重） */
export function createReport(keywordIds: number[], studentNo?: string) {
  return http.post<Report>('/report', { keywordIds, studentNo })
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

/** 登记身份（学号去重；已登记且姓名一致 → alreadyParticipated=true） */
export function registerParticipant(data: { name: string; studentNo: string; source?: string }) {
  return http.post<Participant>('/participants/register', data)
}

/** 大屏实时概览（3s 轮询） */
export function getLiveOverview() {
  return http.get<LiveOverview>('/live/overview')
}

/** 手机端心跳（答题页每 30s 调用，保持活跃） */
export function sendHeartbeat(studentNo: string) {
  return http.post('/live/heartbeat', { studentNo })
}

/** 落地二维码（扫码进入手机端测试） */
export function getLandingQr() {
  return http.get<LandingQr>('/live/landing-qr')
}

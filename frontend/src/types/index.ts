/** 特质词 */
export interface Keyword {
  id: number
  word: string
  core: boolean
}

/** 职业（含词库） */
export interface Career {
  id: number
  name: string
  colorName: string
  colorCode: string
  slogan: string
  sortOrder: number
  keywords?: Keyword[]
}

/** 职业得分与匹配度 */
export interface CareerScore {
  careerId: number
  name: string
  colorName: string
  colorCode: string
  slogan: string
  score: number
  matchRate: number
}

/** 匹配结果 */
export interface MatchResult {
  keywordIds: number[]
  scores: Record<string, number>
  first: CareerScore
  second: CareerScore
  tie: boolean
  tieCareerIds: number[]
  tip: string | null
  disclaimer: string
}

/** 职业画像 */
export interface Profile {
  slogan: string
  strengths: string[]
  improvements: string[]
}

/** 身体素质要求 */
export interface FitnessRequirement {
  id: number
  careerId: number
  seq: number
  content: string
}

/** 四年锻炼计划 */
export interface FitnessPlan {
  id: number
  careerId: number
  yearStage: string
  content: string
}

/** 实务导师 */
export interface Mentor {
  id: number
  careerId: number
  name: string
  title: string
  contact: string
  bookingUrl: string
  bio?: string
  message?: string
}

/** 完整报告 */
export interface Report {
  code: string
  createdAt?: string
  qrUrl: string
  qrImage: string
  match: MatchResult
  career: Career
  profile: Profile
  aiAnalysis?: AiAnalysisVO | null
  fitnessRequirements: FitnessRequirement[]
  fitnessPlans: FitnessPlan[]
  mentors: Mentor[]
}

/** 统计汇总 */
export interface StatsSummary {
  totalParticipants: number
  careerDistribution: Array<{ careerId: number; name: string; count: number }>
  topKeywords: Array<{ keywordId: number; word: string; count: number }>
}

/** AI 深度分析结果 */
export interface AiAnalysisVO {
  summary: string
  strengths: string[]
  improvements: string[]
  plans: string[]
  motto: string
  disclaimer: string
}

/** 参与者登记结果（学号去重） */
export interface Participant {
  id: number
  name: string
  studentNo: string
  source: string
  status: string
  /** 学号已登记过（同一人再次登记） */
  alreadyParticipated: boolean
  /** 已完成时的报告编号（可直接跳转） */
  reportCode: string | null
}

/** 大屏实时概览（3s 轮询） */
export interface LiveOverview {
  /** 已完成人数（学号去重） */
  finishedCount: number
  /** 目标人数 */
  targetCount: number
  /** 手机端活跃答题人数 */
  activeMobileCount: number
}

/** 落地二维码（扫码进入手机端测试） */
export interface LandingQr {
  url: string
  image: string
}

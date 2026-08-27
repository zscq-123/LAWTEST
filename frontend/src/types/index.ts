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

/** 雷达图五维能力轴（通用） */
export const RADAR_AXES = ['逻辑思辨', '沟通协作', '抗压执行', '严谨细致', '创新适应']

/** 各职业能力偏移（index 对应 RADAR_AXES） */
const CAREER_OFFSET: Record<number, number[]> = {
  1: [18, 14, 10, 6, 4], // 律师
  2: [12, 4, 6, 18, 4], // 法官
  3: [8, 4, 18, 10, 6], // 检察官
  4: [8, 10, 6, 16, 6], // 企业法务
  5: [12, 6, 6, 8, 20] // AI伦理合规顾问
}

/** 依据匹配度与职业生成五维能力值（0-100） */
export function radarValues(careerId: number, matchRate: number): number[] {
  const offsets = CAREER_OFFSET[careerId] || [6, 6, 6, 6, 6]
  const base = 34 + matchRate * 0.55
  return offsets.map((o) => Math.max(8, Math.min(100, Math.round(base + o))))
}

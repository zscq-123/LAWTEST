/**
 * 职业 → 插画资源映射
 * 插画由 MiniMax image-01 生成（docs/插画提示词.md），存放于 frontend/public/illustrations/
 */
const ILLUSTRATION_MAP: Record<number, string> = {
  1: '/illustrations/lawyer.png', // 律师 皓月白
  2: '/illustrations/judge.png', // 法官 苍穹蓝
  3: '/illustrations/prosecutor.png', // 检察官 中国红
  4: '/illustrations/legal.png', // 企业法务 琉璃紫
  5: '/illustrations/ai-ethics.png', // AI伦理合规顾问 科创青
  6: '/illustrations/research.png' // 法学研究 黛青
}

/** 按职业ID取插画地址；未知职业返回空字符串 */
export function careerIllustration(id?: number): string {
  if (id == null) return ''
  return ILLUSTRATION_MAP[id] || ''
}

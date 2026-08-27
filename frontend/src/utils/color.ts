/**
 * 颜色工具：根据背景色亮度返回可读文字色（WCAG 相对亮度）
 * 深色背景 → 白字；浅色背景 → 蓝灰深字
 */

/** 按 WCAG 相对亮度阈值选择前景色：亮背景用蓝灰深字，暗背景用白字 */
export function textOnColor(hex: string): string {
  const h = hex.replace('#', '')
  const v = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  const r = (v >> 16) & 255
  const g = (v >> 8) & 255
  const b = v & 255
  const lum = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255)
  return lum > 0.55 ? 'rgba(52, 64, 84, 0.92)' : '#ffffff'
}

/** 颜色是否偏亮（用于判断是否需要加深边框等） */
export function isLightColor(hex: string): boolean {
  return textOnColor(hex).startsWith('rgba(52, 64, 84')
}

/**
 * 设备模式识别：大屏（讲台触屏）或手机端（扫码进入）
 * 判定优先级：URL 参数 > 移动端 UA
 * - 大屏部署建议打开 /?screen=1（兜底：无参数时按 UA，非手机 UA 视为大屏）
 * - 落地二维码指向 /?from=mobile，扫码自动进入手机模式
 */
type DeviceKind = 'screen' | 'mobile'

const DEVICE_KEY = 'lawtest_device'

export function resolveDevice(): DeviceKind {
  const cached = sessionStorage.getItem(DEVICE_KEY)
  if (cached === 'screen' || cached === 'mobile') return cached

  const params = new URLSearchParams(window.location.search)
  let kind: DeviceKind
  if (params.get('screen') === '1') kind = 'screen'
  else if (params.get('from') === 'mobile') kind = 'mobile'
  else kind = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ? 'mobile' : 'screen'

  sessionStorage.setItem(DEVICE_KEY, kind)
  return kind
}

/** 是否大屏端 */
export function isBigScreen(): boolean {
  return resolveDevice() === 'screen'
}

/** 是否手机端 */
export function isMobile(): boolean {
  return resolveDevice() === 'mobile'
}

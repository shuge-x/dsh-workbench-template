/** 展示格式化 */
export function fmtMoney(v: number, digits = 2): string {
  return '¥' + v.toLocaleString('zh-CN', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

export function fmtNum(v: number): string {
  return v.toLocaleString('zh-CN')
}

/** 指标值:带"量/数"的取整,金额两位小数 */
export function fmtMetric(label: string, v: number): string {
  return /量$|数$|单$/.test(label) || v >= 1000 && Number.isInteger(v) ? fmtNum(v) : fmtMoney(v)
}

/** 混合值:数字 → ¥ 金额,字符串原样(兜底数据里已格式化) */
export function fmtValue(v: string | number): string {
  return typeof v === 'number' ? fmtMoney(v) : v
}

export const fmtPct = (v: number): string => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`

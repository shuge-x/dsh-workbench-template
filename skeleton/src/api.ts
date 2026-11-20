/** 数据服务客户端:同源 /wb-api/*(Host 半区经 webServer 挂在 dsh 主服务上,零 CORS、复用壳鉴权)。 */
export const BASE = '/wb-api'

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`)
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export interface RegionSummaryRow { region: string; orders: number; amount: number }
export const fetchRegionSummary = () => get<RegionSummaryRow[]>('/region-summary')

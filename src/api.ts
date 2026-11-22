/** 数据服务客户端:同源 /wbt-api/*(Host 半区经 webServer 挂在 dsh 主服务上,零 CORS、复用壳鉴权)。 */
export const BASE = '/wbt-api'

export interface ApiScaffoldResult {
  ok?: boolean
  error?: string
  target?: string
  name?: string
  id?: string
  officialDocs?: string
  files?: string[]
  nextSteps?: string[]
}

export async function post<T>(path: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export const postScaffold = (payload: { target: string; name: string; id: string }) =>
  post<ApiScaffoldResult>('/scaffold', payload)

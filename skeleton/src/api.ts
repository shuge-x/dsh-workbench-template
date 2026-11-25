/**
 * 数据服务客户端:同源 /wb-api/*(Host 半区经 webServer 挂在 dsh 主服务上,零 CORS、复用壳鉴权)。
 *
 * 四态靠状态码区分:401 / 403 → 无权限;0(服务不可达)与其余非 2xx → 错误。所以请求失败时**不要**折成 null。
 */
export const BASE = '/wb-api'

/** 请求失败。status 是 HTTP 状态码;0 表示网络层失败(服务不可达)。 */
export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** 页面判定「无权限」的依据:被壳鉴权或数据服务拒绝。 */
export const isForbidden = (error: unknown): boolean => error instanceof ApiError && (error.status === 401 || error.status === 403)

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

async function send(method: Method, path: string, body: unknown, signal?: AbortSignal): Promise<Response> {
  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if (signal?.aborted) throw error // 主动中止原样抛出,由调用方处理
    throw new ApiError(0, '数据服务不可达(Host 半区未激活或网络异常)')
  }
  if (!res.ok) {
    const text = await res.text()
    let message = `请求失败(HTTP ${res.status})`
    try {
      const parsed = JSON.parse(text) as { error?: unknown }
      if (typeof parsed.error === 'string') message = parsed.error
    } catch { /* 响应体不是 JSON:用默认文案 */ }
    throw new ApiError(res.status, message)
  }
  return res
}

/** 发请求:返回解析后的 JSON;失败抛 ApiError。 */
export async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const res = await send(method, path, body)
  const text = await res.text()
  return (text === '' ? undefined : JSON.parse(text)) as T
}

export const get = <T>(path: string) => request<T>('GET', path)
export const post = <T>(path: string, body?: unknown) => request<T>('POST', path, body)
export const put = <T>(path: string, body?: unknown) => request<T>('PUT', path, body)
export const patch = <T>(path: string, body?: unknown) => request<T>('PATCH', path, body)
export const del = <T>(path: string) => request<T>('DELETE', path)

/** 发起流式(SSE)请求,返回原始 Response 供页面读流;失败抛 ApiError。 */
export const postStream = (path: string, body?: unknown, signal?: AbortSignal): Promise<Response> => send('POST', path, body, signal)

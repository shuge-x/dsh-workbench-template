/**
 * 【示例·状态页】加载 / 空态 / 错误 / 无权限——最容易被忘掉、最影响观感的四种状态。
 * 抄范式:骨架屏(wb-loading)/ 空态给下一步动作 / 错误带重试 / 权限明确提示。
 * 真实页面里,这四种态由数据获取的 loading/error 分支渲染,不是独立页面。
 */
import { useEffect, useState, type ReactNode } from 'react'

type Sim = 'loading' | 'empty' | 'error' | 'denied' | 'ready'

export function StatesPage(): ReactNode {
  const [sim, setSim] = useState<Sim>('loading')

  // 演示:切到 loading 时 1.6s 后自动落到 ready,模拟一次真实取数
  useEffect(() => {
    if (sim !== 'loading') return
    const t = window.setTimeout(() => setSim('ready'), 1600)
    return () => window.clearTimeout(t)
  }, [sim])

  const card = (title: string, body: ReactNode): ReactNode => (
    <div className="wb-card" style={{ minHeight: 190 }}>
      <div className="wb-sub" style={{ marginBottom: 12 }}>{title}</div>
      {body}
    </div>
  )

  return (
    <div className="wb-page">
      <div className="wb-topbar">
        <div>
          <div className="wb-title">页面四态</div>
          <div className="wb-sub">示例:任何取数页面都应备齐这四种态,再谈美化</div>
        </div>
        <div className="wb-row" style={{ marginLeft: 'auto' }}>
          {(['loading', 'empty', 'error', 'denied', 'ready'] as Sim[]).map(s => (
            <button key={s} className={'wb-chip' + (sim === s ? ' on' : '')} onClick={() => setSim(s)}>
              {{ loading: '加载', empty: '空态', error: '错误', denied: '无权限', ready: '就绪' }[s]}
            </button>
          ))}
        </div>
      </div>
      <div className="wb-body">
        <div className="wb-grid2">
          {card('加载中 — 骨架屏优于转圈(布局不跳动)', (
            <div className="wb-loading">
              <i style={{ width: '40%' }} /><i style={{ width: '85%' }} /><i style={{ width: '70%' }} /><i style={{ width: '55%' }} />
            </div>
          ))}
          {card('空态 — 告诉用户下一步做什么', (
            <div className="wb-empty">
              <div>本期还没有导入经营数据</div>
              <button className="wb-btn primary" onClick={() => setSim('loading')}>去导入</button>
            </div>
          ))}
          {card('错误 — 说清谁失败、能做什么', (
            <div className="wb-empty">
              <div className="wb-error">✗ 数据服务 /wb-api/overview 无响应</div>
              <button className="wb-btn ghost" onClick={() => setSim('loading')}>重试</button>
            </div>
          ))}
          {card('无权限 — 明确而非空白', (
            <div className="wb-empty">
              <div>当前账号没有查看区域数据的权限</div>
              <span className="wb-sub">请联系工作台管理员开通</span>
            </div>
          ))}
        </div>
        {sim === 'ready' && (
          <div className="wb-card" style={{ marginTop: 14 }}>
            <div className="wb-row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600 }}>数据就绪</div>
                <div className="wb-sub" style={{ marginTop: 4 }}>loading → ready 的分支切换就是真实页面的取数状态机。</div>
              </div>
              <span className="wb-pill ok">1.6s 模拟完成</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

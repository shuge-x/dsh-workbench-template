/**
 * 本地化命名空间(机制示范:ctx.locale 体系)。zh 与 en 为基线,键需一致。
 * 消费方式:client.tsx 经 inject face 下发 ctx.locale.bind(NS) 的 t 函数;页面用 t('key') 取词。
 */
export const NS_HOME = 'workbenchHome'

export const dicts = {
  [NS_HOME]: {
    zh: {
      homeTitle: '首页',
      homeSub: '骨架起步页 — 按领域替换内容;下面的区块演示真数据接线与四态,替换成你的业务',
      secData: '区域汇总(真数据:GET /wb-api/region-summary)',
      thRegion: '区域',
      thOrders: '订单量',
      thAmount: '金额',
      errOffline: '✗ 数据服务无响应(Host 未启动或 /wb-api/region-summary 不可达)',
      retry: '重试',
      emptyData: '暂无数据 — 首启造数可能未完成,重启 Host 后重试',
      note: '范式:页面范式照「示例·工作台」源码抄(src/examples/,渲染效果把 src/client.tsx 的 SHOW_EXAMPLES 置 true 即可看到);红线与工作流见 AGENTS.md 与 docs/EXAMPLES.md。',
    },
    en: {
      homeTitle: 'Home',
      homeSub: 'Starter page — replace with your domain; the block below demonstrates real data wiring and the four states',
      secData: 'Region summary (real data: GET /wb-api/region-summary)',
      thRegion: 'Region',
      thOrders: 'Orders',
      thAmount: 'Amount',
      errOffline: '✗ Data service unreachable (host not running or /wb-api/region-summary down)',
      retry: 'Retry',
      emptyData: 'No data yet — first-run seeding may be incomplete; restart the host and retry',
      note: 'Pattern: copy page patterns from src/examples/ (set SHOW_EXAMPLES=true in src/client.tsx to see them rendered); see AGENTS.md and docs/EXAMPLES.md for red lines and workflow.',
    },
  },
}

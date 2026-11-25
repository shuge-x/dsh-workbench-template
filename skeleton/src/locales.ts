/**
 * 本地化命名空间(机制示范:ctx.locale 体系)。zh 与 en 为基线,键需一致。
 * 消费方式:client.tsx 经 inject face 下发 ctx.locale.bind(NS) 的 t 函数;页面用 t('key') 取词。
 * 固件不预置页面,所以这里只留一个示例键;业务文案在开发时按页追加
 * (默认策略 3:先做 zh,en 需要时再补,两边键必须一致)。
 */
export const NS_HOME = 'workbenchHome'

export const dicts = {
  [NS_HOME]: {
    zh: { retry: '重试' },
    en: { retry: 'Retry' },
  },
}

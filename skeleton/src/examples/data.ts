/**
 * 示例数据:纯前端 mock,不 fetch 任何业务路由。
 * —— 删除示例区时这里一并消失,主代码零残留。
 */

export const overview = {
  kpis: [
    { label: '实收金额', value: '¥28,638', delta: -0.515, note: '较上期' },
    { label: '订单量', value: '2,532', delta: -0.487, note: '较上期' },
    { label: '客单价', value: '¥11.31', delta: -0.055, note: '较上期' },
    { label: '毛利率', value: '47.1%', delta: 0.031, note: '较上期' },
  ],
  trend: {
    months: ['4月', '5月', '6月', '7月', '8月', '9月'],
    current: [58200, 51400, 46800, 39600, 28600, 28638],
    last: [52900, 49800, 45200, 43100, 30500, 59100],
  },
  signals: [
    { no: '01', head: '销售实收较上月 -51.5%,杯量 -53.6% 是优先核验项。', detail: '按杯量拆解缺口,逐日定位下降时段与渠道,下一周期复盘恢复幅度。', tone: 'err' },
    { no: '02', head: '毛利率回升 +3.1%,物料单价管控初见成效。', detail: '把本期调价 SKU 固化为标准成本,纳入月度盘点基线。', tone: 'ok' },
  ] as { no: string; head: string; detail: string; tone: 'ok' | 'err' }[],
}

export const roster = [
  { id: 'WB-1001', name: '鼎元学府店', region: '华东大区', owner: '陈晓', status: 'ongoing', label: '进行中', amount: 28638 },
  { id: 'WB-1002', name: '兰桥刘集店', region: '华东大区', owner: '李晗', status: 'done', label: '已完成', amount: 41220 },
  { id: 'WB-1003', name: '金沙天街店', region: '西南大区', owner: '王珂', status: 'warning', label: '待确认', amount: 19800 },
  { id: 'WB-1004', name: '望江新路店', region: '西南大区', owner: '赵一鸣', status: 'error', label: '执行失败', amount: 0 },
  { id: 'WB-1005', name: '高新天府店', region: '西南大区', owner: '孙悦', status: 'idle', label: '空闲', amount: 22450 },
  { id: 'WB-1006', name: '滨海金鼎店', region: '华北大区', owner: '周航', status: 'done', label: '已完成', amount: 35980 },
]

export const detail = {
  title: 'WB-1002 · 兰桥刘集店',
  chips: ['营业中', '直营', '样本门店'],
  kv: [
    ['门店编号', 'WB-1002'], ['所属大区', '华东大区'], ['城市', '蚌埠'],
    ['开业日期', '2024-10-01'], ['运营专员', '李晗'], ['数据覆盖', '2024-10 至 2026-10'],
  ] as [string, string][],
  costs: [
    { label: '物料成本', value: '¥4,120', share: 0.34 },
    { label: '人工成本', value: '¥3,650', share: 0.3 },
    { label: '房租水电', value: '¥2,480', share: 0.2 },
    { label: '其他费用', value: '¥1,930', share: 0.16 },
  ],
}

export const chart = {
  periods: ['近6月', '近12月', '近24月'],
  lines: {
    months: ['4月', '5月', '6月', '7月', '8月', '9月'],
    series: [
      { name: '本期', color: '#22301f', data: [58200, 51400, 46800, 39600, 28600, 28638] },
      { name: '去年同月', color: '#c07a2b', data: [52900, 49800, 45200, 43100, 30500, 59100] },
    ],
  },
  bars: [
    { label: '物料', value: 4120 }, { label: '人工', value: 3650 }, { label: '房租', value: 2480 },
    { label: '水电', value: 930 }, { label: '其他', value: 1000 },
  ],
}

export const form = {
  stores: ['鼎元学府店', '兰桥刘集店', '金沙天街店', '望江新路店'],
  metrics: ['实收金额', '订单量', '杯量', '客单价'],
}

/** 地图页 mock:虚构区域的抽象轮廓(0..800×0..560 viewBox 内的多边形)。
 *  真实地理版(中国 GeoJSON + Web Mercator)见样板项目 dsh-workbench-sample 的经营地图。 */
export const mapData = {
  regions: [
    { id: 'r1', name: '华东区', value: 58200, stores: 24, yoy: 0.126,
      path: 'M120,80 L260,60 L340,110 L320,190 L230,220 L150,190 L110,140 Z' },
    { id: 'r2', name: '华北区', value: 41300, stores: 16, yoy: -0.048,
      path: 'M360,50 L490,40 L560,90 L540,160 L440,180 L370,150 Z' },
    { id: 'r3', name: '西南区', value: 22450, stores: 9, yoy: 0.231,
      path: 'M140,260 L250,240 L310,300 L280,380 L180,400 L120,340 Z' },
    { id: 'r4', name: '华南区', value: 35980, stores: 13, yoy: 0.087,
      path: 'M340,240 L450,220 L510,280 L480,370 L380,390 L330,320 Z' },
    { id: 'r5', name: '华中区', value: 28638, stores: 11, yoy: -0.123,
      path: 'M530,200 L640,190 L700,250 L670,330 L570,340 L520,280 Z' },
    { id: 'r6', name: '东北区', value: 19800, stores: 6, yoy: 0.052,
      path: 'M600,60 L700,50 L760,110 L730,190 L630,200 L590,120 Z' },
    { id: 'r7', name: '西北区', value: 12400, stores: 4, yoy: 0.314,
      path: 'M330,430 L450,410 L520,470 L480,530 L370,540 L310,490 Z' },
  ] as { id: string; name: string; value: number; stores: number; yoy: number; path: string }[],
  /** 门店散点:用真实的 Web Mercator 公式投影(经纬度是虚构的) */
  stores: [
    { name: '示范店 A', lon: 121.4, lat: 31.2, region: '华东区' },
    { name: '示范店 B', lon: 116.4, lat: 39.9, region: '华北区' },
    { name: '示范店 C', lon: 104.1, lat: 30.6, region: '西南区' },
    { name: '示范店 D', lon: 113.2, lat: 23.1, region: '华南区' },
    { name: '示范店 E', lon: 114.3, lat: 30.5, region: '华中区' },
  ] as { name: string; lon: number; lat: number; region: string }[],
}

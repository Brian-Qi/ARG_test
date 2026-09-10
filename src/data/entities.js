// 实体索引：网里的"人物 / 地点 / 神祇"聚合点。
// 每个实体会聚合所有提到它的碎片（由 fragments.js 的 entities 字段反向建立）。
const ENTITIES = [
  { id: 'wanhe', name: '万和号', type: '商号', note: '杭州城南绸布南北货商号。民国十六年至二十一年在账。' },
  { id: 'houjian', name: '后间', type: '地点', note: '万和号店铺后的一间房。多笔订单的目的地，门从里面锁。' },
  { id: 'beigaofeng', name: '北高峰', type: '地点', note: '山门外有一处施食台，碑额残损。' },
  { id: 'shen-huai-ren', name: '沈怀仁', type: '人物', alias: ['沈砚秋'], note: '万和号老板。1927 年后改名"沈砚秋"，一直活到当代。' },
  { id: 'shen-wan', name: '沈晚', type: '人物', note: '沈怀仁名义养女。族谱只留一个名字。' },
  { id: 'five-children', name: '五个孩子', type: '人物', note: '1927 年以收养名义收下的五个孩子。账上只剩"米、药、衣、灯、人"。' },
  { id: 'bi-gan', name: '比干', type: '财神', note: '东路。文财神，剖心而死，民间取其"无心故无私"。' },
  { id: 'chai-rong', name: '柴荣', type: '财神', note: '南路。少年贩茶，后为帝，民间奉为南路财神。' },
  { id: 'guan-gong', name: '关公', type: '财神', note: '西路。武财神，挂印封金、忠信立业。' },
  { id: 'zhao-gong-ming', name: '赵公明', type: '财神', note: '北路。黑面浓须、骑黑虎，玄坛真君，司财。' },
  { id: 'wang-hai', name: '王亥', type: '财神', note: '中路。华商始祖，服牛驯马、负贩四方。' }
]

export default ENTITIES

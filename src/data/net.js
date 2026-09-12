// 网：把 refs 里的 id 统一解析成"碎片"或"文章"，供各页渲染交叉引用。
import FRAGMENTS from './fragments'
import JOURNAL from './journal'

// 线索分级：一级=主线，二级=解谜素材，三级=隐藏（检索才现），四级=干扰项
export const LEVELS = {
  // 一级 · 主线核心
  ledger: 1, 'zero-page': 1, 'order-stub': 1, 'shishitai-rubbing': 1, 'five-gods': 1,
  recording: 1, 'family-tree': 1, 'photo-three': 1, zhaiyuan: 1, 'finale-ledger': 1,
  // 二级 · 解谜素材
  menwai: 2, suanpan: 2, 'hongao-shouyin': 2, huashu: 2, dianleng: 2, 'wuxin-lamp': 2,
  huiwen: 2, zhouyi: 2, shouni: 2, corrections: 2,
  koushu: 2, menpai: 2, houjian: 2,
  // 三级 · 隐藏（检索才现）
  obituary: 3, 'staff-shen': 3, guestbook: 3, fortuneslip: 3, 'ledger-errata': 3, yaozha: 3, fenyu: 3,
  // 四级 · 干扰项
  nianhua: 4, noticemid: 4, donation: 4
}

// 文章（馆刊）默认一级
export function levelOf(id) {
  return LEVELS[id] || 1
}

export function resolveRef(id) {
  const f = FRAGMENTS.find(x => x.id === id)
  if (f) return { kind: 'frag', id, title: f.title, to: '/f/' + id, tag: f.tag, locked: !!f.requires, level: levelOf(id) }
  const a = JOURNAL.find(x => x.id === id)
  if (a) return { kind: 'article', id, title: a.title, to: '/journal/' + id, tag: '研究辑录 · ' + a.author, level: levelOf(id) }
  return null
}

export function resolveRefs(list = []) {
  return list.map(resolveRef).filter(Boolean)
}

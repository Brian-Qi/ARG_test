import { reactive, watch } from 'vue'

// 主线章节顺序（一条穿到底）
// 1 取签 / 2 订单 / 3 旧账 / 4 五路 / 5 录音 / 6 旧影 / 7 结账
const CHAPTERS = [
  { n: 1, key: 'sign', title: '第六格', route: '/story' },
  { n: 2, key: 'orders', title: '无人签收', route: '/orders' },
  { n: 3, key: 'archive', title: '五个零', route: '/archive' },
  { n: 4, key: 'roads', title: '门不是路', route: '/roads' },
  { n: 5, key: 'audio', title: '不要数到六', route: '/audio' },
  { n: 6, key: 'portrait', title: '五张脸', route: '/portrait' },
  { n: 7, key: 'finale', title: '后间', route: '/finale' }
]

// 需持久化的字段（白名单；scare 等瞬时状态不入盘）
const PERSIST_KEYS = ['wish', 'signed', 'ordersOpened', 'archiveOpen', 'roadSolved', 'audioSolved', 'portraitSolved', 'ending', 'softRead', 'activeChapter', 'shortcuts', 'pagesRead', 'keys', 'read']
const K_STATE = 'cx_game'
const K_SEEN = 'cx_seen_hidden'   // 统一新键（localStorage）

function snapshot() {
  const o = {}
  PERSIST_KEYS.forEach(k => (o[k] = state[k]))
  return o
}

function restore() {
  const raw = localStorage.getItem(K_STATE)
  if (!raw) return
  try {
    const o = JSON.parse(raw)
    PERSIST_KEYS.forEach(k => { if (k in o) state[k] = o[k] })
  } catch (e) { /* 损坏则忽略，保持初始态 */ }
}

const state = reactive({
  wish: '',
  signed: false,        // 1 取签
  ordersOpened: false,  // 2 订单
  archiveOpen: false,   // 3 旧账
  roadSolved: false,    // 4 五路
  audioSolved: false,   // 5 录音
  portraitSolved: false,// 6 旧影
  ending: null,         // 7 结账（also stored as endingType）

  softRead: {},         // 已读的软支线情报点 { id: true }
  activeChapter: 1,     // 当前主线章节（1 起）
  scare: null,
  shortcuts: 0,
  pagesRead: 0,
  keys: {},             // 已获得的钥匙 { keyId: true }（碎片网解锁用）
  read: {}              // 已调阅的碎片 { fragId: true }（隐藏碎片的揭示）
})

// 从 sessionStorage 迁移 seenHidden 到 localStorage 统一键
function migrateSeenHidden() {
  if (localStorage.getItem(K_SEEN)) return
  const old = sessionStorage.getItem(K_SEEN)
  if (old) {
    localStorage.setItem(K_SEEN, old)
    sessionStorage.removeItem(K_SEEN)
  }
}
migrateSeenHidden()
restore()

// 深度 watch：把持久化白名单写回 localStorage
watch(
  () => snapshot(),
  (s) => localStorage.setItem(K_STATE, JSON.stringify(s)),
  { deep: true }
)

// —— seenHidden 统一读写（A 层第 0 页标记）——
const seenHidden = () => localStorage.getItem(K_SEEN) === '1'
function markSeenHidden() { localStorage.setItem(K_SEEN, '1') }

// —— 终局标记（弱提示，不暴露具体结局文本）——
const hasEnded = () => !!state.ending
// 结局类型持久化到 game state

// 硬支线是否已完成：第 N 章的解谜门槛
const branchDone = (n) => {
  if (n === 1) return !!state.signed
  if (n === 2) return !!state.ordersOpened
  if (n === 3) return !!state.archiveOpen
  if (n === 4) return !!state.roadSolved
  if (n === 5) return !!state.audioSolved
  if (n === 6) return !!state.portraitSolved
  if (n === 7) return !!state.ending
  return false
}

// 某章是否已解锁（第 1 章恒真；之后需前一章完成）
const chapterOpen = (n) => {
  if (n <= 1) return true
  return branchDone(n - 1)
}

// 某条路由是否可访问（线性硬锁）
const canVisit = (path) => {
  const c = CHAPTERS.find(x => path === x.route)
  if (c) return chapterOpen(c.n)
  return true
}

// 软支线情报点是否可访问：任一硬支线完成即开放
const softOpen = () => branchDone(1)

// 解锁下一章
const advance = () => {
  for (let i = 1; i <= CHAPTERS.length; i++) {
    if (!branchDone(i)) { state.activeChapter = Math.min(i, CHAPTERS.length); return }
  }
  state.activeChapter = CHAPTERS.length
}

// 记一条软支线阅毕
const readSoft = (id) => { state.softRead = { ...state.softRead, [id]: true } }
const hasReadSoft = (id) => !!state.softRead[id]

// —— 碎片网：钥匙（解谜产出，解锁更多碎片）——
const collectKey = (id) => { if (id) state.keys = { ...state.keys, [id]: true } }
const hasKey = (id) => !!state.keys[id]

// —— 碎片网：已调阅（隐藏碎片的揭示）——
const markRead = (id) => { if (id) state.read = { ...state.read, [id]: true } }
const hasRead = (id) => !!state.read[id]

function createFortune(wish) {
  state.wish = wish || '未署名的愿望'
  state.signed = true
  advance()
}

function markBranch(key) {
  if (key === 'orders') state.ordersOpened = true
  if (key === 'archive') state.archiveOpen = true
  if (key === 'roads') state.roadSolved = true
  if (key === 'audio') state.audioSolved = true
  if (key === 'portrait') state.portraitSolved = true
  advance()
}

function setEnding(e) { state.ending = e; state.activeChapter = 7 }

function takeShortcut() { state.shortcuts += 1 }
function clearShortcut() { state.shortcuts = Math.max(0, state.shortcuts - 1) }
function triggerScare(type, text) {
  if (localStorage.getItem('cx_strong') === 'off') return
  state.scare = { type, text, id: Date.now() }
  setTimeout(() => { state.scare = null }, 1300)
}

function reset() {
  Object.assign(state, {
    wish: '', signed: false, ordersOpened: false, archiveOpen: false,
    roadSolved: false, audioSolved: false, portraitSolved: false, ending: null,
    softRead: {}, activeChapter: 1, scare: null, shortcuts: 0, pagesRead: 0, keys: {}, read: {}
  })
  localStorage.removeItem(K_STATE)
  localStorage.removeItem(K_SEEN)
  sessionStorage.removeItem(K_SEEN)
}

// —— 进度恢复校验：判断是否存在"有进度但被 reset 污染"的情况 ——
function hasStored() {
  return !!localStorage.getItem(K_STATE)
}

// —— 进度码：Base64(JSON) 导出/导入（压缩进度）——
const b64encode = (s) => btoa(unescape(encodeURIComponent(s)))
const b64decode = (s) => decodeURIComponent(escape(atob(s)))

function exportCode() {
  return b64encode(JSON.stringify({ v: 1, d: snapshot() }))
}

function importCode(code) {
  try {
    const o = JSON.parse(b64decode(code.trim()))
    if (!o || o.v !== 1 || !o.d) return false
    const d = o.d
    PERSIST_KEYS.forEach(k => { if (k in d) state[k] = d[k] })
    return true
  } catch (e) {
    return false
  }
}

// —— 减弱动效：手动覆盖 + prefers-reduced-motion 自动适配 ——
const K_MOTION = 'cx_reduce_motion'
const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const reduceMotion = () => localStorage.getItem(K_MOTION) === 'on' || (localStorage.getItem(K_MOTION) === null && prefersReduced())
function setReduceMotion(on) { localStorage.setItem(K_MOTION, on ? 'on' : 'off') }

export default {
  state, CHAPTERS, branchDone, chapterOpen, canVisit, softOpen, advance,
  readSoft, hasReadSoft, createFortune, markBranch, setEnding,
  takeShortcut, clearShortcut, triggerScare, reset,
  seenHidden, markSeenHidden, hasEnded, hasStored, exportCode, importCode,
  reduceMotion, setReduceMotion, collectKey, hasKey, markRead, hasRead
}

export { markSeenHidden, seenHidden }

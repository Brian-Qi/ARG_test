import { reactive, watch } from 'vue'

// 需持久化的字段（白名单；scare 等瞬时状态不入盘）
const PERSIST_KEYS = ['wish', 'signed', 'roadSolved', 'audioSolved', 'portraitSolved', 'ending', 'shortcuts', 'pagesRead', 'keys', 'read']
const K_STATE = 'cx_game'
const K_SEEN = 'cx_seen_hidden'
const K_FAMILY = 'cx_family_unlocked'
const K_SHEN = 'cx_shen_searched'
const K_MSG = 'cx_messages'

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
  signed: false,          // 取签
  roadSolved: false,      // 五路
  audioSolved: false,     // 录音
  portraitSolved: false,  // 旧影
  ending: null,           // 结账
  scare: null,
  shortcuts: 0,
  pagesRead: 0,
  keys: {},               // 已获得钥匙（碎片网解锁用）
  read: {}                // 已调阅碎片（隐藏碎片的揭示）
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

// —— 是否在馆藏检索里搜过「沈砚秋」（B 面入口前置之一）——
const shenSearched = () => localStorage.getItem(K_SHEN) === '1'
function markShenSearched() { localStorage.setItem(K_SHEN, '1') }

// —— 碎片网：钥匙（解谜产出，解锁更多碎片）——
const collectKey = (id) => { if (id) state.keys = { ...state.keys, [id]: true } }
const hasKey = (id) => !!state.keys[id]

// —— 碎片网：已调阅（隐藏碎片的揭示）——
const markRead = (id) => { if (id) state.read = { ...state.read, [id]: true } }
const hasRead = (id) => !!state.read[id]

// —— 线索分级：可查等级（随进度放开；等级越高，可查文档越多）——
const maxLevel = () => {
  if (!state.signed) return 1
  const k = Object.keys(state.keys || {}).length
  if (k >= 3) return 4
  if (k >= 1) return 3
  return 2
}

function createFortune(wish) {
  state.wish = wish || '未署名的愿望'
  state.signed = true
}

// 解谜分支配平（仅记完成态）
function markBranch(key) {
  if (key === 'roads') state.roadSolved = true
  if (key === 'audio') state.audioSolved = true
  if (key === 'portrait') state.portraitSolved = true
}

function setEnding(e) { state.ending = e }

function triggerScare(type, text) {
  if (localStorage.getItem('cx_strong') === 'off') return
  state.scare = { type, text, id: Date.now() }
  setTimeout(() => { state.scare = null }, 1300)
}

function reset() {
  Object.assign(state, {
    wish: '', signed: false, roadSolved: false, audioSolved: false, portraitSolved: false,
    ending: null, scare: null, shortcuts: 0, pagesRead: 0, keys: {}, read: {}
  })
  localStorage.removeItem(K_STATE)
  localStorage.removeItem(K_SEEN)
  localStorage.removeItem(K_FAMILY)   // 二周目：族谱解锁态一并重置
  localStorage.removeItem(K_SHEN)     // 二周目：沈砚秋检索标记一并重置
  localStorage.removeItem(K_MSG)      // 二周目：消息列表一并清空
  sessionStorage.removeItem(K_SEEN)
}

// —— 减弱动效：手动覆盖 + prefers-reduced-motion 自动适配 ——
const K_MOTION = 'cx_reduce_motion'
const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const reduceMotion = () => localStorage.getItem(K_MOTION) === 'on' || (localStorage.getItem(K_MOTION) === null && prefersReduced())

export default {
  state, createFortune, markBranch, setEnding, triggerScare, reset,
  seenHidden, markSeenHidden, shenSearched, markShenSearched,
  collectKey, hasKey, markRead, hasRead, maxLevel, reduceMotion
}

export { markSeenHidden, seenHidden, shenSearched, markShenSearched }

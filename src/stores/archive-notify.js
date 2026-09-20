import { ref } from 'vue'

// 跨页面共享的通知/消息状态（localStorage 持久化）
const K_MSG = 'cx_messages'
const K_FAMILY = 'cx_family_unlocked'

// 响应式版本号：push/markRead/unlock 后自增，用于让徽标重算
const version = ref(0)
function bump() { version.value++ }
export function useVersion() { return version }

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(K_MSG) || '[]')
    return Array.isArray(v) ? v : []
  } catch (e) {
    return []
  }
}

function save(list) {
  // 隐私模式/配额超限下 setItem 会抛错，消息功能不应因此中断
  try { localStorage.setItem(K_MSG, JSON.stringify(list)) } catch (e) { /* 忽略 */ }
}

function push({ type = 'normal', title, body, familyAvailable = false }) {
  const list = load()
  const msg = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    type,
    title,
    body,
    time: new Date().toISOString(),
    read: false,
    familyAvailable
  }
  list.unshift(msg)
  save(list)
  bump()
  return msg
}

function list() {
  return load()
}

function unreadCount() {
  return load().filter(m => !m.read).length
}

function markRead(id) {
  const list = load().map(m => (m.id === id ? { ...m, read: true } : m))
  save(list)
  bump()
  return list
}

function markAllRead() {
  const list = load().map(m => (m.read ? m : { ...m, read: true }))
  save(list)
  bump()
  return list
}

function clear() {
  save([])
  bump()
  return []
}

function familyUnlocked() {
  return localStorage.getItem(K_FAMILY) === '1'
}

function unlockFamily() {
  try { localStorage.setItem(K_FAMILY, '1') } catch (e) { /* 忽略 */ }
  bump()
}

// 站点锁：见过第 0 页 且 已解锁族谱 → A 面导航全部失效（无路可退）
function siteLocked() {
  return familyUnlocked() && localStorage.getItem('cx_seen_hidden') === '1'
}

export {
  push, list, unreadCount, markRead, markAllRead, clear,
  familyUnlocked, unlockFamily, siteLocked
}

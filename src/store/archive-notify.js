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
  localStorage.setItem(K_MSG, JSON.stringify(list))
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

function familyUnlocked() {
  return localStorage.getItem(K_FAMILY) === '1'
}

function unlockFamily() {
  localStorage.setItem(K_FAMILY, '1')
  bump()
}

export {
  push, list, unreadCount, markRead, markAllRead,
  familyUnlocked, unlockFamily
}

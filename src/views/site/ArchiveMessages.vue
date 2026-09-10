<template>
  <div class="msg-page">
    <h2 class="section-title">消息 <small>Messages</small></h2>
    <p class="muted msg-desc">您提交的申请与馆方回复会汇集在这里。</p>

    <div v-if="items.length" class="msg-list">
      <article
        v-for="m in items"
        :key="m.id"
        class="archive-panel msg-card"
        :class="{ 'msg-shen': m.type === 'shen', 'msg-unread': !m.read }"
        @click="open(m)"
      >
        <div class="msg-head">
          <h3>{{ m.title }}</h3>
          <span class="pill" :class="m.type === 'shen' ? 'pill-danger' : ''">{{ m.type === 'shen' ? '特殊' : '通知' }}</span>
          <span v-if="!m.read" class="msg-dot" aria-label="未读"></span>
        </div>
        <p class="msg-body">{{ m.body }}</p>

        <p v-if="m.familyAvailable && !unlocked" class="msg-actions">
          <button class="btn-flat" type="button" @click.stop="unlock">解锁沈晚族谱</button>
        </p>
        <p v-if="m.type === 'shen' && unlocked" class="msg-note">
          族谱已解锁：可在「馆藏检索」输入 <b>沈砚秋</b>。
          <RouterLink class="btn-flat" to="/help">前往帮助</RouterLink>
        </p>

        <time class="msg-time">{{ fmt(m.time) }}</time>
      </article>
    </div>

    <div v-else class="archive-panel msg-empty">
      <p>暂无消息。</p>
      <RouterLink class="back-link" to="/services/authorization">前往资料授权申请</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { list, markRead, familyUnlocked, unlockFamily, useVersion } from '../../store/archive-notify'

const router = useRouter()
useVersion()

const items = ref(list())
const unlocked = ref(familyUnlocked())

function open(m) {
  if (!m.read) {
    items.value = markRead(m.id)
  }
}

function unlock() {
  unlockFamily()
  unlocked.value = true
  items.value = list()
}

function fmt(iso) {
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
</script>

<style scoped>
.msg-desc {
  margin-bottom: 16px;
}
.msg-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.msg-card {
  cursor: pointer;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
.msg-card:hover {
  box-shadow: 0 4px 14px rgba(60, 24, 12, 0.08);
}
.msg-shen {
  border-color: rgba(140, 47, 36, 0.45);
  background: #f8eee0;
}
.msg-head {
  display: flex;
  align-items: center;
  gap: 12px;
}
.msg-head h3 {
  margin: 0;
  font-size: 18px;
  color: #3c3020;
  flex: 1;
}
.msg-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #b3271b;
  flex: none;
}
.msg-body {
  margin: 10px 0 6px;
  line-height: 1.9;
  color: #4a3d29;
}
.msg-actions {
  margin: 14px 0 4px;
}
.msg-note {
  margin: 12px 0 4px;
  font-size: 13px;
  color: #6d5d42;
}
.msg-note .btn-flat {
  margin-left: 12px;
  font-size: 13px;
  padding: 3px 12px;
}
.msg-note b {
  color: #8c2f24;
}
.msg-time {
  display: block;
  margin-top: 10px;
  font-size: 12px;
  color: #9a8a6f;
}
.msg-empty {
  text-align: center;
}
.pill-danger {
  background: rgba(140, 47, 36, 0.12);
  color: #8c2f24;
  border: 1px solid rgba(140, 47, 36, 0.4);
}
</style>

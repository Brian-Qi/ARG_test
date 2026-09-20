<template>
  <header class="archive-topbar">
    <div class="archive-topbar-inner">
      <RouterLink class="archive-brand" to="/">
        <span class="archive-brand-seal">档</span>
        <span class="archive-brand-name"><b>杭州民俗数字档案馆</b><i :class="{ 'brand-back': played }" @click="onSub">{{ played ? 'You Have Been Here Before' : 'Hangzhou Folklore Digital Archives' }}</i></span>
      </RouterLink>
      <nav class="archive-nav">
        <template v-for="item in items" :key="item.to">
          <RouterLink v-if="!locked" :to="item.to" :class="item.cls">
            {{ item.label }}
            <span v-if="item.badge && unread" class="msg-badge" aria-label="未读消息">{{ unread }}</span>
          </RouterLink>
          <span v-else class="archive-nav-dead" :title="item.deadTitle || '无路可退'" aria-disabled="true">{{ item.label }}</span>
        </template>
      </nav>
    </div>

    <ArchiveMap v-if="mapOpen" @close="mapOpen = false" />
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { unreadCount, useVersion, siteLocked } from '../../stores/archive-notify'
import game from '../../stores/game'
import ArchiveMap from './ArchiveMap.vue'

const route = useRoute()
const version = useVersion()
const unread = computed(() => { void version.value; return unreadCount() })
// 非一周目：完成过任意一次结账后，馆名下的拼音会换掉
const played = computed(() => { void version.value; return game.playedBefore() })

// 点那行英文 → 弹出馆藏脉络全图（仅非一周目）
const mapOpen = ref(false)
function onSub(e) {
  if (!played.value) return
  e.preventDefault()
  e.stopPropagation()
  mapOpen.value = true
}
// 仅 /help 且处于“无路可退”态时导航失效（路由限定，不污染其它页与二周目）
const locked = computed(() => {
  void version.value
  return route.path === '/help' && siteLocked()
})

const items = [
  { to: '/', label: '首页' },
  { to: '/search', label: '馆藏检索' },
  { to: '/collection/HZ-1927-0512', label: '近代商号账簿数字化', deadTitle: '馆藏已封' },
  { to: '/records/corrections', label: '数据校正记录', deadTitle: '权限受限' },
  { to: '/messages', label: '消息', badge: true, cls: 'archive-nav-msg', deadTitle: '消息 · 无法送达' }
]
</script>

<style scoped>
.archive-brand-name .brand-back { color: var(--blood-bright, #d13424); cursor: pointer; }
.archive-nav-dead {
  display: inline-block;
  padding: 8px 14px;
  font-size: 15px;
  color: #a4967a;
  text-decoration: line-through;
  opacity: 0.55;
  cursor: default;
  letter-spacing: 1px;
  white-space: nowrap;
}
@media (max-width: 800px) {
  .archive-nav-dead { padding: var(--space-sm) var(--space-md); }
}
</style>

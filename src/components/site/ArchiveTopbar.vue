<template>
  <header class="archive-topbar">
    <div class="archive-topbar-inner">
      <RouterLink class="archive-brand" to="/">
        <span class="archive-brand-seal">档</span>
        <span class="archive-brand-name"><b>杭州民俗数字档案馆</b><i>Hangzhou Folklore Digital Archives</i></span>
      </RouterLink>
      <nav class="archive-nav">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/search">馆藏检索</RouterLink>
        <RouterLink to="/collection/HZ-1927-0512">近代商号账簿数字化</RouterLink>
        <RouterLink to="/records/corrections">数据校正记录</RouterLink>
        <RouterLink class="archive-nav-msg" to="/messages">
          消息
          <span v-if="unread" class="msg-badge" aria-label="未读消息">{{ unread }}</span>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { unreadCount, useVersion } from '../../store/archive-notify'

useVersion()
const unread = computed(() => unreadCount())
</script>

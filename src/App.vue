<template>
  <!-- A 层：公开档案站（浅色正式壳） -->
  <div v-if="mode === 'public'" class="archive-shell">
    <ArchiveTopbar />
    <main class="archive-main">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in" @after-leave="toTop">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    <ArchiveFooter />
  </div>

  <!-- B 层：同一个档案馆，异变副本（档案站版式骨架 + 腐败视觉） -->
  <div v-else class="vault-shell">
    <VaultHeader />
    <main class="vault-main">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in" @after-leave="toTop">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    <VaultFooter />
    <HorrorOverlay />
    <div class="vault-blood" aria-hidden="true"></div>
    <div class="vault-grain" aria-hidden="true"></div>
    <div class="vault-vignette" aria-hidden="true"></div>
  </div>

  <!-- 走捷径提示：两壳层通用，确保玩家知道好结局已断 -->
  <Transition name="scare">
    <div v-if="game.state.shortcutToast" class="shortcut-toast" role="status">
      <b>旁注</b>
      <span>此途非正途。归还姓名一途，已断。</span>
      <i>（第 {{ game.state.shortcutToast.n }} 次捷径）</i>
    </div>
  </Transition>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import ArchiveTopbar from './components/site/ArchiveTopbar.vue'
import ArchiveFooter from './components/site/ArchiveFooter.vue'
import VaultHeader from './components/VaultHeader.vue'
import VaultFooter from './components/VaultFooter.vue'
import HorrorOverlay from './components/HorrorOverlay.vue'
import game from './stores/game'

const route = useRoute()
const mode = computed(() => (route.meta.mode === 'vault' ? 'vault' : 'public'))

// 把模式挂到 <html> 上：公开站亮底（layer-archive），馆藏异变副本暗底
watch(
  () => mode.value,
  (m) => {
    const el = document.documentElement
    el.dataset.mode = m
    el.classList.toggle('layer-archive', m === 'public')
    el.classList.toggle('layer-vault', m === 'vault')
  },
  { immediate: true }
)

// 减弱动效：reduced-motion 偏好或手动覆盖时，给 <html> 打 reduce-motion 面具
watch(
  () => game.reduceMotion(),
  (off) => document.documentElement.classList.toggle('reduce-motion', off),
  { immediate: true }
)

function toTop() {
  window.scrollTo(0, 0)
}
</script>

<style>
html[data-mode='public'] body {
  background: #efe6d2;
}
html[data-mode='vault'] body {
  background: #0a0705;
  color: #d3c4a0;
}

/* 走捷径提示（两壳层通用） */
.shortcut-toast {
  position: fixed;
  left: 50%;
  bottom: 26px;
  transform: translateX(-50%);
  z-index: 300;
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 10px 18px;
  max-width: 92vw;
  background: rgba(18, 8, 6, 0.95);
  border: 1px solid rgba(209, 52, 36, 0.6);
  box-shadow: 0 0 26px rgba(168, 41, 28, 0.35);
  color: #e8d3ab;
  font-size: 13.5px;
  letter-spacing: 0.06em;
}
.shortcut-toast b {
  color: #d13424;
  font-weight: 600;
  letter-spacing: 0.2em;
}
.shortcut-toast i {
  font-style: normal;
  color: #8a6f4d;
  font-size: 12px;
}
</style>

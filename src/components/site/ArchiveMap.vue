<template>
  <Teleport to="body">
    <div class="am-mask" @click.self="close">
      <div class="am-panel">
        <header class="am-head">
          <h3>馆藏脉络 · 全图</h3>
          <button class="am-close" type="button" @click="close">×</button>
        </header>

        <p class="am-legend">
          <span class="am-dot solid"></span>已探明
          <span class="am-dot open"></span>可达未读
          <span class="am-dot void"></span>未解锁
        </p>

        <div class="am-body">
          <section v-for="g in groups" :key="g.name" class="am-group">
            <h4 class="am-group-name">{{ g.name }}</h4>
            <ul class="am-tree">
              <li v-for="n in g.nodes" :key="n.key" class="am-node" :class="n.state">
                <span class="am-mark" aria-hidden="true"></span>
                <template v-if="n.state === 'void'">
                  <span class="am-title">???</span>
                </template>
                <RouterLink v-else :to="n.to" class="am-link" @click.capture="game.allowViaMap()" @click="close">
                  <span class="am-title">{{ n.title }}</span>
                  <span v-if="n.tag" class="am-tag">{{ n.tag }}</span>
                </RouterLink>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import FRAGMENTS from '../../data/fragments'
import JOURNAL from '../../data/journal'
import ENTITIES from '../../data/entities'
import { levelOf } from '../../data/net'
import game from '../../stores/game'

const emit = defineEmits(['close'])
function close() { emit('close') }

// 被任一「已读」碎片的相关卷宗引用 → 也算可达
function referencedByRead(id) {
  return FRAGMENTS.some(f => game.hasRead(f.id) && (f.refs || []).includes(id))
}
function exposed(id) {
  return game.hasRead(id) || levelOf(id) <= game.maxLevel() || referencedByRead(id)
}
function fragState(f) {
  if (game.hasRead(f.id)) return 'solid'
  return exposed(f.id) ? 'open' : 'void'
}
function artState(a) {
  if (game.hasRead(a.id)) return 'solid'
  return exposed(a.id) ? 'open' : 'void'
}
function entState(e) {
  if (game.hasRead(e.id)) return 'solid'
  const seen = FRAGMENTS.some(f => game.hasRead(f.id) && (f.entities || []).includes(e.id))
  return seen ? 'open' : 'void'
}

const A_PAGES = [
  { title: '首页', to: '/' },
  { title: '馆藏检索', to: '/search' },
  { title: '万和号流水账', to: '/collection/HZ-1927-0512' },
  { title: '数据校正记录', to: '/records/corrections' },
  { title: '帮助', to: '/help' },
  { title: '消息', to: '/messages' }
]
const VAULT_PAGES = [
  { title: '馆藏总目', to: '/story' },
  { title: '馆藏检索 · 副本', to: '/vault-search' },
  { title: '研究辑录', to: '/journal' }
]
const ENDING_NODES = [
  { key: 'bad', title: '第六位', to: '/ending/sixth' },
  { key: 'grey', title: '账已焚', to: '/ending/ash' },
  { key: 'hidden', title: '五人出账', to: '/ending/out' }
]
// 结局只列解锁过的：解锁几个出来几个
function endingNodes() {
  const out = ENDING_NODES.filter(e => game.hasEnding(e.key)).map(e => ({ ...e, state: 'solid' }))
  if (game.hasEnding('grey')) out.push({ key: 'strike-zero', title: '第零笔', to: '/strike-zero', state: 'open' })
  return out
}

const fragNode = (f) => ({ key: 'f-' + f.id, title: f.title, tag: f.tag, to: '/f/' + f.id, state: fragState(f) })
const byLevel = (lv) => FRAGMENTS.filter(f => levelOf(f.id) === lv).map(fragNode)

const groups = computed(() => ([
  { name: '公开站 · 杭州民俗数字档案馆', nodes: A_PAGES.map(p => ({ key: p.to, ...p, state: 'open' })) },
  { name: '异变副本 · 入口', nodes: VAULT_PAGES.map(p => ({ key: p.to, ...p, state: 'open' })) },
  { name: '卷宗 · 一级（主线）', nodes: byLevel(1) },
  { name: '卷宗 · 二级（解谜素材）', nodes: byLevel(2) },
  { name: '卷宗 · 三级（隐藏）', nodes: byLevel(3) },
  { name: '卷宗 · 四级（干扰）', nodes: byLevel(4) },
  {
    name: '研究辑录 · 篇目',
    nodes: JOURNAL.map(a => ({ key: 'j-' + a.id, title: a.title, tag: a.author, to: '/journal/' + a.id, state: artState(a) }))
  },
  {
    name: '名号索引',
    nodes: ENTITIES.map(e => ({ key: 'e-' + e.id, title: e.name, tag: e.type, to: '/e/' + e.id, state: entState(e) }))
  },
  { name: '结账', nodes: endingNodes() }
]).filter(g => g.nodes.length))

function onKey(e) { if (e.key === 'Escape') close() }
onMounted(() => {
  window.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.am-mask {
  position: fixed; inset: 0; z-index: 2000;
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
  background: rgba(8, 5, 3, 0.82);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.am-panel {
  width: 100%; max-width: 720px; max-height: 84vh;
  display: flex; flex-direction: column;
  background: #12100d;
  border: 1px solid rgba(150, 122, 85, 0.35);
  border-radius: 14px;
  box-shadow: 0 30px 70px -20px rgba(0, 0, 0, 0.8);
  animation: amIn 0.22s ease;
  overflow: hidden;
}
@keyframes amIn { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: none; } }

.am-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.9rem 1.2rem;
  border-bottom: 1px solid rgba(150, 122, 85, 0.22);
}
.am-head h3 { margin: 0; font-size: 1.05rem; letter-spacing: 0.16em; color: #e6d3af; font-weight: 500; }
.am-close { background: none; border: none; color: #9a7b52; font-size: 1.6rem; line-height: 1; cursor: pointer; }
.am-close:hover { color: #d13424; }

.am-legend {
  margin: 0; padding: 0.6rem 1.2rem;
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.74rem; color: #8a7250;
  border-bottom: 1px solid rgba(150, 122, 85, 0.14);
}
.am-legend .am-dot { margin-left: 0.7rem; }
.am-legend .am-dot:first-child { margin-left: 0; }

.am-body { overflow-y: auto; padding: 0.8rem 1.2rem 1.4rem; }
.am-group { margin-top: 1rem; }
.am-group:first-child { margin-top: 0.2rem; }
.am-group-name {
  margin: 0 0 0.35rem;
  font-size: 0.78rem; letter-spacing: 0.18em; font-weight: 500;
  color: #b99a6a;
}
.am-tree { list-style: none; margin: 0; padding: 0 0 0 1.1rem; border-left: 1px solid rgba(150, 122, 85, 0.2); }
.am-node { position: relative; display: flex; align-items: center; gap: 0.5rem; padding: 0.28rem 0; }
.am-node::before {
  content: ''; position: absolute; left: -1.1rem; top: 50%;
  width: 0.75rem; height: 1px; background: rgba(150, 122, 85, 0.28);
}
.am-mark { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.am-node.solid .am-mark { background: #c9a25a; box-shadow: 0 0 8px rgba(201, 162, 90, 0.5); }
.am-node.open .am-mark { background: transparent; border: 1px solid #9a7b52; }
.am-node.void .am-mark { background: transparent; border: 1px dashed #5a4a35; }

.am-link { display: flex; align-items: baseline; gap: 0.5rem; text-decoration: none; min-width: 0; }
.am-title { font-size: 0.9rem; color: #e6d3af; }
.am-node.open .am-title { color: #b99a6a; }
.am-node.void .am-title { color: #6a5942; letter-spacing: 0.2em; }
.am-link:hover .am-title { color: #d13424; }
.am-tag { font-size: 0.72rem; color: #8a7250; white-space: nowrap; }

@media (max-width: 600px) {
  .am-panel { max-height: 90vh; }
  .am-title { font-size: 0.84rem; }
  .am-tag { display: none; }
}
</style>

<template>
  <div class="vault-search">
    <div class="archive-panel collection-header">
      <p class="eyebrow">馆藏检索 / Index</p>
      <h1 class="collection-title">馆藏检索</h1>
      <p class="collection-desc">按题名、正文、人名、地名检索馆藏卷宗。</p>
    </div>

    <div class="vault-searchbar">
      <input v-model="kw" type="search" placeholder="检索馆藏、文书、人名、地点…" aria-label="检索馆藏" autofocus />
      <span class="vault-search-count">命中 {{ shown.length }} · 著录 {{ total }}　<Glitch :n="5" /></span>
    </div>

    <p v-if="!kw.trim()" class="vault-empty">输入一个词开始检索。可试人名、地名、年份，或某份卷宗里提到的别的什么。</p>
    <p v-else-if="!shown.length" class="vault-empty">没有检索到相关卷宗。</p>

    <ul v-else class="frag-list">
      <li v-for="r in shown" :key="r.kind + r.id" class="frag-row">
        <template v-if="r.kind === 'frag'">
          <RouterLink v-if="!isLocked(r)" class="frag-link" :to="'/f/' + r.id">
            <span class="frag-title" :title="r.title">{{ glitchedTitles[r.id] || r.title }}</span>
            <span class="frag-tag">{{ r.tag }}</span>
            <span v-if="r.key && game.hasKey(r.key)" class="frag-key">已解</span>
          </RouterLink>
          <span v-else class="frag-locked">
            <span class="frag-title" :title="r.title">{{ glitchedTitles[r.id] || r.title }}</span>
            <span class="frag-seal">加封 · 需先解开别处</span>
          </span>
        </template>
        <RouterLink v-else class="frag-link" :to="'/journal/' + r.id">
          <span class="frag-title" :title="r.title">{{ r.title }}</span>
          <span class="frag-tag">研究辑录 · {{ r.author }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import game from '../stores/game'
import FRAGMENTS from '../data/fragments'
import JOURNAL from '../data/journal'
import Glitch from '../components/Glitch.vue'
import { glitch } from '../utils/glitch'
import { levelOf } from '../data/net'

const kw = ref('')
const total = FRAGMENTS.length + JOURNAL.length
const isLocked = (f) => !!f.requires && !game.hasKey(f.requires)

// 随机几条：标题显示成乱码（悬停可见真名）
const glitchedTitles = ref({})
onMounted(() => {
  FRAGMENTS.forEach(f => { if (Math.random() < 0.12) glitchedTitles.value[f.id] = glitch(f.title.length) })
})

// 检索：碎片 + 研究辑录；仅显示"可查等级"以内的文档（等级随进度放开）
const shown = computed(() => {
  const q = kw.value.trim()
  if (!q) return []
  const lv = game.maxLevel()
  const frags = FRAGMENTS.filter(f => levelOf(f.id) <= lv).filter(f => {
    const hay = [f.title, f.tag, f.summary, ...(f.content || []), ...(f.entities || [])].join(' ')
    return hay.includes(q)
  }).map(f => ({ kind: 'frag', id: f.id, ...f }))
  const arts = JOURNAL.filter(a => levelOf(a.id) <= lv).filter(a => {
    const hay = [a.title, a.author, a.abstract, ...(a.keywords || []), ...(a.body || []), ...(a.notes || [])].join(' ')
    return hay.includes(q)
  }).map(a => ({ kind: 'article', id: a.id, ...a }))
  return [...frags, ...arts]
})
</script>

<style scoped>
.vault-search { max-width: 1000px; }
.collection-title { font-size: 24px; color: #ece0c0; }
.collection-desc { color: #b09a72; }

.vault-searchbar { display: flex; align-items: center; gap: 1rem; max-width: 620px; margin: 20px 0 22px; }
.vault-searchbar input {
  flex: 1; padding: 0.7em 1em; background: #120b08; border: 1px solid rgba(157, 40, 26, 0.5);
  border-radius: 3px; color: #efe3c8; font-family: inherit; font-size: 0.95rem; letter-spacing: 0.05em;
}
.vault-searchbar input:focus { outline: none; border-color: #d13424; box-shadow: 0 0 16px rgba(209, 52, 36, 0.22); }
.vault-searchbar input::placeholder { color: #6b5236; }
.vault-search-count { font-size: 0.78rem; color: #8a6f4d; letter-spacing: 0.1em; white-space: nowrap; }
.vault-empty { color: #8a6f4d; font-size: 0.9rem; }

.frag-list { list-style: none; margin: 0; padding: 0; }
.frag-row { border-bottom: 1px solid rgba(138, 111, 77, 0.14); }
.frag-link, .frag-locked { display: flex; align-items: baseline; gap: 14px; padding: 12px 4px; text-decoration: none; }
.frag-link { color: #d9c69a; }
.frag-link:hover { background: rgba(168, 41, 28, 0.1); }
.frag-link:hover .frag-title { color: #f0c884; }
.frag-title { font-size: 1.02rem; letter-spacing: 0.04em; }
.frag-tag { font-size: 0.74rem; color: #8a6f4d; letter-spacing: 0.1em; }
.frag-key { margin-left: auto; font-size: 0.72rem; color: #d13424; letter-spacing: 0.1em; }
.frag-locked { color: #6b5236; cursor: not-allowed; }
.frag-locked .frag-title { text-decoration: line-through; opacity: 0.75; }
.frag-seal { margin-left: auto; font-size: 0.72rem; color: #7a3a2a; letter-spacing: 0.12em; }
</style>

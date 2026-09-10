<template>
  <div class="vault-home">
    <!-- Hero：档案站抬头，开始不对劲 -->
    <section class="vault-hero" aria-label="馆藏介绍">
      <span class="hero-tag">让散落在街巷里的旧物，有一条归处</span>
      <h1>杭州民俗数字档案馆</h1>
      <p v-if="!game.state.signed">本馆致力于杭州地区民俗文献、商号文书与民间记忆的数字化保存与公开利用。馆藏以“数字可用、公开可查”为原则，持续整理并向公众开放。</p>
      <p v-else>本馆致力于杭州地区民俗文献、商号文书与民间记忆的数字化保存与公开利用。馆藏以“数字可用、公开可查”为原则，持续整理并向公众开放。个别卷宗调阅后，著录数量可能产生<em class="vault-em">出入</em>，请以原件为准。</p>
    </section>

    <!-- 取签节：万和号·线上迎财 -->
    <section v-if="!game.state.signed" aria-labelledby="vault-sign-title">
      <h2 id="vault-sign-title" class="section-title">线上迎财 <small>Digital Fortune</small></h2>
      <div class="notice-list sign-panel">
        <p class="sign-lead">万和号线上迎财 · 初五。提笔写下一件你求的事，取得馆藏编号 0512。</p>
        <form class="wish-form" @submit.prevent="issueSlip">
          <div class="wish-input">
            <input id="vault-wish" v-model="wish" maxlength="24" placeholder="例如：让这间小店撑过这个冬天" autocomplete="off" />
            <button>取一签</button>
          </div>
        </form>
        <small class="sign-note">签纸底部留有一格干净指印位，尚未属名。</small>
      </div>
    </section>

    <!-- 馆藏碎片总目：可检索的网 -->
    <section aria-labelledby="vault-records-title">
      <h2 id="vault-records-title" class="section-title">馆藏碎片 <small>Records</small></h2>
      <div class="vault-searchbar">
        <input v-model="kw" type="search" placeholder="检索馆藏、文书、人名、地点…" aria-label="检索馆藏" />
        <span class="vault-search-count">可见 {{ shown.length }} · 著录 {{ total }}</span>
      </div>

      <p v-if="!shown.length" class="vault-empty">没有检索到相关卷宗。试试人名、地名、年份，或某份卷宗里提到的别的什么。</p>

      <div v-for="group in groups" :key="group.type" class="frag-group">
        <h3 class="frag-group-title">{{ group.type }}</h3>
        <ul class="frag-list">
          <li v-for="f in group.items" :key="f.id" class="frag-row">
            <RouterLink v-if="!isLocked(f)" class="frag-link" :to="'/f/' + f.id">
              <span class="frag-title">{{ f.title }}</span>
              <span class="frag-tag">{{ f.tag }}</span>
              <span v-if="game.state.keys && f.key && game.hasKey(f.key)" class="frag-key">已解</span>
            </RouterLink>
            <span v-else class="frag-locked">
              <span class="frag-title">{{ f.title }}</span>
              <span class="frag-seal">加封 · 需先解开别处</span>
            </span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import game from '../stores/game'
import FRAGMENTS from '../data/fragments'

const wish = ref('')
const kw = ref('')

function issueSlip() {
  game.createFortune(wish.value.trim())
  game.triggerScare('hand', '你不是来求财的。你是来补位的。')
}

const total = FRAGMENTS.length
const isLocked = (f) => !!f.requires && !game.hasKey(f.requires)

// 检索：默认只列未隐藏的碎片；隐藏碎片仅在搜索命中时浮现
const shown = computed(() => {
  const q = kw.value.trim()
  if (!q) return FRAGMENTS.filter(f => !f.hidden)
  return FRAGMENTS.filter(f => {
    const hay = [f.title, f.tag, f.summary, ...(f.content || []), ...(f.entities || [])].join(' ')
    return hay.includes(q)
  })
})

const TYPE_ORDER = ['账册', '图像', '声音', '文书', '底档']
const groups = computed(() => {
  const byType = {}
  shown.value.forEach(f => { (byType[f.type] = byType[f.type] || []).push(f) })
  return TYPE_ORDER.filter(t => byType[t]).map(t => ({ type: t, items: byType[t] }))
})
</script>

<style scoped>
.vault-home { max-width: 1080px; }
.vault-hero {
  background: linear-gradient(120deg, #2b1710 0%, #3a1c12 55%, #2a140d 100%);
  color: #e4d2b0; border-radius: 6px; padding: 46px 52px;
  position: relative; overflow: hidden;
}
.vault-hero::before {
  content: ""; position: absolute; inset: 0;
  background-image: url("/img/bg_dark.jpg"); background-size: cover; background-position: center;
  opacity: 0.28; mix-blend-mode: screen;
}
.vault-hero::after {
  content: ""; position: absolute; inset: 0;
  background-image: radial-gradient(120% 90% at 50% 40%, transparent 40%, rgba(4, 2, 1, 0.8) 100%);
}
.vault-hero h1 { font-size: 34px; font-weight: 600; letter-spacing: 6px; margin: 0 0 10px; position: relative; color: #ecd9ae; }
.vault-hero p { position: relative; color: #c8b18a; font-size: 15px; line-height: 2; margin: 0; }
.vault-hero .hero-tag { position: relative; display: inline-block; margin-bottom: 18px; font-size: 13px; letter-spacing: 3px; border: 1px solid rgba(232, 217, 180, 0.4); padding: 4px 14px; border-radius: 999px; }
.vault-em { color: #d13424; font-style: normal; text-shadow: 0 0 10px rgba(209, 52, 36, 0.4); }
.sign-panel { padding: 20px 24px; }
.sign-lead { color: #bca67f; margin: 0 0 12px; }
.sign-note { display: block; margin-top: 10px; color: #6b5236; font-size: 0.78rem; letter-spacing: 0.1em; }
.wish-form .wish-input { display: flex; gap: 0.7rem; max-width: 440px; }
.wish-form .wish-input input { flex: 1; padding: 0.6em 0.9em; background: rgba(10, 7, 4, 0.7); border: 1px solid rgba(157, 40, 26, 0.4); border-radius: 3px; color: #efe3c8; font-family: inherit; font-size: 0.9rem; letter-spacing: 0.06em; }
.wish-form .wish-input input:focus { outline: none; border-color: #a8291c; box-shadow: 0 0 14px rgba(209, 52, 36, 0.2); }
.wish-form .wish-input input::placeholder { color: #6b5236; }
.wish-form .wish-input button { white-space: nowrap; }

/* 检索 */
.vault-searchbar { display: flex; align-items: center; gap: 1rem; max-width: 560px; margin: 0 0 22px; }
.vault-searchbar input {
  flex: 1; padding: 0.7em 1em; background: #120b08; border: 1px solid rgba(157, 40, 26, 0.5);
  border-radius: 3px; color: #efe3c8; font-family: inherit; font-size: 0.95rem; letter-spacing: 0.05em;
}
.vault-searchbar input:focus { outline: none; border-color: #d13424; box-shadow: 0 0 16px rgba(209, 52, 36, 0.22); }
.vault-searchbar input::placeholder { color: #6b5236; }
.vault-search-count { font-size: 0.78rem; color: #8a6f4d; letter-spacing: 0.1em; white-space: nowrap; }
.vault-empty { color: #8a6f4d; font-size: 0.9rem; }

.frag-group { margin-bottom: 26px; }
.frag-group-title {
  font-size: 0.82rem; letter-spacing: 0.34em; color: #9c7c55;
  border-bottom: 1px dashed rgba(138, 111, 77, 0.3); padding-bottom: 8px; margin: 0 0 4px;
  font-family: var(--serif, serif); font-weight: 400;
}
.frag-list { list-style: none; margin: 0; padding: 0; }
.frag-row { border-bottom: 1px solid rgba(138, 111, 77, 0.14); }
.frag-link, .frag-locked {
  display: flex; align-items: baseline; gap: 14px; padding: 12px 4px; text-decoration: none;
}
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

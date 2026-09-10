<template>
  <div class="vault-fragment">
    <div class="collection-back"><RouterLink class="back-link" to="/story">← 返回馆藏总目</RouterLink></div>

    <template v-if="fragment">
      <!-- 加封：需要钥匙 -->
      <div v-if="locked" class="archive-panel frag-sealed">
        <p class="eyebrow">{{ fragment.type }} / {{ fragment.tag }}</p>
        <h1 class="collection-title">{{ fragment.title }}</h1>
        <p class="collection-desc">此卷宗加封。需先解开别处的对应线索，方能调阅。</p>
        <RouterLink class="back-link" to="/story">← 先回去查别的</RouterLink>
      </div>

      <template v-else>
        <div class="archive-panel collection-header">
          <p class="eyebrow">{{ fragment.type }} / {{ fragment.tag }}</p>
          <h1 class="collection-title">{{ fragment.title }}</h1>
          <p class="collection-desc">{{ fragment.summary }}</p>
        </div>

        <div class="frag-body">
          <div v-if="fragment.img" class="frag-art">
            <img :src="fragment.img" :alt="fragment.title" loading="lazy" />
          </div>
          <div class="frag-copy">
            <p v-for="(p, i) in fragment.content" :key="i">{{ p }}</p>
          </div>
        </div>

        <!-- 内嵌谜题 / 终局 -->
        <section v-if="fragment.puzzle" class="frag-puzzle">
          <h2 class="frag-section-title">{{ puzzleHeading }}</h2>
          <component :is="puzzleComponent" />
        </section>

        <!-- 实体索引 -->
        <section v-if="entityList.length" class="frag-section">
          <h2 class="frag-section-title">相关人物 · 地点 · 神祇</h2>
          <div class="entity-chips">
            <RouterLink v-for="e in entityList" :key="e.id" class="entity-chip" :to="'/e/' + e.id">
              {{ e.name }}<i>{{ e.type }}</i>
            </RouterLink>
          </div>
        </section>

        <!-- 交叉引用 -->
        <section v-if="refList.length" class="frag-section">
          <h2 class="frag-section-title">相关卷宗</h2>
          <ul class="ref-list">
            <li v-for="r in refList" :key="r.id">
              <RouterLink :to="'/f/' + r.id">{{ r.title }} <span class="ref-tag">{{ r.tag }}</span></RouterLink>
            </li>
          </ul>
        </section>
      </template>
    </template>

    <div v-else class="archive-panel">
      <p class="muted">没有这页卷宗。</p>
      <RouterLink class="back-link" to="/story">← 返回馆藏总目</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import game from '../stores/game'
import FRAGMENTS from '../data/fragments'
import ENTITIES from '../data/entities'
import Roads from './Roads.vue'
import Audio from './Audio.vue'
import Portrait from './Portrait.vue'
import Finale from './Finale.vue'
import Zhaiyuan from './Zhaiyuan.vue'

const route = useRoute()
const fragment = computed(() => FRAGMENTS.find(f => f.id === route.params.id))
const locked = computed(() => !!fragment.value && !!fragment.value.requires && !game.hasKey(fragment.value.requires))

// 调阅即记已读（隐藏碎片由此在实体页/后续检索中稳定显现）
watch(fragment, (f) => { if (f && !(f.requires && !game.hasKey(f.requires))) game.markRead(f.id) }, { immediate: true })

const entityList = computed(() => {
  if (!fragment.value?.entities) return []
  return fragment.value.entities.map(id => ENTITIES.find(e => e.id === id)).filter(Boolean)
})
const refList = computed(() => {
  if (!fragment.value?.refs) return []
  return fragment.value.refs.map(id => FRAGMENTS.find(f => f.id === id)).filter(Boolean)
})

const PUZZLES = { roads: Roads, audio: Audio, portrait: Portrait, finale: Finale, zhaiyuan: Zhaiyuan }
const puzzleComponent = computed(() => PUZZLES[fragment.value?.puzzle] || null)

const HEADINGS = { finale: '结账', zhaiyuan: '安位', roads: '此卷宗内有一处异常', audio: '此卷宗内有一处异常', portrait: '此卷宗内有一处异常' }
const puzzleHeading = computed(() => HEADINGS[fragment.value?.puzzle] || '此卷宗内有一处异常')
</script>

<style scoped>
.vault-fragment { max-width: 1000px; }
.collection-title { font-size: 26px; line-height: 1.4; color: #ece0c0; }
.collection-desc { color: #b09a72; }
.frag-sealed { text-align: left; }
.frag-body { display: grid; grid-template-columns: minmax(220px, 340px) 1fr; gap: 2rem; align-items: start; margin: 20px 0; }
.frag-art { border-radius: 4px; overflow: hidden; border: 1px solid rgba(157, 40, 26, 0.4); background: #0d0906; }
.frag-art img { width: 100%; display: block; filter: sepia(0.25) contrast(1.05) brightness(0.92); }
.frag-copy p { color: #c8b18a; line-height: 2; font-size: 1rem; margin: 0 0 1em; }
.frag-section, .frag-puzzle { margin-top: 30px; }
.frag-section-title {
  font-size: 0.84rem; letter-spacing: 0.28em; color: #9c7c55; font-weight: 400; font-family: var(--serif, serif);
  border-bottom: 1px dashed rgba(138, 111, 77, 0.3); padding-bottom: 8px; margin: 0 0 14px;
}
.entity-chips { display: flex; flex-wrap: wrap; gap: 10px; }
.entity-chip {
  display: inline-flex; align-items: baseline; gap: 8px; padding: 6px 14px; text-decoration: none;
  border: 1px solid rgba(157, 40, 26, 0.5); border-radius: 999px; color: #ecd9ae; background: rgba(168, 41, 28, 0.1);
}
.entity-chip:hover { background: #a8291c; color: #f6efdf; }
.entity-chip i { font-style: normal; font-size: 0.7rem; color: #8a6f4d; }
.ref-list { list-style: none; margin: 0; padding: 0; }
.ref-list li { border-bottom: 1px solid rgba(138, 111, 77, 0.14); }
.ref-list a { display: flex; align-items: baseline; gap: 12px; padding: 11px 4px; color: #d9c69a; text-decoration: none; }
.ref-list a:hover { background: rgba(168, 41, 28, 0.1); color: #f0c884; }
.ref-tag { font-size: 0.74rem; color: #8a6f4d; }
@media (max-width: 720px) { .frag-body { grid-template-columns: 1fr; } }
</style>

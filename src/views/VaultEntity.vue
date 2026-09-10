<template>
  <div class="vault-entity">
    <div class="collection-back"><RouterLink class="back-link" to="/story">← 返回馆藏总目</RouterLink></div>

    <template v-if="entity">
      <div class="archive-panel collection-header">
        <p class="eyebrow">{{ entity.type }}</p>
        <h1 class="collection-title">{{ entity.name }}<small v-if="entity.alias" class="ent-alias">（又名 {{ entity.alias.join('、') }}）</small></h1>
        <p class="collection-desc">{{ entity.note }}</p>
      </div>

      <section class="frag-section">
        <h2 class="frag-section-title">馆藏中提到「{{ entity.name }}」的卷宗</h2>
        <ul class="ref-list">
          <li v-for="f in related" :key="f.id">
            <RouterLink :to="'/f/' + f.id">{{ f.title }} <span class="ref-tag">{{ f.tag }}</span></RouterLink>
          </li>
        </ul>
        <p v-if="!related.length" class="muted">暂无直接提到该名号的卷宗。</p>
      </section>
    </template>

    <div v-else class="archive-panel">
      <p class="muted">馆藏中没有这个名号。</p>
      <RouterLink class="back-link" to="/story">← 返回馆藏总目</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import game from '../stores/game'
import FRAGMENTS from '../data/fragments'
import ENTITIES from '../data/entities'

const route = useRoute()
const entity = computed(() => ENTITIES.find(e => e.id === route.params.id))
// 隐藏碎片仅在已调阅后，才在名号索引中现身
const related = computed(() => FRAGMENTS.filter(f =>
  (f.entities || []).includes(route.params.id) && (!f.hidden || game.hasRead(f.id))
))
</script>

<style scoped>
.vault-entity { max-width: 1000px; }
.collection-title { font-size: 26px; line-height: 1.4; color: #ece0c0; }
.ent-alias { font-size: 0.9rem; color: #8a6f4d; margin-left: 10px; }
.collection-desc { color: #b09a72; }
.frag-section { margin-top: 30px; }
.frag-section-title {
  font-size: 0.84rem; letter-spacing: 0.28em; color: #9c7c55; font-weight: 400; font-family: var(--serif, serif);
  border-bottom: 1px dashed rgba(138, 111, 77, 0.3); padding-bottom: 8px; margin: 0 0 14px;
}
.ref-list { list-style: none; margin: 0; padding: 0; }
.ref-list li { border-bottom: 1px solid rgba(138, 111, 77, 0.14); }
.ref-list a { display: flex; align-items: baseline; gap: 12px; padding: 11px 4px; color: #d9c69a; text-decoration: none; }
.ref-list a:hover { background: rgba(168, 41, 28, 0.1); color: #f0c884; }
.ref-tag { font-size: 0.74rem; color: #8a6f4d; }
.muted { color: #8a6f4d; }
</style>

<template>
  <div class="vault-entity">
    <div class="collection-back"><RouterLink class="back-link" to="/story">← 返回馆藏总目</RouterLink></div>

    <template v-if="entity">
      <div class="archive-panel collection-header">
        <p class="eyebrow">{{ entity.type }}</p>
        <h1 class="collection-title">
          {{ entity.name }}<small v-if="entity.alias" class="ent-alias">（又名 {{ entity.alias.join('、') }}）</small>
        </h1>
        <p class="collection-desc">{{ entity.note }}　<Glitch :n="6" /></p>
      </div>

      <section class="frag-section">
        <h2 class="frag-section-title">馆藏中提到「{{ entity.name }}」的卷宗</h2>
        <ul class="ref-list">
          <li v-for="r in related" :key="r.kind + r.id">
            <RouterLink :to="r.to"
              >{{ r.title }} <span class="ref-tag">{{ r.tag }}</span></RouterLink
            >
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
import JOURNAL from '../data/journal'
import ENTITIES from '../data/entities'
import Glitch from '../components/Glitch.vue'

const route = useRoute()
const entity = computed(() => ENTITIES.find((e) => e.id === route.params.id))
// 隐藏碎片仅在已调阅后，才在名号索引中现身；文章一并纳入
const related = computed(() => {
  const frags = FRAGMENTS.filter((f) => (f.entities || []).includes(route.params.id) && (!f.hidden || game.hasRead(f.id))).map((f) => ({
    kind: 'frag',
    id: f.id,
    title: f.title,
    tag: f.tag,
    to: '/f/' + f.id
  }))
  const arts = JOURNAL.filter((a) => (a.entities || []).includes(route.params.id)).map((a) => ({
    kind: 'article',
    id: a.id,
    title: a.title,
    tag: '研究辑录 · ' + a.author,
    to: '/journal/' + a.id
  }))
  return [...frags, ...arts]
})
</script>

<style scoped>
.vault-entity {
  max-width: 1000px;
}
.ent-alias {
  font-size: 0.9rem;
  color: #8a6f4d;
  margin-left: 10px;
}
.muted {
  color: #8a6f4d;
}
</style>

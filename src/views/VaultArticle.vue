<template>
  <div class="vault-article">
    <div class="collection-back"><RouterLink class="back-link" to="/journal">← 返回研究辑录</RouterLink></div>

    <template v-if="article">
      <div class="archive-panel collection-header">
        <p class="eyebrow">{{ article.issue }} / {{ article.date }}</p>
        <h1 class="collection-title">{{ article.title }}</h1>
        <p class="collection-desc">作者：{{ article.author }}</p>
      </div>

      <div class="archive-panel ar-body">
        <p class="ar-abstract"><b>摘要</b>　{{ article.abstract }}</p>
        <p class="ar-keywords"><b>关键词</b>　{{ article.keywords.join('；') }}</p>
        <hr class="ar-hr" />
        <p v-for="(p, i) in article.body" :key="i">{{ p }}</p>

        <ol v-if="article.notes && article.notes.length" class="ar-notes">
          <li v-for="(n, i) in article.notes" :key="i">{{ n }}</li>
        </ol>

        <section v-if="refList.length" class="ar-refs">
          <h2 class="ar-refs-title">相关卷宗 · 文稿</h2>
          <ul class="ar-refs-list">
            <li v-for="r in refList" :key="r.kind + r.id">
              <RouterLink :to="r.to">{{ r.title }} <span class="ref-tag">{{ r.tag }}</span></RouterLink>
            </li>
          </ul>
        </section>

        <p class="ar-glitch"><Glitch :n="34" /></p>
      </div>
    </template>

    <div v-else class="archive-panel">
      <p class="muted">没有这篇文稿。</p>
      <RouterLink class="back-link" to="/journal">← 返回研究辑录</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import JOURNAL from '../data/journal'
import Glitch from '../components/Glitch.vue'
import { resolveRefs } from '../data/net'
import game from '../stores/game'

const route = useRoute()
const article = computed(() => JOURNAL.find(a => a.id === route.params.id))
const refList = computed(() => resolveRefs(article.value?.refs || []))

// 调阅即记已读（全图的「已探明」据此点亮）
watch(article, (a) => { if (a) game.markRead(a.id) }, { immediate: true })
</script>

<style scoped>
.vault-article { max-width: 820px; }
.ar-body { margin-top: 18px; }
.ar-body p { color: #c8b18a; line-height: 2; font-size: 1rem; margin: 0 0 1em; }
.ar-abstract { color: #d9c69a; }
.ar-abstract b, .ar-keywords b { color: #9c7c55; font-weight: 400; letter-spacing: 0.16em; margin-right: 6px; }
.ar-keywords { font-size: 0.88rem; color: #a8926a; }
.ar-hr { border: 0; border-top: 1px dashed rgba(138, 111, 77, 0.3); margin: 18px 0; }
.ar-notes { margin: 20px 0 0; padding-left: 1.4em; }
.ar-notes li { color: #8a6f4d; font-size: 0.84rem; line-height: 1.9; margin-bottom: 6px; }
.ar-refs { margin-top: 26px; }
.ar-refs-title { font-size: 0.84rem; letter-spacing: 0.28em; color: #9c7c55; font-weight: 400; border-bottom: 1px dashed rgba(138, 111, 77, 0.3); padding-bottom: 8px; margin: 0 0 12px; }
.ar-refs-list { list-style: none; margin: 0; padding: 0; }
.ar-refs-list li { border-bottom: 1px solid rgba(138, 111, 77, 0.14); }
.ar-refs-list a { display: flex; align-items: baseline; gap: 12px; padding: 10px 4px; color: #d9c69a; text-decoration: none; }
.ar-refs-list a:hover { background: rgba(168, 41, 28, 0.1); color: #f0c884; }
.ref-tag { font-size: 0.74rem; color: #8a6f4d; }
.ar-glitch { margin-top: 18px; letter-spacing: 0.16em; opacity: 0.85; }
.muted { color: #8a6f4d; }
</style>

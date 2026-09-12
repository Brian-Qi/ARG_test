<template>
  <div class="vault-journal">
    <div class="archive-panel collection-header">
      <p class="eyebrow">馆刊 / Journal</p>
      <h1 class="collection-title">研究辑录</h1>
      <p class="collection-desc">《杭州民俗数字档案馆馆刊》辑录。所收文字，仅代表作者个人整理所见，不代表本馆立场。</p>
    </div>

    <ul class="jr-list">
      <li v-for="a in JOURNAL" :key="a.id" class="jr-item">
        <RouterLink :to="'/journal/' + a.id">
          <div class="jr-meta">
            <span class="jr-issue">{{ a.issue }}</span>
            <span class="jr-date">{{ a.date }}</span>
          </div>
          <h2 class="jr-title">{{ a.title }}</h2>
          <p class="jr-author">作者：{{ a.author }}</p>
          <p class="jr-abstract">{{ a.abstract }}</p>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import JOURNAL from '../data/journal'
</script>

<style scoped>
.vault-journal { max-width: 1000px; }
.collection-title { font-size: 24px; color: #ece0c0; }
.collection-desc { color: #b09a72; }

.jr-list { list-style: none; margin: 22px 0 0; padding: 0; }
.jr-item { border-bottom: 1px solid rgba(138, 111, 77, 0.18); }
.jr-item a { display: block; padding: 18px 6px; text-decoration: none; color: inherit; transition: background 0.2s ease; }
.jr-item a:hover { background: rgba(168, 41, 28, 0.08); }
.jr-meta { display: flex; gap: 14px; font-size: 0.72rem; letter-spacing: 0.16em; color: #9c7c55; }
.jr-title { font-size: 1.12rem; color: #e3cf9f; margin: 6px 0 4px; font-family: var(--serif, serif); font-weight: 600; }
.jr-item a:hover .jr-title { color: #f0c884; }
.jr-author { font-size: 0.82rem; color: #8a6f4d; margin: 0 0 6px; }
.jr-abstract { font-size: 0.88rem; color: #b09a72; line-height: 1.8; margin: 0; }
</style>

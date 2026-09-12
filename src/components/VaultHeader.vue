<template>
  <header class="vault-header">
    <div class="vault-header-inner">
      <RouterLink class="vault-brand" to="/story">
        <span class="vault-brand-seal">档</span>
        <span class="vault-brand-name"><b>杭州民俗数字档案馆</b><i>Hangzhou Folklore Digital Archives</i></span>
      </RouterLink>
      <nav class="vault-nav" aria-label="馆藏导航">
        <RouterLink to="/story">首页</RouterLink>
        <RouterLink to="/vault-search">馆藏检索</RouterLink>
        <RouterLink to="/journal">研究辑录</RouterLink>
        <span class="vault-nav-dead" title="数据校正记录 · 权限受限">数据校正记录</span>
        <span class="vault-nav-dead" title="消息 · 无法送达">消息</span>
      </nav>
    </div>
    <span class="vault-title" aria-hidden="true">关联档案 · Restricted　<Glitch :n="10" /></span>
  </header>
</template>

<script setup>
import Glitch from './Glitch.vue'
</script>

<style scoped>
.vault-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: linear-gradient(180deg, rgba(10, 7, 4, 0.96), rgba(16, 11, 7, 0.9));
  backdrop-filter: blur(5px);
  border-bottom: 1px solid rgba(157, 40, 26, 0.4);
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.6);
}
.vault-header-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 12px 28px;
  display: flex;
  align-items: center;
  gap: 26px;
}
.vault-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #d3c4a0;
  text-decoration: none;
}
.vault-brand-seal {
  width: 46px;
  height: 46px;
  border: 2px solid #a8291c;
  color: #d13424;
  font-family: "Ma Shan Zheng", serif;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-4deg);
  border-radius: 4px;
  background: rgba(168, 41, 28, 0.1);
}
.vault-brand-name { line-height: 1.2; }
.vault-brand-name b {
  display: block;
  font-size: 20px;
  letter-spacing: 4px;
  font-weight: 600;
  color: #e0cf9e;
  text-shadow: 0 0 12px rgba(209, 52, 36, 0.4);
}
.vault-brand-name i {
  font-style: normal;
  font-size: 12px;
  color: #8a6f4d;
  letter-spacing: 2px;
}
.vault-nav {
  display: flex;
  gap: 4px;
  margin-left: auto;
  flex-wrap: wrap;
}
.vault-nav a {
  padding: 8px 14px;
  font-size: 15px;
  color: #b8a37a;
  text-decoration: none;
  border-radius: 3px;
  letter-spacing: 1px;
}
.vault-nav a:hover {
  background: rgba(168, 41, 28, 0.16);
  color: #ecd9ae;
}
.vault-nav a.router-link-active {
  background: rgba(168, 41, 28, 0.24);
  color: #f0e2c0;
}
.vault-nav .vault-nav-dead {
  padding: 8px 14px;
  font-size: 15px;
  color: #5c4a34;
  letter-spacing: 1px;
  text-decoration: line-through;
  opacity: 0.7;
}
.vault-title {
  display: block;
  max-width: 1000px;
  margin: 0 auto;
  font-size: 11px;
  letter-spacing: 0.4em;
  color: rgba(134, 40, 26, 0.55);
  padding: 0 28px 9px;
}
@media (max-width: 800px) {
  .vault-header-inner { flex-wrap: wrap; gap: 12px; padding: 10px 16px; }
  .vault-nav { width: 100%; justify-content: flex-start; overflow-x: auto; }
  .vault-brand-name b { font-size: 16px; letter-spacing: 2px; }
}
</style>

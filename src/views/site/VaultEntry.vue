<template>
  <div class="vault-entry">
    <div class="ve-panel">
      <span class="ve-kicker">关联档案 · Restricted</span>
      <h1>正在调阅关联档案…</h1>
      <p>馆藏 <b>HZ-1927-0512</b> 著录之外另有一份关联档案，未列入公开目录。系统正在切换到保管库视图。</p>
      <div class="ve-bar"><i></i></div>
      <RouterLink to="/collection/HZ-1927-0512" class="ve-cancel">返回公开目录</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
onMounted(() => {
  setTimeout(() => router.replace('/story'), 2400)
})
</script>

<style scoped>
.vault-entry {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ve-panel {
  max-width: 560px;
  text-align: center;
  background: #f9f3e4;
  border: 1px solid #e0d2b4;
  border-radius: 6px;
  padding: 44px 40px;
}
.ve-kicker {
  font-size: 12px;
  letter-spacing: 3px;
  color: #8c2f24;
  border: 1px solid rgba(140, 47, 36, 0.4);
  padding: 3px 12px;
  border-radius: 999px;
}
.ve-panel h1 {
  font-family: "Noto Serif SC", serif;
  font-weight: 600;
  font-size: 22px;
  color: #3c3020;
  letter-spacing: 3px;
  margin: 18px 0 10px;
}
.ve-panel p {
  color: #6d5f45;
  font-size: 14px;
  line-height: 2;
}
.ve-bar {
  height: 3px;
  background: #e8dcbe;
  border-radius: 3px;
  overflow: hidden;
  margin: 18px auto 14px;
  max-width: 260px;
}
.ve-bar i {
  display: block;
  height: 100%;
  width: 40%;
  background: #8c2f24;
  animation: ve-slide 1.15s ease-in-out infinite;
}
@keyframes ve-slide {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(320%); }
}
.ve-cancel {
  font-size: 13px;
  color: #6d5d42;
  text-decoration: none;
}
.ve-cancel:hover {
  color: #8c2f24;
  text-decoration: underline;
}
@media (prefers-reduced-motion: reduce) {
  .ve-bar i {
    animation: none;
    width: 100%;
  }
}
</style>

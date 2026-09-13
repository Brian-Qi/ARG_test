<template>
  <section class="ending-page ending-bad">
    <figure class="ep-hero">
      <img :src="art" alt="" />
      <figcaption class="ep-cap">
        <p class="ep-kicker">结账 · 第六位</p>
        <h1>第六位</h1>
      </figcaption>
      <span class="ep-seal">签</span>
    </figure>

    <div class="ep-copy">
      <p>沈砚秋走出来了。</p>
      <p>财签自动卷起，变成一张旧合影——五个孩子并排站着，旁边的空位里，是你。</p>
      <p class="ep-tag">第六位收件人已签收。</p>
      <RouterLink class="btn-flat" to="/" @click="reset">重新调阅</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import game from '../stores/game'

const art = '/img/ending-sixth.webp'   // 绑定 src，避免构建期要求文件存在
onMounted(() => game.setEnding('bad'))
function reset() { game.reset() }
</script>

<style scoped>
.ending-page { max-width: 1000px; margin: 0 auto; }
.ep-hero {
  position: relative; margin: 6px 0 0; aspect-ratio: 16 / 9; overflow: hidden; border-radius: 6px;
  border: 1px solid rgba(209, 52, 36, 0.55); background: #0d0906;
  box-shadow: 0 0 60px rgba(168, 41, 28, 0.28); animation: ep-in 0.9s ease both;
}
.ep-hero img { width: 100%; height: 100%; object-fit: cover; display: block; filter: sepia(0.25) contrast(1.08) brightness(0.82); }
.ep-hero::before { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.12) 42%, rgba(8,3,2,0.94) 100%); }
.ep-hero::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 1px, transparent 1px 3px); mix-blend-mode: multiply; }
.ep-cap { position: absolute; left: 42px; bottom: 30px; z-index: 2; }
.ep-kicker { margin: 0 0 8px; font-size: 0.82rem; letter-spacing: 0.5em; color: #e0a892; }
.ep-hero h1 { margin: 0; font-family: var(--serif, serif); font-size: clamp(2.4rem, 6vw, 4rem); letter-spacing: 0.18em; color: #d13424; text-shadow: 0 0 30px rgba(209, 52, 36, 0.6), 0 2px 10px #000; }
.ep-seal {
  position: absolute; top: 26px; right: 30px; z-index: 2; width: 64px; height: 64px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center; font-family: "Ma Shan Zheng", serif; font-size: 34px;
  border: 2px solid #d13424; color: #ff5a3c; background: rgba(20, 4, 3, 0.5);
  transform: rotate(-6deg); box-shadow: 0 0 24px rgba(209, 52, 36, 0.4);
}
.ep-copy { max-width: 660px; margin: 34px auto 0; text-align: center; animation: ep-copy-in 1s ease 0.25s both; }
.ep-copy p { line-height: 2.2; font-size: 1.05rem; color: #e6d3b4; margin: 0 0 0.8em; }
.ep-tag { color: #ff9a86; letter-spacing: 0.2em; }
.ep-copy .btn-flat { margin-top: 18px; }
@keyframes ep-in { from { opacity: 0; transform: scale(1.035); } to { opacity: 1; transform: scale(1); } }
@keyframes ep-copy-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 720px) {
  .ep-hero { aspect-ratio: 16 / 9; }
  .ep-cap { left: 20px; bottom: 18px; }
  .ep-hero h1 { letter-spacing: 0.1em; }
  .ep-seal { width: 50px; height: 50px; font-size: 26px; top: 14px; right: 14px; }
}
</style>

<template>
  <section class="ending-page ending-good">
    <figure class="ep-hero">
      <img :src="art" alt="" />
      <figcaption class="ep-cap">
        <p class="ep-kicker">结账 · 五人出账</p>
        <h1>五人出账</h1>
      </figcaption>
      <span class="ep-seal">还</span>
    </figure>

    <div class="ep-copy">
      <p>五个零回到姓名与年龄。五双小鞋，一双一双消失了。</p>
      <p>第六位一直没有等到人——沈怀仁自己坐了进去，用他自己的魂，续他自己的命。</p>
      <p class="ep-tag">从此年年初五，他都醒着。永生，是他自己给自己的。</p>
      <RouterLink class="btn-flat" to="/" @click="reset">重新调阅</RouterLink>
    </div>
  </section>
</template>

<script setup>
import game from '../stores/game'

const art = '/img/ending-out.webp'
function reset() { game.reset() }
</script>

<style scoped>
.ending-page { max-width: 1000px; margin: 0 auto; }
.ep-hero {
  position: relative; margin: 6px 0 0; aspect-ratio: 16 / 9; overflow: hidden; border-radius: 6px;
  border: 1px solid rgba(201, 162, 90, 0.55); background: #0d0906;
  box-shadow: 0 0 60px rgba(201, 162, 90, 0.16); animation: ep-in 0.9s ease both;
}
.ep-hero img { width: 100%; height: 100%; object-fit: cover; display: block; filter: sepia(0.3) contrast(1.05) brightness(0.86); }
.ep-hero::before { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.1) 42%, rgba(10,7,3,0.94) 100%); }
.ep-hero::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, rgba(0,0,0,0.14) 0 1px, transparent 1px 3px); mix-blend-mode: multiply; }
.ep-cap { position: absolute; left: 42px; bottom: 30px; z-index: 2; }
.ep-kicker { margin: 0 0 8px; font-size: 0.82rem; letter-spacing: 0.5em; color: #e2c98f; }
.ep-hero h1 { margin: 0; font-family: var(--serif, serif); font-size: clamp(2.4rem, 6vw, 4rem); letter-spacing: 0.18em; color: #f0c884; text-shadow: 0 0 30px rgba(240, 200, 132, 0.5), 0 2px 10px #000; }
.ep-seal {
  position: absolute; top: 26px; right: 30px; z-index: 2; width: 64px; height: 64px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center; font-family: "Ma Shan Zheng", serif; font-size: 34px;
  border: 2px solid #c9a25a; color: #f0c884; background: rgba(24, 16, 6, 0.5);
  transform: rotate(-6deg); box-shadow: 0 0 24px rgba(201, 162, 90, 0.35);
}
.ep-copy { max-width: 660px; margin: 34px auto 0; text-align: center; animation: ep-copy-in 1s ease 0.25s both; }
.ep-copy p { line-height: 2.2; font-size: 1.05rem; color: #e3d2ad; margin: 0 0 0.8em; }
.ep-tag { color: #f0d9a8; font-style: normal; }
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

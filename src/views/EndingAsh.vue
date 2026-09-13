<template>
  <section class="ending-page ending-grey">
    <figure class="ep-hero">
      <img :src="art" alt="" />
      <figcaption class="ep-cap">
        <p class="ep-kicker">结账 · 账已焚</p>
        <h1>账已焚</h1>
      </figcaption>
      <span class="ep-seal">焚</span>
    </figure>

    <div class="ep-copy">
      <p>账焚尽了。他看了很久，什么也没说。</p>
      <p>灰里还留着字痕。有些字，是烧不掉的。</p>
      <RouterLink class="grey-hint" to="/strike-zero">账烧不干净的那一笔，在灰里也看得见。</RouterLink>
      <button class="btn-flat" @click="restart">重新调阅</button>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import game from '../stores/game'

const router = useRouter()
const art = '/img/ending-ash.webp'
onMounted(() => game.setEnding('grey'))   // 本页即灰结局：确立状态，保证第零笔入口可用
function restart() { game.reset(); router.push('/') }
</script>

<style scoped>
.ending-page { max-width: 1000px; margin: 0 auto; }
.ep-hero {
  position: relative; margin: 6px 0 0; aspect-ratio: 16 / 9; overflow: hidden; border-radius: 6px;
  border: 1px solid rgba(150, 145, 130, 0.4); background: #0d0906;
  box-shadow: 0 0 50px rgba(120, 118, 110, 0.14); animation: ep-in 0.9s ease both;
}
.ep-hero img { width: 100%; height: 100%; object-fit: cover; display: block; filter: grayscale(0.35) sepia(0.12) contrast(1.05) brightness(0.82); }
.ep-hero::before { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.12) 42%, rgba(10,10,9,0.94) 100%); }
.ep-hero::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 3px); mix-blend-mode: multiply; }
.ep-cap { position: absolute; left: 42px; bottom: 30px; z-index: 2; }
.ep-kicker { margin: 0 0 8px; font-size: 0.82rem; letter-spacing: 0.5em; color: #9d988a; }
.ep-hero h1 { margin: 0; font-family: var(--serif, serif); font-size: clamp(2.4rem, 6vw, 4rem); letter-spacing: 0.18em; color: #c9c4b6; text-shadow: 0 2px 12px #000; }
.ep-seal {
  position: absolute; top: 26px; right: 30px; z-index: 2; width: 64px; height: 64px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center; font-family: "Ma Shan Zheng", serif; font-size: 34px;
  border: 2px solid rgba(150, 145, 130, 0.7); color: #cfc7b4; background: rgba(20, 19, 17, 0.5);
  transform: rotate(-6deg); box-shadow: 0 0 22px rgba(120, 118, 110, 0.3);
}
.ep-copy { max-width: 660px; margin: 34px auto 0; text-align: center; animation: ep-copy-in 1s ease 0.25s both; }
.ep-copy p { line-height: 2.2; font-size: 1.05rem; color: #cfc9ba; margin: 0 0 0.8em; }
.grey-hint { display: block; margin: 22px 0 6px; color: rgba(154, 122, 85, 0.32); font-size: 0.78rem; letter-spacing: 0.14em; text-decoration: none; cursor: pointer; transition: color 0.5s ease, text-shadow 0.5s ease; }
.grey-hint:hover { color: rgba(224, 178, 92, 0.9); text-shadow: 0 0 14px rgba(224, 178, 92, 0.35); }
.ep-copy .btn-flat { margin-top: 14px; }
@keyframes ep-in { from { opacity: 0; transform: scale(1.035); } to { opacity: 1; transform: scale(1); } }
@keyframes ep-copy-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 720px) {
  .ep-hero { aspect-ratio: 16 / 9; }
  .ep-cap { left: 20px; bottom: 18px; }
  .ep-seal { width: 50px; height: 50px; font-size: 26px; top: 14px; right: 14px; }
}
</style>

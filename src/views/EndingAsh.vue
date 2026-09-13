<template>
  <section class="ending-page ending-grey">
    <div class="ep-art"><img :src="art" alt="" /><span class="ep-seal seal-grey">焚</span></div>
    <div class="ep-copy">
      <p class="ep-kicker">结账 · 账已焚</p>
      <h2>账已焚</h2>
      <p>账焚尽了。他看了很久，什么也没说。</p>
      <p>灰里还留着字痕。有些字，是烧不掉的。</p>
      <RouterLink class="grey-hint" to="/strike-zero">账烧不干净的那一笔，在灰里也看得见。</RouterLink>
      <button class="btn-flat" @click="restart">重新调阅</button>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import game from '../stores/game'

const router = useRouter()
const art = '/img/ending-ash.webp'
function restart() { game.reset(); router.push('/') }
</script>

<style scoped>
.ending-page { max-width: 860px; margin-top: 22px; border-radius: 6px; padding: 44px 40px; position: relative; overflow: hidden; }
.ending-page h2 { font-size: 34px; margin: 0 0 16px; letter-spacing: 12px; }
.ending-page p { line-height: 2; margin: 0 0 0.7em; }
.ep-art { float: right; width: 220px; margin: 0 0 16px 26px; position: relative; border: 1px solid rgba(150, 145, 130, 0.35); }
.ep-art img { width: 100%; display: block; filter: grayscale(0.3) sepia(0.15) contrast(1.03) brightness(0.86); }
.ep-seal { position: absolute; right: 10px; bottom: 10px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-family: "Ma Shan Zheng", serif; font-size: 22px; border-radius: 4px; transform: rotate(-6deg); }
.ep-kicker { font-size: 0.78rem; letter-spacing: 0.34em; color: #7d7869; }
.ending-grey { border: 1px solid rgba(150, 145, 130, 0.35); background: linear-gradient(170deg, rgba(30, 29, 26, 0.9), rgba(14, 13, 12, 0.96)); }
.ending-grey h2 { color: #b9b4a5; }
.ending-grey p { color: #cfc9ba; }
.seal-grey { border: 2px solid rgba(150, 145, 130, 0.7); color: #cfc7b4; background: rgba(20, 19, 17, 0.6); }
.grey-hint { display: block; margin: 20px 0 6px; color: rgba(154, 122, 85, 0.32); font-size: 0.78rem; letter-spacing: 0.14em; text-decoration: none; cursor: pointer; transition: color 0.5s ease, text-shadow 0.5s ease; }
.grey-hint:hover { color: rgba(224, 178, 92, 0.9); text-shadow: 0 0 14px rgba(224, 178, 92, 0.35); }
</style>

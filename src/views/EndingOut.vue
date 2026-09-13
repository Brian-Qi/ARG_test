<template>
  <section class="ending-page ending-good">
    <div class="ep-art"><img :src="art" alt="" /><span class="ep-seal seal-gold">还</span></div>
    <div class="ep-copy">
      <p class="ep-kicker">结账 · 五人出账</p>
      <h2>五人出账</h2>
      <p>五个零回到姓名与年龄。五双小鞋，一双一双消失了。</p>
      <p>第六位一直没有等到人——沈怀仁自己坐了进去，用他自己的魂，续他自己的命。</p>
      <p class="ep-tag">从此年年初五，他都醒着。永生，是他自己给自己的。</p>
      <button class="btn-flat" @click="restart">重新调阅</button>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import game from '../stores/game'

const router = useRouter()
const art = '/img/ending-out.webp'
function restart() { game.reset(); router.push('/') }
</script>

<style scoped>
.ending-page { max-width: 860px; margin-top: 22px; border-radius: 6px; padding: 34px 36px; position: relative; overflow: hidden; }
.ending-page h2 { font-size: 34px; margin: 0 0 14px; letter-spacing: 6px; }
.ending-page p { line-height: 2; margin: 0 0 0.7em; }
.ep-art { float: right; width: 220px; margin: 0 0 16px 26px; position: relative; border: 1px solid rgba(201, 162, 90, 0.5); }
.ep-art img { width: 100%; display: block; filter: sepia(0.28) contrast(1.04) brightness(0.92); }
.ep-seal { position: absolute; right: 10px; bottom: 10px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-family: "Ma Shan Zheng", serif; font-size: 22px; border-radius: 4px; transform: rotate(-6deg); }
.ep-kicker { font-size: 0.78rem; letter-spacing: 0.34em; color: #a98f5c; }
.ending-good { border: 1px solid rgba(201, 162, 90, 0.5); background: linear-gradient(160deg, rgba(48, 38, 22, 0.94), rgba(22, 17, 10, 0.97)); box-shadow: 0 0 44px rgba(201, 162, 90, 0.14) inset; }
.ending-good h2 { color: #f0c884; text-shadow: 0 0 24px rgba(240, 200, 132, 0.35); }
.ending-good p { color: #e3d2ad; }
.ending-good .ep-tag { color: #f0d9a8; }
.seal-gold { border: 2px solid #c9a25a; color: #f0c884; background: rgba(24, 16, 6, 0.6); }
</style>

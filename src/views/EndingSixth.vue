<template>
  <section class="ending-page ending-bad">
    <div class="ep-art"><img :src="art" alt="" /><span class="ep-seal seal-red">签</span></div>
    <div class="ep-copy">
      <p class="ep-kicker">结账 · 第六位</p>
      <h2>第六位</h2>
      <p>沈砚秋走出来了。</p>
      <p>财签自动卷起，变成一张旧合影——五个孩子并排站着，旁边的空位里，是你。</p>
      <p class="ep-tag">第六位收件人已签收。</p>
      <button class="btn-flat" @click="restart">重新调阅</button>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import game from '../stores/game'

const router = useRouter()
const art = '/img/ending-sixth.webp'   // 绑定 src，避免构建期要求文件存在
function restart() { game.reset(); router.push('/') }
</script>

<style scoped>
.ending-page { max-width: 860px; margin-top: 22px; border-radius: 6px; padding: 34px 36px; position: relative; overflow: hidden; }
.ending-page h2 { font-size: 34px; margin: 0 0 14px; letter-spacing: 6px; }
.ending-page p { line-height: 2; margin: 0 0 0.7em; }
.ep-art { float: right; width: 220px; margin: 0 0 16px 26px; position: relative; border: 1px solid rgba(157, 40, 26, 0.4); }
.ep-art img { width: 100%; display: block; filter: sepia(0.25) contrast(1.05) brightness(0.9); }
.ep-seal { position: absolute; right: 10px; bottom: 10px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-family: "Ma Shan Zheng", serif; font-size: 22px; border-radius: 4px; transform: rotate(-6deg); }
.ep-kicker { font-size: 0.78rem; letter-spacing: 0.34em; color: #9c7c55; }
.ending-bad { border: 1px solid rgba(209, 52, 36, 0.6); background: linear-gradient(160deg, rgba(46, 12, 8, 0.96), rgba(16, 6, 4, 0.98)); box-shadow: 0 0 40px rgba(168, 41, 28, 0.25) inset; }
.ending-bad h2 { color: #d13424; text-shadow: 0 0 26px rgba(209, 52, 36, 0.5); }
.ending-bad p { color: #e6d3b4; }
.ending-bad .ep-tag { color: #ff9a86; letter-spacing: 0.16em; }
.seal-red { border: 2px solid #d13424; color: #d13424; background: rgba(20, 4, 3, 0.6); }
</style>

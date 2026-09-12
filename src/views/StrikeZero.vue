<template>
  <section class="page-wrap strike-page">
    <!-- 物证：倒走的钟 / 火中账页 -->
    <div class="strike-art" aria-hidden="true"><img src="/img/strike_zero.webp" alt="" /></div>

    <template v-if="phase === 'rewind'">
      <p class="eyebrow">账房 / 初五 · 子正</p>
      <h1>你把账烧了。</h1>
      <p class="strike-intro">他看了很久，什么也没说。火灭下去的时候，你知道这段账不该就这样清清白白地结束。</p>
      <div class="strike-reel" :class="{ glitching: glitch }">
        <div class="reel-line"><span>章</span><b>{{ timeLeft.chapter }}</b><small>正往回翻</small></div>
        <div class="reel-line"><span>日</span><b>{{ timeLeft.day }}</b><small>一点一点倒退</small></div>
        <div class="reel-line"><span>刻</span><b>{{ timeLeft.stroke }}</b><small>退回子正之前</small></div>
      </div>
      <p class="strike-whisper">账烧干净的那一笔，在灰里也看得见。</p>
    </template>

    <template v-else-if="phase === 'zero'">
      <div class="zero-screen">
        <img class="zero-eye" src="/img/strike_zero.webp" alt="" />
        <p class="zero-line">第零笔：谁把门锁上？</p>
        <p class="zero-sub">五个孩子不再数数。万和号的后间，还亮着。</p>
        <button @click="restart">重新调阅</button>
        <small class="zero-foot">这一页，你烧不掉了。</small>
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import game from '../stores/game'

const phase = ref('rewind')
const day = ref(5)
const stroke = ref(23 * 60 + 47) // 初五 23:47
const glitch = ref(false)
let timer = null
let jam = null

const timeLeft = computed(() => ({
  chapter: Math.max(1, 7),
  day: String(day.value).padStart(2, '0'),
  stroke: String(Math.floor(stroke.value / 60)).padStart(2, '0') + ':' + String(stroke.value % 60).padStart(2, '0')
}))

function rewind() {
  // 快速倒带：每帧倒退多个刻度，先快后慢，几秒内冲到尽头
  let step = 60
  timer = setInterval(() => {
    stroke.value -= step
    step += 40 // 加速
    if (stroke.value < 0) {
      if (day.value > 1) {
        day.value -= 1
        stroke.value = 23 * 60 + 59
      } else {
        stroke.value = 0
      }
    }
    // 快到尽头：减速并定格，随即切黑屏
    if (day.value <= 4 && stroke.value <= 30) {
      clearInterval(timer)
      timer = null
      glitch.value = true
      jam = setTimeout(() => {
        phase.value = 'zero'
      }, 260)
    }
  }, 30)
}

function stopTimer() {
  if (timer) clearInterval(timer)
  if (jam) clearTimeout(jam)
}

function restart() {
  game.reset()
  stopTimer()
  phase.value = 'rewind'
  glitch.value = false
  day.value = 5
  stroke.value = 23 * 60 + 47
  rewind()
}

onMounted(() => {
  rewind()
})

onBeforeUnmount(() => {
  stopTimer()
})
</script>

<style scoped>
.strike-page { max-width: 820px; }
.strike-art {
  position: absolute; inset: 0; z-index: 0;
  display: grid; place-items: center;
  pointer-events: none; opacity: 0.26; mix-blend-mode: screen;
}
.strike-art img { width: min(460px, 92%); border-radius: 4px; filter: saturate(0.9) brightness(0.88); }
.strike-intro { color: #b09a72; max-width: 36em; }
.strike-reel {
  margin-top: 1.8rem;
  border: 1px solid rgba(138, 111, 77, 0.4);
  background: rgba(15, 10, 7, 0.9);
  padding: 1.2rem 1.4rem;
  max-width: 460px;
}
.reel-line {
  display: grid; grid-template-columns: 2.4rem 1fr auto;
  gap: 0.6rem 1.2rem; align-items: baseline;
  padding: 0.5rem 0;
  border-bottom: 1px dashed rgba(138, 111, 77, 0.25);
}
.reel-line:last-child { border-bottom: 0; }
.reel-line span { font-size: 0.72rem; letter-spacing: 0.3em; color: #9c7c55; }
.reel-line b { font-family: var(--kai); font-weight: 400; font-size: 1.3rem; color: #e3cf9f; }
.reel-line small { font-size: 0.7rem; color: #6b5538; letter-spacing: 0.08em; }
/* 阶段定格：故障闪烁 */
.strike-reel { transition: opacity 0.15s ease; }
.strike-reel.glitching { animation: static-jitter 0.14s steps(2) infinite; }
.strike-reel.glitching .reel-line b {
  color: var(--blood-bright);
  text-shadow: 0 0 10px rgba(168, 41, 28, 0.6);
}
@keyframes static-jitter {
  0% { transform: translateX(0); opacity: 1; }
  50% { transform: translateX(-3px); opacity: 0.55; }
  100% { transform: translateX(2px); opacity: 0.85; }
}
@media (prefers-reduced-motion: reduce) {
  .strike-reel.glitching { animation: none; }
}
.strike-whisper {
  margin-top: 1.6rem; color: #7a5233; font-size: 0.82rem;
  letter-spacing: 0.12em; opacity: 0.72;
}
.zero-screen {
  text-align: center; padding: 3rem 0 2rem;
}
.zero-eye {
  width: min(380px, 88%); border-radius: 4px;
  filter: saturate(0.9) brightness(0.86) contrast(1.08);
  box-shadow: 0 0 70px rgba(0, 0, 0, 0.7);
  opacity: 0.9;
}
.zero-line {
  margin-top: 1.8rem; font-size: 1.8rem; color: var(--blood-bright);
  font-family: var(--kai); text-shadow: 0 0 24px rgba(168, 41, 28, 0.45);
}
.zero-sub { margin-top: 0.5rem; color: #b09a72; font-size: 0.86rem; }
.zero-screen button { margin-top: 1.6rem; }
.zero-foot { display: block; margin-top: 1.1rem; color: #7a5b36; font-size: 0.74rem; letter-spacing: 0.12em; }
</style>

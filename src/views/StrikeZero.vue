<template>
  <section class="strike-page" :class="[phase, { glitch }]">
    <template v-if="phase === 'rewind'">
      <div class="sz-content">
        <p class="sz-eyebrow">账房 · 倒流</p>

        <div class="sz-clock">
          <span class="sz-day">{{ dayLabel }}</span>
          <b class="sz-time">{{ clock }}</b>
          <span class="sz-chap">第 {{ chapter }} 章</span>
        </div>

        <h1 class="sz-title">你把账烧了。</h1>
        <p class="sz-intro">他看了很久，什么也没说。火灭下去的时候，你知道这段账不该就这样清清白白地结束。</p>
        <p class="sz-whisper">账烧干净的那一笔，在灰里也看得见。</p>
      </div>
    </template>

    <template v-else-if="phase === 'zero'">
      <div class="zero-screen">
        <img class="zero-eye" :src="art" alt="" />
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

const art = '/img/strike_zero.webp'   // 绑定 src，避免构建期要求文件存在
const phase = ref('rewind')
const glitch = ref(false)
const absMin = ref(5 * 1440 + 23 * 60 + 47)   // 初五 23:47
let raf = null
let jam = null

const START = 5 * 1440 + 23 * 60 + 47
const END = 1 * 1440                            // 初一 子正
const DURATION = 10000                          // 倒流总时长(ms)

const DAY_CN = { 1: '初一', 2: '初二', 3: '初三', 4: '初四', 5: '初五', 6: '初六' }

const clock = computed(() => {
  const m = ((Math.floor(absMin.value) % 1440) + 1440) % 1440
  return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0')
})
const dayLabel = computed(() => DAY_CN[Math.max(1, Math.floor(absMin.value / 1440))] || '初一')
const chapter = computed(() => Math.max(1, Math.floor(absMin.value / 1440) + 2))

function runRewind() {
  const t0 = performance.now()
  const step = (t) => {
    const p = Math.min(1, (t - t0) / DURATION)
    const eased = p * p * p                      // 越来越快（起步慢、后段飞）
    absMin.value = START - eased * (START - END)
    if (p < 1) {
      raf = requestAnimationFrame(step)
    } else {
      glitch.value = true
      jam = setTimeout(() => {
        phase.value = 'zero'
        glitch.value = false
      }, 320)
    }
  }
  raf = requestAnimationFrame(step)
}

function stopTimer() {
  if (raf) cancelAnimationFrame(raf)
  if (jam) clearTimeout(jam)
  raf = null
  jam = null
}

function restart() {
  game.reset()
  stopTimer()
  phase.value = 'rewind'
  glitch.value = false
  absMin.value = START
  runRewind()
}

function enter() {
  document.documentElement.classList.add('strike-bg')
  runRewind()
}
function leave() {
  document.documentElement.classList.remove('strike-bg')
  stopTimer()
}

onMounted(enter)
onBeforeUnmount(leave)
</script>

<style scoped>
.strike-page {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: none;
  min-height: 78vh;
  background: transparent;
}
.strike-page.glitch { animation: static-jitter 0.12s steps(2) infinite; }
@keyframes static-jitter {
  0% { transform: translateX(0); }
  50% { transform: translateX(-3px); }
  100% { transform: translateX(2px); }
}

/* ---------- 内容 ---------- */
.sz-content {
  position: relative; z-index: 1;
  flex: 1; min-height: 78vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 3.4rem 1.6rem 2.6rem; text-align: center;
}
.sz-eyebrow {
  margin: 0 0 0.4rem;
  font-size: 0.74rem; letter-spacing: 0.5em; color: var(--blood-bright);
  text-shadow: 0 0 12px rgba(168, 41, 28, 0.7), 0 1px 6px rgba(0, 0, 0, 0.95);
}
.sz-clock { margin: 0; }
.sz-day {
  display: block; font-size: 1.05rem; letter-spacing: 0.5em; color: var(--blood-bright);
  margin-bottom: 2px; text-shadow: 0 0 14px rgba(168, 41, 28, 0.7), 0 1px 8px rgba(0, 0, 0, 0.95);
}
.sz-time {
  display: block; font-family: var(--kai, var(--serif, serif));
  font-weight: 600; line-height: 1.02;
  font-size: clamp(3.6rem, 14vw, 7.4rem); letter-spacing: 0.06em;
  color: var(--blood-bright);
  text-shadow: 0 0 46px rgba(209, 52, 36, 0.65), 0 0 14px rgba(168, 41, 28, 0.6), 0 3px 12px rgba(0, 0, 0, 0.95);
  font-variant-numeric: tabular-nums;
}
.sz-chap { display: block; font-size: 0.82rem; letter-spacing: 0.44em; color: var(--blood-bright); margin-top: 6px; text-shadow: 0 0 14px rgba(168, 41, 28, 0.7), 0 1px 8px rgba(0, 0, 0, 0.95); }

.sz-title {
  margin: 30px 0 0;
  font-size: 1.5rem; color: #ffe3b0;
  text-shadow: 0 0 22px rgba(255, 120, 30, 0.5), 0 2px 8px rgba(0, 0, 0, 0.85);
}
.sz-intro { max-width: 32em; margin: 14px auto 0; color: #e8cca4; line-height: 1.9; font-size: 0.94rem; text-shadow: 0 1px 8px rgba(0, 0, 0, 0.85); }
.sz-whisper {
  margin: 24px auto 0; color: #ffb85c; font-size: 0.84rem; letter-spacing: 0.16em;
  opacity: 0.92; text-shadow: 0 0 14px rgba(255, 110, 20, 0.4), 0 1px 6px rgba(0, 0, 0, 0.85);
}
.strike-page.glitch .sz-time { color: var(--blood-bright); text-shadow: 0 0 30px rgba(209, 52, 36, 0.7); }

/* ---------- 第零笔 ---------- */
.zero-screen { position: relative; z-index: 1; text-align: center; padding: 3rem 0 2rem; }
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

@media (prefers-reduced-motion: reduce) {
  .strike-page.glitch { animation: none; }
}
</style>

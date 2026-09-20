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
      <div class="zero-stage">
        <div class="zero-inner">
          <span class="zero-seal">零</span>
          <p class="zero-kicker">结账 · 第零笔</p>
          <h2 class="zero-title">第零笔</h2>
          <p class="zero-q">谁把门锁上？</p>

          <div class="zero-lines">
            <p>五个孩子不再数数。万和号的后间，还亮着。</p>
            <p>火把账烧回了头一天，却烧不到头一天的前一夜。</p>
            <p>那一页上没有账，只有一把锁——从外面锁上的。</p>
          </div>

          <RouterLink class="btn-flat" to="/" @click="reset">重新调阅</RouterLink>
          <small class="zero-foot">这一页，你烧不掉了。</small>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import game from '../stores/game'

const phase = ref('rewind')
const glitch = ref(false)
const absMin = ref(5 * 1440 + 23 * 60 + 47) // 初五 23:47
let raf = null
let jam = null

const START = 5 * 1440 + 23 * 60 + 47
const END = 1 * 1440 // 初一 子正
const DURATION = 10000 // 倒流总时长(ms)

const DAY_CN = { 1: '初一', 2: '初二', 3: '初三', 4: '初四', 5: '初五', 6: '初六' }

const clock = computed(() => {
  const m = ((Math.floor(absMin.value) % 1440) + 1440) % 1440
  return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0')
})
const dayLabel = computed(() => DAY_CN[Math.max(1, Math.floor(absMin.value / 1440))] || '初一')
const chapter = computed(() => Math.max(1, Math.floor(absMin.value / 1440) + 2))

// 整页背景：倒流段用「羊皮纸/火焰」，定格段换成「后间木门」
watch(phase, (p) => {
  const el = document.documentElement
  el.classList.toggle('strike-bg', p === 'rewind')
  el.classList.toggle('zero-bg', p === 'zero')
})

function runRewind() {
  const t0 = performance.now()
  const step = (t) => {
    const p = Math.min(1, (t - t0) / DURATION)
    const eased = p * p * p // 越来越快（起步慢、后段飞）
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

function reset() {
  game.reset()
}

function enter() {
  // 尊重「减弱动效」：跳过 10s 倒流，直接落到定格屏（phase 变化由 watcher 切换背景类）
  if (game.reduceMotion()) {
    phase.value = 'zero'
    return
  }
  document.documentElement.classList.add('strike-bg')
  runRewind()
}
function leave() {
  document.documentElement.classList.remove('strike-bg', 'zero-bg')
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
.strike-page.glitch {
  animation: static-jitter 0.12s steps(2) infinite;
}
@keyframes static-jitter {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-3px);
  }
  100% {
    transform: translateX(2px);
  }
}

/* ================= 倒流段 ================= */
.sz-content {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 78vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.4rem 1.6rem 2.6rem;
  text-align: center;
}
.sz-eyebrow {
  margin: 0 0 0.4rem;
  font-family: 'Zhi Mang Xing', 'Liu Jian Mao Cao', 'Ma Shan Zheng', 'KaiTi', serif;
  font-size: 0.9rem;
  letter-spacing: 0.4em;
  color: var(--blood-bright);
  text-shadow:
    0 0 12px rgba(168, 41, 28, 0.7),
    0 1px 6px rgba(0, 0, 0, 0.95);
}
.sz-clock {
  margin: 0;
}
.sz-day {
  display: block;
  font-family: 'Zhi Mang Xing', 'Liu Jian Mao Cao', 'Ma Shan Zheng', 'KaiTi', serif;
  font-size: 1.4rem;
  letter-spacing: 0.4em;
  color: var(--blood-bright);
  margin-bottom: 2px;
  text-shadow:
    0 0 14px rgba(168, 41, 28, 0.7),
    0 1px 8px rgba(0, 0, 0, 0.95);
}
.sz-time {
  display: block;
  font-family: 'Zhi Mang Xing', 'Liu Jian Mao Cao', 'Ma Shan Zheng', 'KaiTi', serif;
  font-weight: 400;
  line-height: 1.02;
  font-size: clamp(3.6rem, 14vw, 7.4rem);
  letter-spacing: 0.06em;
  color: var(--blood-bright);
  text-shadow:
    0 0 46px rgba(209, 52, 36, 0.65),
    0 0 14px rgba(168, 41, 28, 0.6),
    0 3px 12px rgba(0, 0, 0, 0.95);
  font-variant-numeric: tabular-nums;
}
.sz-chap {
  display: block;
  font-family: 'Zhi Mang Xing', 'Liu Jian Mao Cao', 'Ma Shan Zheng', 'KaiTi', serif;
  font-size: 0.95rem;
  letter-spacing: 0.38em;
  color: var(--blood-bright);
  margin-top: 6px;
  text-shadow:
    0 0 14px rgba(168, 41, 28, 0.7),
    0 1px 8px rgba(0, 0, 0, 0.95);
}

.sz-title {
  margin: 30px 0 0;
  font-size: 1.5rem;
  color: #ffe3b0;
  text-shadow:
    0 0 22px rgba(255, 120, 30, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.85);
}
.sz-intro {
  max-width: 32em;
  margin: 14px auto 0;
  color: #e8cca4;
  line-height: 1.9;
  font-size: 0.94rem;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.85);
}
.sz-whisper {
  margin: 24px auto 0;
  color: #ffb85c;
  font-size: 0.84rem;
  letter-spacing: 0.16em;
  opacity: 0.92;
  text-shadow:
    0 0 14px rgba(255, 110, 20, 0.4),
    0 1px 6px rgba(0, 0, 0, 0.85);
}
.strike-page.glitch .sz-time {
  color: var(--blood-bright);
  text-shadow: 0 0 30px rgba(209, 52, 36, 0.7);
}

/* ================= 第零笔 · 定格结局屏 ================= */
.zero-stage {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: calc(100vh - 110px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
}
.zero-inner {
  position: relative;
  z-index: 1;
  max-width: 640px;
  text-align: center;
  animation: zero-in 1.1s ease both;
}
.zero-seal {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 64px;
  height: 64px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Ma Shan Zheng', 'KaiTi', serif;
  font-size: 34px;
  border: 2px solid var(--blood);
  color: var(--blood-bright);
  background: rgba(20, 4, 3, 0.5);
  transform: rotate(-6deg);
  box-shadow: 0 0 26px rgba(168, 41, 28, 0.45);
  animation: zero-seal-in 0.7s cubic-bezier(0.2, 1.4, 0.4, 1) 0.5s both;
}
.zero-kicker {
  margin: 0 0 4px;
  font-family: 'Zhi Mang Xing', 'Liu Jian Mao Cao', 'Ma Shan Zheng', 'KaiTi', serif;
  font-size: 1rem;
  letter-spacing: 0.44em;
  color: var(--blood-bright);
  text-shadow:
    0 0 14px rgba(168, 41, 28, 0.7),
    0 1px 8px rgba(0, 0, 0, 0.95);
}
.zero-title {
  margin: 0 0 10px;
  font-family: 'Zhi Mang Xing', 'Liu Jian Mao Cao', 'Ma Shan Zheng', 'KaiTi', serif;
  font-weight: 400;
  font-size: clamp(3rem, 12vw, 6.4rem);
  line-height: 1.02;
  letter-spacing: 0.08em;
  color: var(--blood-bright);
  text-shadow:
    0 0 52px rgba(209, 52, 36, 0.7),
    0 0 16px rgba(168, 41, 28, 0.6),
    0 3px 14px rgba(0, 0, 0, 0.95);
}
.zero-q {
  margin: 0 0 1.6rem;
  font-family: 'Zhi Mang Xing', 'Liu Jian Mao Cao', 'Ma Shan Zheng', 'KaiTi', serif;
  font-size: clamp(1.4rem, 4.4vw, 2.2rem);
  letter-spacing: 0.16em;
  color: #ff6a4a;
  text-shadow:
    0 0 24px rgba(209, 52, 36, 0.6),
    0 2px 10px rgba(0, 0, 0, 0.95);
}
.zero-lines {
  max-width: 34em;
  margin: 0 auto;
}
.zero-lines p {
  color: #dcc8a4;
  line-height: 2.1;
  font-size: 0.98rem;
  margin: 0 0 0.5em;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.9);
}
.zero-inner .btn-flat {
  margin-top: 1.6rem;
}
.zero-foot {
  display: block;
  margin-top: 1.1rem;
  color: #9a7b52;
  font-size: 0.76rem;
  letter-spacing: 0.14em;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.9);
}

@keyframes zero-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes zero-seal-in {
  from {
    opacity: 0;
    transform: rotate(-6deg) scale(0.35);
  }
  to {
    opacity: 1;
    transform: rotate(-6deg) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .strike-page.glitch,
  .zero-inner,
  .zero-seal {
    animation: none;
  }
}
@media (max-width: 720px) {
  .zero-seal {
    width: 50px;
    height: 50px;
    font-size: 26px;
    top: -4px;
    right: -4px;
  }
}
</style>

<template>
  <section class="strike-page" :class="[phase, { glitch }]">
    <template v-if="phase === 'rewind'">
      <!-- 背景：上半羊皮纸 / 下半火焰 -->
      <div class="sz-bg" aria-hidden="true">
        <div class="sz-parch"></div>
        <div class="sz-burn"></div>
        <div class="sz-fire">
          <i v-for="n in 42" :key="n" :style="flameStyle(n)"></i>
        </div>
        <div class="sz-seam"></div>
        <div class="sz-vignette"></div>
      </div>

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

// 火焰：按序号散列出色高/时长/左右，避免每次渲染乱跳
function flameStyle(n) {
  const r1 = Math.abs((Math.sin(n * 12.9898) * 43758.5453) % 1)
  const r2 = Math.abs((Math.sin(n * 78.233) * 12543.21) % 1)
  return {
    left: (r1 * 100).toFixed(1) + '%',
    height: (24 + r1 * 96).toFixed(0) + 'px',
    animationDuration: (0.8 + r2 * 1.5).toFixed(2) + 's',
    animationDelay: (-r2 * 1.6).toFixed(2) + 's',
  }
}

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

onMounted(runRewind)
onBeforeUnmount(stopTimer)
</script>

<style scoped>
.strike-page {
  position: relative;
  max-width: none;
  min-height: 78vh;
  overflow: hidden;
  border-radius: 6px;
  isolation: isolate;
}
.strike-page.glitch { animation: static-jitter 0.12s steps(2) infinite; }
@keyframes static-jitter {
  0% { transform: translateX(0); }
  50% { transform: translateX(-3px); }
  100% { transform: translateX(2px); }
}

/* ---------- 背景 ---------- */
.sz-bg { position: absolute; inset: 0; z-index: 0; }
.sz-parch {
  position: absolute; left: 0; right: 0; top: 0; bottom: 46%;
  background:
    radial-gradient(120% 90% at 28% 18%, rgba(122, 84, 30, 0.22), transparent 58%),
    radial-gradient(90% 80% at 82% 72%, rgba(92, 60, 18, 0.30), transparent 68%),
    radial-gradient(60% 40% at 50% 4%, rgba(255, 246, 214, 0.35), transparent 70%),
    linear-gradient(180deg, #cbb387 0%, #d8c69a 52%, #b3985f 100%);
}
.sz-parch::after {
  content: ""; position: absolute; inset: 0;
  background-image: repeating-radial-gradient(circle at 22% 34%, rgba(88, 58, 18, 0.07) 0 1px, transparent 1px 6px);
  opacity: 0.7;
}
.sz-burn {
  position: absolute; left: 0; right: 0; bottom: 46%; height: 14%;
  background: linear-gradient(0deg, rgba(38, 12, 3, 0.92), rgba(110, 54, 8, 0.45) 42%, transparent);
}
.sz-fire {
  position: absolute; left: 0; right: 0; bottom: 0; height: 50%;
  background:
    radial-gradient(72% 104% at 50% 104%, #ffe08a 0%, #ffb028 15%, #ff7a12 33%, #e23c08 55%, #8c1c04 79%, #240802 100%);
  animation: fire-shift 2.2s ease-in-out infinite alternate;
  overflow: hidden;
}
.sz-fire i {
  position: absolute; bottom: -6px; width: 16px;
  background: linear-gradient(0deg, #ffe6a0, #ff8a1e 52%, rgba(255, 70, 0, 0));
  border-radius: 50% 50% 22% 22% / 72% 72% 28% 28%;
  filter: blur(3px); opacity: 0.85; transform-origin: bottom center;
  animation-name: flame-lift; animation-timing-function: ease-in-out; animation-iteration-count: infinite; animation-direction: alternate;
}
@keyframes flame-lift {
  from { transform: translateY(8px) scaleY(0.92); opacity: 0.45; }
  to { transform: translateY(-18px) scaleY(1.18); opacity: 0.95; }
}
@keyframes fire-shift {
  from { filter: brightness(0.94) saturate(1.02); }
  to { filter: brightness(1.14) saturate(1.14); }
}
.sz-seam {
  position: absolute; left: 0; right: 0; bottom: 47%; height: 3px;
  background: linear-gradient(90deg, transparent, #ffca6a, transparent);
  box-shadow: 0 0 26px rgba(255, 140, 40, 0.75);
}
.sz-vignette {
  position: absolute; inset: 0; pointer-events: none;
  box-shadow: inset 0 0 140px rgba(10, 4, 0, 0.6);
}

/* ---------- 内容 ---------- */
.sz-content {
  position: relative; z-index: 1;
  max-width: 820px; margin: 0 auto;
  padding: 44px 28px 52px;
}
.sz-eyebrow {
  margin: 0; text-align: center;
  font-size: 0.74rem; letter-spacing: 0.5em; color: #6b4a22;
}
.sz-clock { text-align: center; margin: 6px 0 4px; }
.sz-day {
  display: block; font-size: 1.05rem; letter-spacing: 0.5em; color: #5a3a18;
  margin-bottom: 2px;
}
.sz-time {
  display: block; font-family: var(--kai, var(--serif, serif));
  font-weight: 600; line-height: 1.02;
  font-size: clamp(3.4rem, 13vw, 6.6rem); letter-spacing: 0.06em;
  color: #33200c;
  text-shadow: 0 1px 0 rgba(255, 250, 230, 0.4), 0 0 34px rgba(255, 150, 50, 0.35);
  font-variant-numeric: tabular-nums;
}
.sz-chap { display: block; font-size: 0.82rem; letter-spacing: 0.44em; color: #6b4a22; margin-top: 4px; }

.sz-title {
  text-align: center; margin: 26px 0 0;
  font-size: 1.5rem; color: #ffdca6;
  text-shadow: 0 0 22px rgba(255, 120, 30, 0.5), 0 2px 6px rgba(0, 0, 0, 0.7);
}
.sz-intro { max-width: 34em; margin: 12px auto 0; text-align: center; color: #e7c79a; line-height: 1.9; font-size: 0.94rem; }
.sz-whisper {
  margin: 22px auto 0; text-align: center;
  color: #ffce7a; font-size: 0.84rem; letter-spacing: 0.16em; opacity: 0.85;
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
  .strike-page.glitch, .sz-fire, .sz-fire i { animation: none; }
}
</style>

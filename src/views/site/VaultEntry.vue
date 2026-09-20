<template>
  <div class="vault-entry" :class="rootClass">
    <div class="ve-overlay ve-overlay-mid" :style="{ opacity: midOpacity }" aria-hidden="true"></div>
    <div class="ve-overlay ve-overlay-dark" :style="{ opacity: darkOpacity }" aria-hidden="true"></div>
    <div v-if="flash" class="ve-flash" aria-hidden="true"></div>

    <div class="ve-panel">
      <span class="ve-kicker">{{ kicker }}</span>
      <h1 class="ve-title" :class="{ glitch: corrupt }">{{ heading }}</h1>
      <p class="ve-body">{{ body }}</p>

      <div class="ve-bar" :class="{ indet: stage === 'read', blood: corrupt }">
        <i :style="stage === 'progress' ? { width: progress + '%' } : {}"></i>
      </div>
      <div class="ve-meta">
        <span>{{ meta }}</span>
        <b>{{ stage === 'read' ? '···' : Math.floor(progress) + '%' }}</b>
      </div>

      <RouterLink v-if="!corrupt" to="/collection/HZ-1927-0512" class="ve-cancel">返回公开目录</RouterLink>
      <span v-else class="ve-cancel dead">已无法返回</span>
    </div>

    <div class="ve-scan" aria-hidden="true" :style="{ opacity: corrupt ? 0.5 : 0 }"></div>
    <div class="ve-noise" aria-hidden="true" :style="{ opacity: corrupt ? 0.32 : 0 }"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import game, { seenHidden, shenSearched } from '../../stores/game'
import { familyUnlocked } from '../../stores/archive-notify'

const router = useRouter()

const progress = ref(0)
const stage = ref('read')   // read | progress
const pass = ref(1)
const flash = ref(false)
let tick = null
let timer = null

const corrupt = computed(() => stage.value === 'progress' && progress.value > 38)
const dark = computed(() => stage.value === 'progress' && progress.value > 62)
const rootClass = computed(() => ({ corrupt: corrupt.value, dark: dark.value }))

// 整屏崩坏：两层全屏遮罩随进度淡入（用 opacity，可平滑过渡；渐变本身无法过渡）
const midOpacity = computed(() => stage.value === 'progress' ? Math.max(0, Math.min(1, (progress.value - 16) / 44)) : 0)
const darkOpacity = computed(() => stage.value === 'progress' ? Math.max(0, Math.min(1, (progress.value - 58) / 40)) : 0)

const kicker = computed(() => stage.value === 'read' ? '关联档案 · Restricted' : '保管库 · 正在接管')
const heading = computed(() => {
  if (stage.value === 'read') return '正在调阅关联档案…'
  if (progress.value > 72) return '正在切换…到…后…间…'
  return '正在切换到保管库视图…'
})
const body = computed(() => {
  if (stage.value === 'read') return '馆藏 HZ-1927-0512 著录之外另有一份关联档案，未列入公开目录。正在逐遍校验。'
  if (progress.value > 72) return '著录与影像对不上。保管库的门，是从外面锁上的。'
  return '校验通过。系统正在切换到保管库视图。'
})
const meta = computed(() => {
  if (stage.value === 'read') return `第 ${Math.min(pass.value, 3)} / 3 遍校验…`
  return '载入保管库…'
})

// 读条三遍：原样滑条（ve-slide），每遍 1.15s，共三遍
function runRead() {
  tick = setInterval(() => {
    pass.value += 1
    if (pass.value > 3) {
      clearInterval(tick)
      tick = null
      startProgress()
    }
  }, 1150)
}

// 进度条：随进度崩坏
function startProgress() {
  stage.value = 'progress'
  let p = 0
  timer = setInterval(() => {
    p += 1.2
    progress.value = Math.min(100, p)
    if (p >= 100) {
      clearInterval(timer)
      timer = null
      // 进入 B 面的一瞬：红色闪屏
      flash.value = true
      setTimeout(() => router.replace('/story'), 320)
    }
  }, 24)
}

onMounted(() => {
  // 入口门槛：未满足不触发调阅，直接退回 ARG 根（强行访问 = 走捷径）
  if (!(seenHidden() && familyUnlocked() && shenSearched())) { game.takeShortcut(); router.replace('/'); return }
  if (game.reduceMotion()) { router.replace('/story'); return }
  runRead()
})

onBeforeUnmount(() => {
  if (tick) clearInterval(tick)
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.vault-entry {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background 1.2s ease;
}
/* 尺寸定死：不随文字长短变化 */
.ve-panel {
  width: 560px;
  max-width: 90vw;
  min-height: 320px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  background: #f9f3e4;
  border: 1px solid #e0d2b4;
  border-radius: 6px;
  padding: 40px;
  transition: background 1.1s ease, border-color 1.1s ease, box-shadow 1.1s ease;
  position: relative;
  z-index: 50;
}
.vault-entry.corrupt .ve-panel {
  background: #241612;
  border-color: rgba(157, 40, 26, 0.7);
  box-shadow: 0 0 40px rgba(168, 41, 28, 0.25);
  animation: ve-panel-shake 0.2s steps(2) infinite;
}
.vault-entry.dark .ve-panel {
  background: #0d0906;
  border-color: #a8291c;
  box-shadow: 0 0 70px rgba(168, 41, 28, 0.45), inset 0 0 90px rgba(168, 41, 28, 0.28);
}
@keyframes ve-panel-shake {
  0% { transform: translate(0, 0); }
  50% { transform: translate(-2px, 1px); }
  100% { transform: translate(1px, -1px); }
}
.ve-kicker {
  align-self: center;
  font-size: 12px;
  letter-spacing: 3px;
  color: #8c2f24;
  border: 1px solid rgba(140, 47, 36, 0.4);
  padding: 3px 12px;
  border-radius: 999px;
  transition: color 1.1s ease, border-color 1.1s ease;
}
.vault-entry.corrupt .ve-kicker { color: #d13424; border-color: rgba(209, 52, 36, 0.6); }
.ve-title {
  font-family: "Noto Serif SC", serif;
  font-weight: 600;
  font-size: 22px;
  color: #3c3020;
  letter-spacing: 3px;
  margin: 18px 0 10px;
  min-height: 2.4em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 1.1s ease;
}
.vault-entry.corrupt .ve-title { color: #d9c69a; }
.vault-entry.dark .ve-title { color: #d13424; }
.ve-title.glitch { animation: ve-glitch 0.16s steps(2) infinite; }
@keyframes ve-glitch {
  0% { transform: translate(0, 0); text-shadow: none; }
  50% { transform: translate(-2px, 1px); text-shadow: 2px 0 rgba(209, 52, 36, 0.7), -2px 0 rgba(80, 200, 200, 0.3); }
  100% { transform: translate(2px, -1px); text-shadow: -2px 0 rgba(209, 52, 36, 0.7); }
}
.ve-body {
  color: #6d5f45;
  font-size: 14px;
  line-height: 2;
  margin: 0;
  min-height: 4em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 1.1s ease;
}
.vault-entry.corrupt .ve-body { color: #9c7c55; }
.vault-entry.dark .ve-body { color: #b09a72; }
.ve-bar {
  height: 3px;
  background: #e8dcbe;
  border-radius: 3px;
  overflow: hidden;
  margin: 18px auto 10px;
  width: 260px;
  transition: background 1.1s ease;
}
.vault-entry.corrupt .ve-bar { background: #2a1a14; }
.ve-bar i {
  display: block;
  height: 100%;
  width: 0;
  background: #8c2f24;
  transition: width 0.12s linear, background 1.1s ease;
}
/* 读条阶段：原来那套滑动动画 */
.ve-bar.indet i {
  width: 40%;
  animation: ve-slide 1.15s ease-in-out infinite;
  transition: none;
}
@keyframes ve-slide {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(320%); }
}
.ve-bar.blood i { background: linear-gradient(90deg, #8c2f24, #d13424); box-shadow: 0 0 12px rgba(209, 52, 36, 0.6); }
.ve-meta {
  display: flex; justify-content: space-between; align-items: baseline;
  width: 260px; margin: 0 auto 14px;
  font-size: 12px; letter-spacing: 1px; color: #8a7a5e;
  transition: color 1.1s ease;
}
.vault-entry.corrupt .ve-meta { color: #9c7c55; }
.ve-meta b { color: #8c2f24; font-weight: 600; }
.vault-entry.dark .ve-meta b { color: #d13424; }
.ve-cancel {
  align-self: center;
  font-size: 13px;
  color: #6d5d42;
  text-decoration: none;
}
.ve-cancel:hover { color: #8c2f24; text-decoration: underline; }
.ve-cancel.dead { color: #7a3a2a; letter-spacing: 2px; cursor: not-allowed; }

/* 整屏崩坏遮罩：随进度淡入（覆盖顶栏/页脚/背景） */
.ve-overlay {
  position: fixed; inset: 0; pointer-events: none; z-index: 45;
}
.ve-overlay-mid {
  background: linear-gradient(180deg, #2a1710 0%, #140b07 100%);
}
.ve-overlay-dark {
  background: radial-gradient(circle at 50% 42%, rgba(48, 12, 8, 0.92) 0%, #050302 82%);
}

/* 读条结束的红色闪屏（搬自第 0 页 tv-glitch：暗底 + 横向裂纹花屏） */
.ve-flash {
  position: fixed; inset: 0; z-index: 999; overflow: hidden;
  background: rgba(16, 6, 4, 0.86);
  pointer-events: none;
}
.ve-flash::before,
.ve-flash::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg,
      rgba(255, 130, 110, 0.32) 0 1px, transparent 1px 2px,
      rgba(255, 165, 145, 0.18) 2px 3px, transparent 3px 4px,
      rgba(226, 50, 34, 0.24) 4px 5px, transparent 5px 7px,
      rgba(255, 120, 100, 0.20) 7px 8px, transparent 8px 11px),
    linear-gradient(0deg,
      transparent 0 10%, rgba(200, 28, 16, 0.52) 10% 20%,
      transparent 20% 34%, rgba(255, 150, 128, 0.40) 34% 40%,
      transparent 40% 56%, rgba(180, 20, 12, 0.46) 56% 64%,
      transparent 64% 78%, rgba(255, 135, 112, 0.34) 78% 84%,
      transparent 84% 100%);
  background-size: 100% 300%;
}
.ve-flash::before { animation: ve-glitch-a 0.5s steps(3, end) infinite; }
.ve-flash::after  { animation: ve-glitch-b 0.4s steps(4, end) infinite; animation-delay: -0.2s; }
@keyframes ve-glitch-a {
  0%   { background-position-y: 0%;   transform: translateX(-8px); opacity: .7; }
  50%  { background-position-y: 50%;  transform: translateX(10px); opacity: 1; }
  100% { background-position-y: 100%; transform: translateX(-5px); opacity: .75; }
}
@keyframes ve-glitch-b {
  0%   { background-position-y: 100%; transform: translateX(9px);  opacity: .6; }
  50%  { background-position-y: 40%;  transform: translateX(-12px); opacity: .95; }
  100% { background-position-y: 0%;   transform: translateX(6px);  opacity: .7; }
}

/* 崩坏叠层：扫描线 + 噪点 */
.ve-scan, .ve-noise {
  position: fixed; inset: 0; pointer-events: none; z-index: 55;
  transition: opacity 0.8s ease;
}
.ve-scan {
  background: repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0 1px, transparent 1px 3px);
  mix-blend-mode: multiply;
}
.ve-noise {
  background-image: repeating-radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08) 0 1px, transparent 1px 3px);
  background-size: 200px 200px;
  mix-blend-mode: overlay;
  animation: ve-noise-shift 0.5s steps(3) infinite;
}
@keyframes ve-noise-shift {
  0% { background-position: 0 0; } 50% { background-position: 12px -8px; } 100% { background-position: -9px 7px; }
}
@media (prefers-reduced-motion: reduce) {
  .ve-title.glitch, .ve-noise, .ve-bar.indet i { animation: none; }
}
</style>

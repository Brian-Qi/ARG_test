<template>
  <div class="audio-widget">
    <audio
      ref="audioEl"
      class="tape-audio"
      src="/audio/rec.mp3"
      preload="none"
      @timeupdate="onTime"
      @loadedmetadata="onMeta"
      @ended="onEnd"
      @play="onPlay"
      @pause="onPause"
    ></audio>

    <!-- 一盘整带：后间录音 -->
    <div class="tape-deck">
      <div class="deck-row">
        <button class="deck-play" type="button" :aria-label="playing ? '暂停' : '播放'" @click="toggle">
          {{ playing ? '❚❚' : '▶' }}
        </button>
        <div class="deck-wave" ref="waveEl" @click="seek" :title="'拖动定位'">
          <span
            v-for="(b, i) in peaks" :key="i"
            :class="{ passed: i / (peaks.length - 1) <= progress }"
            :style="{ height: b + '%' }"
          />
          <i class="deck-head" :style="{ left: (progress * 100) + '%' }" />
        </div>
        <b class="deck-time">{{ timeText }}</b>
      </div>
      <div class="deck-meta">
        <span>REC · 后间</span><span>磁带 00:03:47 · 实长 00:17</span>
      </div>
    </div>

    <p class="audio-note">
      六声报数，一声一段；每段底下压着一个男人的耳语，藏着一个字。
      按五条路的次序（东、南、西、北、中）把五个字排正。别让它数到六。
    </p>

    <!-- 兜底：监听仪残迹（听不见也能读） -->
    <p class="deck-trace" title="监听仪残迹">
      残迹：∷一⋯<b>让</b>⌇ 二⋯<b>商</b>∷ 三⋯<b>义</b>⌗ 四⋯<b>和</b>⌇ 五⋯<b>信</b>∷ 六⋯⌗
    </p>

    <!-- 记入次序 -->
    <div class="chars">
      <button
        v-for="c in chars" :key="c" type="button" class="char-btn"
        :disabled="chosen.includes(c) || chosen.length >= 5"
        @click="pick(c)"
      >{{ c }}</button>
    </div>

    <div class="order-line">
      <span class="order-label">次序</span>
      <template v-if="chosen.length">
        <span v-for="(c, i) in chosen" :key="c" class="order-chip">{{ i + 1 }} · {{ c }}</span>
      </template>
      <span v-else class="order-empty">（尚未记入）</span>
      <button class="reset-order" type="button" @click="resetOrder">清除所选</button>
    </div>

    <Transition name="reveal-in">
      <div v-if="message" class="archive-panel audio-answer"><p>{{ message }}</p></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue'
import game from '../stores/game'

const BARS = 120
const emptyBars = Array.from({ length: BARS }, () => 4)
const peaks = ref(emptyBars)

// 未标德目字，玩家从录音里听出这五个字，再按五路总序排
const chars = ['让', '商', '义', '和', '信']
const answer = ['义', '让', '信', '和', '商']   // 东→南→西→北→中

const chosen = ref([])
const message = ref('')
const playing = ref(false)
const progress = ref(0)
const timeText = ref('00:00')

const audioEl = ref(null)
const waveEl = ref(null)

watch(() => chosen.value.join('|'), () => {
  const val = chosen.value
  if (val.length < 5) { message.value = ''; return }
  if (val.join('') === answer.join('')) {
    game.state.audioSolved = true
    game.markBranch('audio')
    game.collectKey('huan-ming')
    message.value = '报数停下来了。有人在电流里低语：财从手过，别从心住。又央了一句：别删账，把名字还给他们。'
    return
  }
  game.triggerScare('face', '不要数到六。')
  message.value = '算盘重新响起。它没有说你错，只把“欠”字多念了一遍。'
})

function pick(c) {
  if (!chosen.value.includes(c) && chosen.value.length < 5) chosen.value.push(c)
}
function resetOrder() { chosen.value = [] }

// —— 播放 / 定位 ——
function toggle() {
  const a = audioEl.value
  if (!a) return
  if (a.paused) a.play().catch(() => {}); else a.pause()
}
function seek(e) {
  const a = audioEl.value
  const el = waveEl.value
  if (!a || !el || !a.duration) return
  const r = el.getBoundingClientRect()
  a.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * a.duration
}
function fmt(s) {
  s = Math.max(0, Math.floor(s || 0))
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')
}
function onTime() {
  const a = audioEl.value
  if (!a || !a.duration) return
  progress.value = a.currentTime / a.duration
  timeText.value = fmt(a.currentTime)
}
function onMeta() { timeText.value = fmt(0) }
function onEnd() { playing.value = false }
function onPlay() { playing.value = true }
function onPause() { playing.value = false }

// —— 真波形：解码整条录音取峰值（懒加载，静默失败时用空波形兜底）——
let actx = null
async function loadPeaks() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    actx = new Ctx()
    const ab = await (await fetch('/audio/rec.mp3')).arrayBuffer()
    const buf = await actx.decodeAudioData(ab)
    const ch = buf.getChannelData(0)
    const step = Math.max(1, Math.floor(ch.length / BARS))
    const out = []
    for (let i = 0; i < BARS; i++) {
      let m = 0
      const start = i * step, end = Math.min(ch.length, start + step)
      for (let j = start; j < end; j++) { const v = Math.abs(ch[j]); if (v > m) m = v }
      out.push(Math.max(6, Math.round(m * 100)))
    }
    peaks.value = out
  } catch (e) { /* 断网/解码失败 → 保留空波形 */ }
}

onMounted(loadPeaks)
onBeforeUnmount(() => { if (actx) { actx.close(); actx = null } })
</script>

<style scoped>
.audio-note { color: #b09a72; margin-top: 1rem; }
.audio-answer a { color: var(--gold); }

.tape-deck {
  border: 1px solid rgba(157, 40, 26, 0.4);
  background: linear-gradient(170deg, rgba(30, 20, 13, 0.92), rgba(15, 10, 7, 0.96));
  padding: 1rem 1.2rem;
}
.deck-row { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.9rem; }
.deck-play {
  width: 46px; height: 46px; border-radius: 50%; cursor: pointer; font-size: 1rem;
  background: rgba(240, 200, 132, 0.12); border: 1px solid rgba(240, 200, 132, 0.5); color: #f0c884;
}
.deck-play:hover { background: rgba(240, 200, 132, 0.22); }
.deck-wave {
  position: relative; height: 64px; display: flex; align-items: center; gap: 1px; cursor: pointer;
  background: rgba(10, 7, 4, 0.6); border: 1px solid rgba(138, 111, 77, 0.35); padding: 0 6px;
}
.deck-wave span { flex: 1 1 0; min-width: 1px; max-width: 3px; background: #8a6f4d; border-radius: 1px; opacity: 0.75; }
.deck-wave span.passed { background: #d13424; opacity: 0.9; }
.deck-head { position: absolute; top: 0; bottom: 0; width: 2px; background: #f0c884; box-shadow: 0 0 10px rgba(240, 200, 132, 0.7); }
.deck-time { font-size: 0.8rem; color: #d8c394; letter-spacing: 0.08em; min-width: 3.4em; text-align: right; }
.deck-meta { display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.68rem; letter-spacing: 0.2em; color: #8a6f4d; }
.deck-trace { margin: 0.8rem 0 0; font-size: 0.72rem; letter-spacing: 0.12em; color: #6f5a3d; }
.deck-trace b { color: #b09a72; }

.chars { display: flex; gap: 0.6rem; margin: 1rem 0 0.2rem; }
.char-btn {
  width: 46px; height: 46px; font-family: inherit; font-size: 1.15rem; cursor: pointer;
  color: #e3cf9f; background: transparent; border: 1px solid rgba(138, 111, 77, 0.5); border-radius: 4px;
}
.char-btn:hover:not(:disabled) { border-color: #f0c884; color: #ffe2a8; }
.char-btn:disabled { color: #6f5a3d; border-color: rgba(138, 111, 77, 0.2); cursor: default; }

.order-line { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin: 0.8rem 0 0.4rem; }
.order-label { font-size: 0.72rem; letter-spacing: 0.24em; color: #9c7c55; }
.order-chip { font-size: 0.78rem; color: #e3cf9f; border: 1px solid rgba(240, 200, 132, 0.4); border-radius: 3px; padding: 0.15em 0.6em; }
.order-empty { font-size: 0.78rem; color: #6f5a3d; }
.reset-order { margin-left: auto; }

/* 隐式播放器 */
.tape-audio { display: none; }
</style>

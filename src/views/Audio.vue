<template>
  <div class="audio-widget">
    <audio
      ref="audioEl"
      :class="native ? 'tape-audio native' : 'tape-audio'"
      :controls="native"
      src="/audio/rec.mp3"
      preload="metadata"
      playsinline
      @timeupdate="onTime"
      @loadedmetadata="onMeta"
      @ended="onEnd"
      @play="onPlay"
      @pause="onPause"
      @error="onError"
    ></audio>

    <div class="audio-layout">
      <div class="archive-panel">
        <p class="audio-note">
          六声报数，一声一段；每段底下压着一个男人的耳语，藏着一个字。
          按五条路的次序（东、南、西、北、中）把五个字排正。别让它数到六。
        </p>

        <!-- 一盘整带：后间录音 -->
        <div class="rec-deck">
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

        <!-- 选字（打乱顺序） -->
        <div class="wave-row">
          <button
            v-for="clip in clips" :key="clip.id" type="button"
            class="clip" :class="{ chosen: chosen.includes(clip.id) }"
            @click="pick(clip.id)"
          >
            <span v-for="(bar, bi) in clip.bars" :key="bi" :style="{ height: bar + '%' }" /><b>{{ clip.id }}</b>
          </button>
        </div>

        <div class="order-line">
          <span class="order-label">次序</span>
          <template v-if="chosen.length">
            <span v-for="(c, i) in chosen" :key="c" class="order-chip">{{ i + 1 }} · {{ c }}</span>
          </template>
          <span v-else class="order-empty">（尚未记入）</span>
          <button class="reset-order" type="button" @click="resetOrder">清除所选</button>
        </div>
      </div>

      <div class="tape" @click="toggle" title="播放 / 暂停" role="button" tabindex="0" @keydown.enter="toggle">
        <div class="tape-window"><span>REC</span><b>00:03:47</b></div>
        <div class="reel left"></div>
        <div class="reel right"></div>
        <div class="tape-line"></div>
        <img class="tape-kettle" src="/img/kettle_eye.webp" alt="" />
        <span class="tape-blood" aria-hidden="true"></span>
      </div>
    </div>

    <p v-if="hint" class="deck-hint">{{ hint }}</p>

    <Transition name="reveal-in">
      <div v-if="message" class="archive-panel audio-answer"><p>{{ message }}</p></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, onMounted } from 'vue'
import game from '../stores/game'

const BARS = 120
const emptyBars = Array.from({ length: BARS }, () => 4)
const peaks = ref(emptyBars)

// 五个字按键，故意打乱顺序（不放原文/原声顺序）
const clips = [
  { id: '信', bars: [23, 65, 28, 45, 16] },
  { id: '商', bars: [18, 48, 17, 69, 29] },
  { id: '义', bars: [17, 38, 20, 65, 32] },
  { id: '和', bars: [40, 19, 60, 15, 36] },
  { id: '让', bars: [55, 15, 39, 18, 62] }
]
const answer = ['义', '让', '信', '和', '商']   // 东→南→西→北→中（正确答案：见碎片方位）
const recorded = ['让', '商', '义', '和', '信'] // 录音里的先后（一→五）——最易误选，给引导而非惊吓

const chosen = ref([])
const message = ref('')
const playing = ref(false)
const progress = ref(0)
const timeText = ref('00:00')

const audioEl = ref(null)
const waveEl = ref(null)
const native = ref(false)   // 播放被拦时，露出系统原生播放器兜底
const hint = ref('')
const wrongCount = ref(0)   // 反复乱排到阈值 = 走捷径

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
  wrongCount.value += 1
  if (wrongCount.value === 6) game.takeShortcut()
  if (val.join('') === recorded.join('')) {
    // 照录音先后选的——最容易踩的坑：给引导，同时照跳脸
    game.triggerScare('face', '不要数到六。')
    message.value = '算盘重新响起。它没有说你错，只说“耳听为虚，眼见为实”。'
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
async function toggle() {
  const a = audioEl.value
  if (!a) return
  if (!a.paused) { a.pause(); return }
  try {
    await a.play()
    hint.value = ''
  } catch (e) {
    // 被浏览器/自动播放策略拦下：露出系统原生播放器兜底
    native.value = true
    hint.value = '当前浏览器阻止了自定义播放，已切换为系统播放器，请点下方播放键。'
  }
}
function onError() {
  const a = audioEl.value
  const code = a && a.error ? a.error.code : '?'
  native.value = true
  hint.value = '音频加载失败（错误码 ' + code + '），请点下方系统播放器重试。'
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

onMounted(() => {
  loadPeaks()
  const a = audioEl.value
  if (a) a.load()
})
onBeforeUnmount(() => { if (actx) { actx.close(); actx = null } })
</script>

<style scoped>
.audio-note { color: #b09a72; margin-top: 0; }
.audio-answer a { color: var(--gold); }

/* 录音带播放条 */
.rec-deck { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.9rem; margin: 0.9rem 0 0.3rem; }
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

/* 次序 */
.order-line { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin: 0.6rem 0 0; }
.order-label { font-size: 0.72rem; letter-spacing: 0.24em; color: #9c7c55; }
.order-chip { font-size: 0.78rem; color: #e3cf9f; border: 1px solid rgba(240, 200, 132, 0.4); border-radius: 3px; padding: 0.15em 0.6em; }
.order-empty { font-size: 0.78rem; color: #6f5a3d; }
.reset-order { margin-left: auto; }

/* 隐式播放器：视觉隐藏（而非 display:none，避免部分浏览器不播）；被拦时露出原生控件 */
.tape-audio { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.tape-audio.native { position: static; width: 100%; height: auto; opacity: 1; pointer-events: auto; margin: 0.8rem 0 0; }
.deck-hint { margin: 0.6rem 0 0; font-size: 0.78rem; color: #d8a24a; }
</style>

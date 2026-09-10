<template>
  <div class="audio-widget" @click="startAmbient">
    <div class="audio-layout">
      <div class="archive-panel">
        <p class="audio-note">五段静音里各藏着一个字。按五条路的次序（东、南、西、北、中）排正。</p>
        <div class="wave-row">
          <button v-for="clip in clips" :key="clip.id" class="clip" :class="{ chosen: chosen.includes(clip.id) }" @click="choose(clip)">
            <span v-for="bar in clip.bars" :key="bar" :style="{ height: bar + '%' }" /><b>{{ clip.id }}</b>
          </button>
        </div>
        <button class="reset-order" @click="chosen = []">清除所选</button>
      </div>
      <div class="tape"><div class="tape-window"><span>REC</span><b>00:03:47</b></div><div class="reel left" /><div class="reel right" /><div class="tape-line" /><img class="tape-kettle" src="/img/kettle_eye.png" alt="" /><span class="tape-blood" aria-hidden="true"></span></div>
    </div>

    <Transition name="reveal-in">
      <div v-if="message" class="archive-panel audio-answer"><p>{{ message }}</p></div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeUnmount } from 'vue'
import game from '../stores/game'
const clips = [
  { id: '信', bars: [23, 65, 28, 45, 16] }, { id: '商', bars: [18, 48, 17, 69, 29] }, { id: '义', bars: [17, 38, 20, 65, 32] }, { id: '和', bars: [40, 19, 60, 15, 36] }, { id: '让', bars: [55, 15, 39, 18, 62] }
]
const chosen = ref([])
const answer = ['义', '让', '信', '和', '商']
const message = computed(() => {
  if (chosen.value.length < 5) return ''
  const right = chosen.value.join('') === answer.join('')
  if (right) { game.state.audioSolved = true; game.markBranch('audio'); game.collectKey('huan-ming'); return '报数停下来了。有人在电流里低语：财从手过，别从心住。又央了一句：别删账，把名字还给他们。' }
  game.triggerScare('face', '不要数到六。'); return '算盘重新响起。它没有说你错了，只把“欠”字多念了一遍。'
})
function choose(clip) { if (!chosen.value.includes(clip.id) && chosen.value.length < 5) chosen.value.push(clip.id) }

// —— 磁带底噪 loop：WebAudio 极低频“算盘珠滚动”感，首次用户手势后启动 ——
let actx = null
let gain = null
function ensureAmbient() {
  if (actx) return
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return
  actx = new Ctx()
  gain = actx.createGain()
  gain.gain.value = 0.05
  gain.connect(actx.destination)
  // 低频衬底 + 轻微起伏，模拟磁带转动/算盘珠滚动
  const osc = actx.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = 55
  osc.connect(gain)
  osc.start()
  // 随机“珠子滚动”脉冲
  const lfo = actx.createOscillator()
  lfo.frequency.value = 0.4
  const lfoGain = actx.createGain()
  lfoGain.gain.value = 0.02
  lfo.connect(lfoGain)
  lfoGain.connect(gain.gain)
  lfo.start()
}
function startAmbient() {
  if (game.reduceMotion()) { actx = null; return }
  ensureAmbient()
  if (actx && actx.state === 'suspended') actx.resume()
}
onBeforeUnmount(() => {
  if (gain && actx) { gain.disconnect(); actx.close(); actx = null }
})
</script>

<style scoped>
.vault-page { max-width: 1000px; }
.collection-title { font-size: 26px; line-height: 1.4; color: #ece0c0; }
.collection-desc { color: #b09a72; }
.vault-em { color: var(--blood-bright); font-style: normal; text-shadow: 0 0 18px rgba(190, 40, 26, 0.35); }
.audio-note { color: #b09a72; }
.audio-answer a { color: var(--gold); }
</style>

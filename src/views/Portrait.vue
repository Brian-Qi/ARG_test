<template>
  <div class="portrait-widget">
    <div class="photo-grid">
      <button
        v-for="photo in photos"
        :key="photo.year"
        class="collection-card old-photo"
        :class="{ marked: marks.includes(photo.id) }"
        @click="mark(photo.id)"
      >
        <div class="photo-figure"><i class="crack" /><span>{{ photo.face }}</span></div>
        <div class="meta">{{ photo.year }}</div>
        <h3>{{ photo.caption }}</h3>
        <p class="photo-clothes">衣纹：{{ photo.clothes }}</p>
      </button>
    </div>

    <div class="archive-panel portrait-prompt">
      <p>三张照片里都有的那一处，是：</p>
      <div class="judge-actions">
        <button class="btn-flat" @click="judge('crack')">同一道裂纹</button>
        <button class="btn-flat" @click="judge('face')">同一张脸</button>
        <button class="btn-flat" @click="judge('title')">同一个题字</button>
      </div>
    </div>

    <Transition name="reveal-in">
      <div v-if="result" class="archive-panel portrait-result"><p>{{ result }}</p></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import game from '../stores/game'
const marks = ref([]); const result = ref('')
const photos = [
  { id: 'one', year: '1901', face: '财', caption: '财神石像', clothes: '披甲', },
  { id: 'two', year: '1916', face: '苏', caption: '东坡石像', clothes: '宽袍', },
  { id: 'three', year: '今夜', face: '空', caption: '无名石龛', clothes: '不可辨', }
]
const wrongCount = ref(0)
function mark(id) { if (!marks.value.includes(id)) marks.value.push(id) }
function judge(answer) {
  if (answer === 'crack') {
    result.value = '那条裂纹，就是名字被刮掉后留下的。五枚红指印开始离开财签，只留下你的那一枚。'
    game.state.portraitSolved = true
    game.markBranch('portrait')
    game.collectKey('di-liu-wei')
    game.triggerScare('blood', '第六位 · 等待回执')
    return
  }
  result.value = '照片轻微闪烁。那一项在每个年代都被改过。'
  wrongCount.value += 1
  if (wrongCount.value === 6) game.takeShortcut()
}
</script>

<style scoped>
.vault-page { max-width: 1000px; }
.collection-title { font-size: 26px; line-height: 1.4; color: #ece0c0; }
.collection-desc { color: #b09a72; }
.vault-em { color: var(--blood-bright); font-style: normal; text-shadow: 0 0 18px rgba(190, 40, 26, 0.35); }
.photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 18px; margin: 20px 0; }
.old-photo { cursor: pointer; }
.old-photo.marked { border-color: var(--blood); }
.photo-figure { height: 150px; border-radius: 3px; background: #0d0906; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; margin-bottom: 10px; }
.photo-figure span { font-family: var(--kai); font-size: 40px; color: #6b5236; }
.photo-figure .crack { position: absolute; right: 18%; bottom: 0; width: 2px; height: 65%; background: #1a120a; transform: skewX(-18deg); box-shadow: 0 0 8px rgba(0,0,0,0.6); }
.photo-clothes { font-size: 0.84rem; color: #8a6f4d; }
.judge-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.portrait-result .back-link { color: var(--gold); }
</style>

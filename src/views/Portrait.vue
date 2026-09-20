<template>
  <div class="portrait-widget">
    <div class="photo-grid">
      <button
        v-for="photo in photos"
        :key="photo.id"
        class="collection-card old-photo"
        :class="{ marked: inspected.includes(photo.id) }"
        @click="inspect(photo.id)"
      >
        <div class="photo-figure">
          <img class="photo-img" :src="photo.img" :alt="photo.caption" loading="lazy" width="1536" height="1024" />
        </div>
        <div class="meta">{{ photo.year }}</div>
        <h3>{{ photo.caption }}</h3>
        <p class="photo-clothes">衣纹：{{ photo.clothes }}</p>
        <p class="photo-seen">{{ inspected.includes(photo.id) ? '已验看' : '点击验看' }}</p>
      </button>
    </div>

    <div class="archive-panel portrait-prompt">
      <p>三张照片里都有的那一处，是：</p>
      <p class="inspect-count">已验看 {{ inspected.length }} / {{ photos.length }}</p>
      <div class="judge-actions">
        <button class="btn-flat" @click="judge('crack')">同一道裂纹</button>
        <button class="btn-flat" @click="judge('face')">同一张脸</button>
        <button class="btn-flat" @click="judge('title')">同一个题字</button>
      </div>
    </div>

    <Transition name="reveal-in">
      <div v-if="result" class="archive-panel portrait-result">
        <p>{{ result }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import game from '../stores/game'
import { deobf } from '../utils/obfuscate'

const ANSWER = deobf('=s2YhJ3Y') // 轻度混淆：正解不在明文
const inspected = ref([])
const result = ref('')
const photos = [
  { id: 'one', year: '1901', img: '/img/photo-1901.webp', caption: '财神石像', clothes: '披甲' },
  { id: 'two', year: '1916', img: '/img/photo-1916.webp', caption: '文士石像', clothes: '宽袍' },
  { id: 'three', year: '今夜', img: '/img/photo-today.webp', caption: '无名石龛', clothes: '不可辨' }
]
const wrongCount = ref(0)

// 点击照片 = 验看；三张都验看过，才允许下判断（此前点击无任何作用）
function inspect(id) {
  if (!inspected.value.includes(id)) inspected.value.push(id)
}

function judge(answer) {
  if (inspected.value.length < photos.length) {
    result.value = `先把三张逐一验看（点击照片），再下判断。（已验看 ${inspected.value.length} / ${photos.length}）`
    return
  }
  if (answer === ANSWER) {
    result.value = '那道裂，就是名字被刮掉后留下的。五枚红指印开始离开财签，只留下你的那一枚。'
    game.state.portraitSolved = true
    game.markBranch('portrait')
    game.collectKey('di-liu-wei')
    game.triggerScare('blood', '第六位 · 等待回执')
    return
  }
  wrongCount.value += 1
  if (wrongCount.value === 6) game.takeShortcut()
  result.value = answer === 'face' ? '三张脸分属不同年代、不同主——不是同一张脸。再看那道裂。' : '石身上没有题字，只有一道刮痕。再看那道裂。'
}
</script>

<style scoped>
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin: 20px 0;
}
@media (max-width: 720px) {
  .photo-grid {
    grid-template-columns: 1fr;
  }
}
.old-photo {
  cursor: pointer;
}
.old-photo.marked {
  border-color: var(--blood);
}
.photo-figure {
  width: 100%;
  height: auto;
  aspect-ratio: 3 / 2;
  border-radius: 3px;
  background: #0d0906;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 10px;
}
.photo-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.2) contrast(1.06) brightness(0.9);
}
.photo-clothes {
  font-size: 0.84rem;
  color: #8a6f4d;
}
.photo-seen {
  margin: 4px 0 0;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  color: #6f5a3d;
}
.old-photo.marked .photo-seen {
  color: #d13424;
}
.inspect-count {
  margin: 0 0 0.7rem;
  font-size: 0.76rem;
  letter-spacing: 0.12em;
  color: #9c7c55;
}
.judge-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.portrait-result .back-link {
  color: var(--gold);
}
</style>

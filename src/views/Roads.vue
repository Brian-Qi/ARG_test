<template>
  <div class="roads-widget">
    <!-- 五盏灯：选错灭一盏 -->
    <div class="roads-lamps" aria-hidden="true">
      <span v-for="n in 5" :key="n" class="lamp" :class="{ off: n > lamps }" />
      <span class="lamp-count">灯火 {{ lamps }} / 5</span>
    </div>

    <div class="archive-grid">
      <article
        v-for="(road, i) in roads"
        :key="road.direction"
        class="collection-card road-card"
        :class="{ opened: road.opened, active: selected === i && !road.opened }"
        @click="selectRoad(i)"
      >
        <span class="road-direction">{{ road.direction }}</span>
        <h3>{{ road.opened ? road.god : road.name }}</h3>
        <p>{{ road.opened ? road.truth : road.pitch }}</p>
        <small>{{ road.opened ? '还原 · ' + road.escape : '点击查看' }}</small>
      </article>
    </div>

    <!-- 逃生口解密：针对当前选中卡 -->
    <div v-if="selected !== null && !roads[selected].opened" class="archive-panel roads-puzzle">
      <p class="puzzle-tag">{{ roads[selected].direction }} · 认一认这是哪个逃生口</p>
      <div class="escape-options">
        <button
          v-for="e in escapes"
          :key="e"
          class="escape-btn"
          type="button"
          :class="{ chosen: guess === e }"
          @click="guessEscape(e)"
        >{{ e }}</button>
      </div>
      <p v-if="lastMsg" class="puzzle-msg" :class="{ hint: lastMsgHint }">{{ lastMsg }}</p>
    </div>

    <Transition name="reveal-in">
      <div v-if="openedCount === 5" class="archive-panel roads-result">
        <p>东、南、西、北、中：<b>公正和合</b>。</p>
        <p>五笔往来没有机械平账，却都写着“已安”。</p>
        <button class="btn-flat" @click="solve">调阅下一卷</button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import game from '../stores/game'

const router = useRouter()

// 五条财路：广告名 → 五路财神（大五路）
const roads = reactive([
  { direction: '东市', name: '今日暴利', god: '比干', pitch: '三步回本，马上到账。', truth: '剖心之后，仍是商朝的忠臣。', escape: '门', opened: false },
  { direction: '南码头', name: '包赢合伙', god: '柴荣', pitch: '投入越多，回报越快。', truth: '少年贩茶，后来称帝。', escape: '柜', opened: false },
  { direction: '西巷', name: '财运加速', god: '关公', pitch: '替你避开所有损失。', truth: '一手持刀，一手春秋。', escape: '梁', opened: false },
  { direction: '北峰', name: '福报兑换', god: '赵公明', pitch: '一签换一份确定。', truth: '玄坛之上，黑虎伏下。', escape: '井', opened: false },
  { direction: '中街', name: '贵人助力', god: '王亥', pitch: '填写姓名，即刻匹配贵人。', truth: '服牛驯马，负贩四方。', escape: '窗', opened: false }
])

const escapes = ['窗', '井', '柜', '梁', '门']
const selected = ref(null)
const guess = ref('')
const lamps = ref(5)
const mistakes = ref(0)
const lastMsg = ref('')
const lastMsgHint = ref(false)

const openedCount = computed(() => roads.filter(item => item.opened).length)

function selectRoad(i) {
  if (roads[i].opened) return
  selected.value = i
  guess.value = ''
  lastMsg.value = ''
  lastMsgHint.value = false
}

function guessEscape(e) {
  const road = roads[selected.value]
  if (!road) return
  if (e === road.escape) {
    road.opened = true
    guess.value = ''
    lastMsg.value = '认对了。' + road.escape + '——逃出去的是他。'
    lastMsgHint.value = false
    // 自动跳到下一张未破解
    const next = roads.findIndex((r, i) => !r.opened && r !== road)
    selected.value = next === -1 ? null : next
    return
  }
  // 选错：灭一盏灯
  lastMsgHint.value = false
  if (lamps.value > 0) lamps.value -= 1
  mistakes.value += 1
  if (mistakes.value >= 6) {
    // 第 6 次起：给正确提示（靠提示过关 = 走捷径，锁好结局）
    if (mistakes.value === 6) game.takeShortcut()
    lastMsg.value = '灯火快灭了。' + road.direction + '这条路——' + road.truth
    lastMsgHint.value = true
  } else {
    lastMsg.value = lamps.value > 0 ? '一盏灯灭了。' : '灯火尽熄，往后再想。'
  }
}

function solve() {
  game.state.roadSolved = true
  game.state.pagesRead += 1
  game.markBranch('roads')
  game.collectKey('de-mu')
  router.push('/f/recording')
}
</script>

<style scoped>
.vault-page { max-width: 1080px; }
.collection-title { font-size: 24px; color: #ece0c0; }
.collection-desc { color: #b09a72; }
.roads-lamps { display: flex; align-items: center; gap: 0.5rem; margin: 1.2rem 0; }
.lamp { width: 14px; height: 14px; border-radius: 50%; background: #f0c884; box-shadow: 0 0 10px rgba(240, 200, 132, 0.7); transition: background 0.3s ease, box-shadow 0.3s ease; }
.lamp.off { background: #3a2c1c; box-shadow: none; }
.lamp-count { margin-left: 0.4rem; font-size: 0.72rem; letter-spacing: 0.16em; color: #9c7c55; }
.road-card { cursor: pointer; }
.road-card.active { border-color: rgba(240, 200, 132, 0.7); box-shadow: 0 0 18px rgba(240, 200, 132, 0.14); }
.road-direction { font-size: 0.7rem; letter-spacing: 0.32em; color: #9c7c55; }
.road-card small { color: #8a6f4d; font-size: 0.72rem; letter-spacing: 0.1em; }
.roads-puzzle { margin-top: 1.6rem; }
.puzzle-tag { margin: 0 0 0.7rem; color: #d8c394; font-size: 0.9rem; letter-spacing: 0.1em; }
.escape-options { display: flex; gap: 0.8rem; flex-wrap: wrap; }
.escape-btn { border: 1px solid rgba(138, 111, 77, 0.45); background: transparent; color: #e3cf9f; font-family: inherit; font-size: 1rem; padding: 0.5em 1.1em; border-radius: 3px; cursor: pointer; letter-spacing: 0.3em; }
.escape-btn:hover { border-color: #f0c884; color: #ffe2a8; }
.escape-btn.chosen { border-color: var(--blood); color: var(--blood-bright); }
.puzzle-msg { margin: 0.9rem 0 0; font-size: 0.84rem; color: #b09a72; letter-spacing: 0.05em; }
.puzzle-msg.hint { color: #e8b49a; }
.roads-result { margin-top: 1.6rem; }
.roads-result b { color: #ffd9a0; }
.roads-result .back-link { color: var(--gold); margin-left: 1.2rem; }
</style>

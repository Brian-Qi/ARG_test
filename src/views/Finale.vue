<template>
  <div class="finale">
    <div class="collection-back"><RouterLink class="back-link" to="/story">← 返回馆藏首页</RouterLink></div>

    <div class="archive-panel collection-header">
      <h1 class="collection-title">馆藏 HZ-1927-0512 · 封卷</h1>
      <p class="collection-desc">五个名字已经补齐。现在只等你签第六格，替五童借财局完成最后一笔。封卷前，系统要求作出一次调阅决定。</p>
    </div>

    <!-- 抉择 -->
    <div class="choice-ledger">
      <p class="choice-lead">按钮上写着“立即兑现”。小字则是：签下见证人，以一位活人换回沈砚秋。</p>
      <div class="final-actions">
        <button class="danger" @click="end('bad')">签下见证人</button>
        <button v-if="canGrey" class="grey" @click="end('grey')">销毁账簿</button>
        <button v-if="canHidden" class="quiet" @click="end('hidden')">归还姓名</button>
      </div>
      <p v-if="!canHidden" class="choice-note">
        <template v-if="missingHidden.length">还有卷宗未亲手解过：{{ missingHidden.join('、') }}。</template>
        <template v-else>已走过捷径，归还姓名一途已断。</template>
      </p>
      <p v-else-if="!canGrey" class="choice-note faint">
        <template v-if="!game.hasRead('fenyu')">账烧得掉，也得先知道烧的是什么。</template>
        <template v-else>焚账须凭四样回执：死者之名 · 死者之药 · 死者之签 · 待收之信（{{ greyHave }} / 4）。</template>
      </p>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import game from '../stores/game'

const router = useRouter()

// 好结局：完成四条谜题线（五路/录音/旧影/宅院）、且全程未走捷径
const canHidden = computed(() =>
  game.state.roadSolved && game.state.audioSolved && game.state.portraitSolved && game.state.zhaiyuanSolved && game.state.shortcuts === 0
)
const missingHidden = computed(() => {
  const miss = []
  if (!game.state.roadSolved) miss.push('五条财路')
  if (!game.state.audioSolved) miss.push('算盘录音')
  if (!game.state.portraitSolved) miss.push('旧影')
  if (!game.state.zhaiyuanSolved) miss.push('宅院安位')
  return miss
})
// 灰结局支线「焚余」：先读《著录勘误》→ 循线找到《焚余》→ 集齐四样回执，才烧得掉这本账
const GREY_PROOF = ['obituary', 'yaozha', 'fortuneslip', 'guestbook']
const greyHave = computed(() => GREY_PROOF.filter((id) => game.hasRead(id)).length)
const canGrey = computed(() => game.hasRead('fenyu') && greyHave.value === GREY_PROOF.length)

// 选完即记结局，并跳转到对应的独立结局页
const END_ROUTE = { bad: '/ending/sixth', grey: '/ending/ash', hidden: '/ending/out' }
function end(type) {
  game.setEnding(type)
  router.push(END_ROUTE[type] || '/story')
}
</script>

<style scoped>
.finale { max-width: 860px; }

/* ---------- 抉择 ---------- */
.choice-ledger {
  margin-top: 20px;
  border: 1px solid rgba(157, 40, 26, 0.4);
  background: linear-gradient(170deg, rgba(30, 20, 13, 0.92), rgba(15, 10, 7, 0.96));
  box-shadow: var(--shadow-soft);
  padding: 24px;
}
.choice-lead { color: #bfa97f; font-size: 0.9rem; margin: 0; }
.final-actions { display: flex; gap: 1rem; flex-wrap: wrap; margin: 1.2rem 0; }
.final-actions button { min-width: 10rem; padding: 0.8em 1.4em; font-size: 0.9rem; }
.final-actions .danger { border-color: var(--blood); color: #ffd9a0; background: linear-gradient(180deg, rgba(168,41,28,0.55), rgba(90,18,10,0.65)); box-shadow: 0 0 22px rgba(168,41,28,0.3); }
.final-actions .grey { border-color: rgba(150, 145, 130, 0.6); color: #cfc7b4; background: rgba(80, 78, 70, 0.18); }
.final-actions .quiet { border-color: rgba(201,162,90,0.6); }
.choice-note { color: #8a6f4d; font-size: 0.78rem; letter-spacing: 0.1em; margin: 0; }
.choice-note.faint { color: #6b5236; opacity: 0.7; }

</style>

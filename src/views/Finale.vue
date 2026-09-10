<template>
  <div class="vault-page">
    <div class="collection-back"><RouterLink class="back-link" to="/story">← 返回馆藏首页</RouterLink></div>

    <div class="archive-panel collection-header">
      <h1 class="collection-title">馆藏 HZ-1927-0512 · 封卷</h1>
      <p class="collection-desc">五个名字已经补齐。现在只等你签第六格，替五童借财局完成最后一笔。封卷前，系统要求作出一次调阅决定。</p>
    </div>

    <div class="choice-ledger">
      <div v-if="!game.state.ending" class="choice-content">
        <p>按钮上写着“立即兑现”。小字则是：签下见证人，以一位活人换回沈砚秋。</p>
        <div class="final-actions">
          <button class="danger" @click="end('bad')">签下见证人</button>
          <button @click="end('grey')">销毁账簿</button>
          <button class="quiet" :disabled="!canHidden" @click="end('hidden')">归还姓名</button>
        </div>
        <small v-if="!canHidden">还有一份卷宗未调阅：先完成五条财路的原始往来。</small>
      </div>

      <Transition name="reveal-in">
        <div v-if="game.state.ending" class="ending-copy" :class="game.state.ending">
          <template v-if="game.state.ending === 'bad'"><h2>第六位</h2><p>沈砚秋走出来了。财签却自动变成旧合影：五个孩子旁的空位里，是你。第六位收件人已签收。</p></template>
          <template v-else-if="game.state.ending === 'grey'"><h2>账已焚</h2><p>账焚尽了。他看了很久，什么也没说。</p><RouterLink class="grey-hint" to="/strike-zero">账烧不干净的那一笔，在灰里也看得见。</RouterLink></template>
          <template v-else><h2>五人出账</h2><p>五个零回到姓名与年龄，五双小鞋消失。第六位一直没有等到人——沈怀仁自己坐了进去，用他自己的魂，续他自己的命。从此年年初五，他都醒着。永生，是他自己给自己的。</p></template>
          <button @click="restart">重新调阅</button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import game from '../stores/game'
const canHidden = computed(() => game.state.roadSolved && game.state.audioSolved && game.state.portraitSolved && game.state.shortcuts === 0)
function end(type) { game.setEnding(type) }
function restart() { game.reset() }
</script>

<style scoped>
.vault-page { max-width: 820px; }
.collection-title { font-size: 24px; color: #ece0c0; }
.collection-desc { color: #b09a72; }
.choice-ledger {
  margin-top: 20px;
  border: 1px solid rgba(157, 40, 26, 0.4);
  background: linear-gradient(170deg, rgba(30, 20, 13, 0.92), rgba(15, 10, 7, 0.96));
  box-shadow: var(--shadow-soft);
}
.choice-content { padding: 24px; }
.choice-content > p { color: #bfa97f; font-size: 0.9rem; }
.final-actions { display: flex; gap: 1rem; flex-wrap: wrap; margin: 1.2rem 0; }
.final-actions button { min-width: 10rem; padding: 0.8em 1.4em; font-size: 0.9rem; }
.final-actions .danger { border-color: var(--blood); color: #ffd9a0; background: linear-gradient(180deg, rgba(168,41,28,0.55), rgba(90,18,10,0.65)); box-shadow: 0 0 22px rgba(168,41,28,0.3); }
.final-actions .quiet { border-color: rgba(201,162,90,0.6); }
.choice-content > small { color: #8a6f4d; font-size: 0.78rem; letter-spacing: 0.1em; }
.ending-copy { padding: 24px; }
.ending-copy h2 { font-size: 30px; color: var(--blood-bright); margin: 0 0 0.6rem; text-shadow: 0 0 20px rgba(168,41,28,0.4); }
.ending-copy.grey h2 { color: #9c9c92; }
.ending-copy p { color: #d9c69a; }
.grey-hint {
  display: block; margin-top: 1.6rem; color: rgba(154,122,85,0.35);
  font-size: 0.78rem; letter-spacing: 0.14em; text-decoration: none; cursor: pointer;
  transition: color 0.5s ease, text-shadow 0.5s ease;
}
.grey-hint:hover { color: rgba(224,178,92,0.9); text-shadow: 0 0 14px rgba(224,178,92,0.35); }
</style>

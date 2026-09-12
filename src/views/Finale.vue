<template>
  <div class="finale">
    <div class="collection-back"><RouterLink class="back-link" to="/story">← 返回馆藏首页</RouterLink></div>

    <div class="archive-panel collection-header">
      <h1 class="collection-title">馆藏 HZ-1927-0512 · 封卷</h1>
      <p class="collection-desc">五个名字已经补齐。现在只等你签第六格，替五童借财局完成最后一笔。封卷前，系统要求作出一次调阅决定。</p>
    </div>

    <!-- 抉择 -->
    <div v-if="!game.state.ending" class="choice-ledger">
      <p class="choice-lead">按钮上写着“立即兑现”。小字则是：签下见证人，以一位活人换回沈砚秋。</p>
      <div class="final-actions">
        <button class="danger" @click="end('bad')">签下见证人</button>
        <button v-if="canGrey" class="grey" @click="end('grey')">销毁账簿</button>
        <button v-if="canHidden" class="quiet" @click="end('hidden')">归还姓名</button>
      </div>
      <p v-if="!canHidden" class="choice-note">还有一份卷宗未调阅：先完成五条财路的原始往来。</p>
      <p v-else-if="!canGrey" class="choice-note faint">
        <template v-if="!game.hasRead('fenyu')">账烧得掉，也得先知道烧的是什么。</template>
        <template v-else>焚账须凭四样回执：死者之名 · 死者之药 · 死者之签 · 待收之信（{{ greyHave }} / 4）。</template>
      </p>
    </div>

    <!-- ================= 结局一 · 第六位（bad） ================= -->
    <Transition name="reveal-in">
      <section v-if="game.state.ending === 'bad'" class="ending ending-bad">
        <div class="eb-art"><img src="/img/shouni.webp" alt="" /><span class="eb-seal">签</span></div>
        <div class="eb-copy">
          <p class="eb-kicker">结账 · 第六位</p>
          <h2>第六位</h2>
          <p>沈砚秋走出来了。</p>
          <p>财签自动卷起，变成一张旧合影——五个孩子并排站着，旁边的空位里，是你。</p>
          <p class="eb-tag">第六位收件人已签收。</p>
          <button class="btn-flat" @click="restart">重新调阅</button>
        </div>
      </section>
    </Transition>

    <!-- ================= 结局二 · 账已焚（grey） ================= -->
    <Transition name="reveal-in">
      <section v-if="game.state.ending === 'grey'" class="ending ending-grey">
        <p class="eg-kicker">结账 · 账已焚</p>
        <h2>账已焚</h2>
        <p class="eg-body">账焚尽了。他看了很久，什么也没说。</p>
        <p class="eg-ash">灰里还留着字痕。有些字，是烧不掉的。</p>
        <div class="eg-gap"></div>
        <RouterLink class="grey-hint" to="/strike-zero">账烧不干净的那一笔，在灰里也看得见。</RouterLink>
        <button class="btn-flat eg-restart" @click="restart">重新调阅</button>
      </section>
    </Transition>

    <!-- ================= 结局三 · 五人出账（hidden/good） ================= -->
    <Transition name="reveal-in">
      <section v-if="game.state.ending === 'hidden'" class="ending ending-good">
        <div class="gg-art"><img src="/img/baishi.webp" alt="" /><span class="gg-seal">还</span></div>
        <div class="gg-copy">
          <p class="gg-kicker">结账 · 五人出账</p>
          <h2>五人出账</h2>
          <p>五个零回到姓名与年龄。五双小鞋，一双一双消失了。</p>
          <p>第六位一直没有等到人——沈怀仁自己坐了进去，用他自己的魂，续他自己的命。</p>
          <p class="gg-tag">从此年年初五，他都醒着。永生，是他自己给自己的。</p>
          <button class="btn-flat" @click="restart">重新调阅</button>
        </div>
      </section>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import game from '../stores/game'

// 好结局：完成三条财路、且全程未走捷径
const canHidden = computed(() =>
  game.state.roadSolved && game.state.audioSolved && game.state.portraitSolved && game.state.shortcuts === 0
)
// 灰结局支线「焚余」：先读《著录勘误》→ 循线找到《焚余》→ 集齐四样回执，才烧得掉这本账
const GREY_PROOF = ['obituary', 'yaozha', 'fortuneslip', 'guestbook']
const greyHave = computed(() => GREY_PROOF.filter((id) => game.hasRead(id)).length)
const canGrey = computed(() => game.hasRead('fenyu') && greyHave.value === GREY_PROOF.length)

function end(type) { game.setEnding(type) }
function restart() { game.reset() }
</script>

<style scoped>
.finale { max-width: 860px; }
.collection-title { font-size: 24px; color: #ece0c0; }
.collection-desc { color: #b09a72; }

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

/* ---------- 结局通用 ---------- */
.ending { margin-top: 22px; border-radius: 6px; padding: 34px 36px; position: relative; overflow: hidden; }
.ending h2 { font-size: 34px; margin: 0 0 14px; letter-spacing: 6px; }
.ending p { line-height: 2; margin: 0 0 0.7em; }
.ending .btn-flat { margin-top: 20px; }
.ending-art, .eb-art, .gg-art { float: right; width: 190px; margin: 0 0 16px 26px; position: relative; border: 1px solid rgba(157, 40, 26, 0.4); }
.ending-art img, .eb-art img, .gg-art img { width: 100%; display: block; filter: sepia(0.25) contrast(1.05) brightness(0.9); }
.eb-seal, .gg-seal {
  position: absolute; right: 10px; bottom: 10px; width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  font-family: "Ma Shan Zheng", serif; font-size: 22px; border-radius: 4px; transform: rotate(-6deg);
}

/* ---------- bad · 第六位 ---------- */
.ending-bad {
  border: 1px solid rgba(209, 52, 36, 0.6);
  background: linear-gradient(160deg, rgba(46, 12, 8, 0.96), rgba(16, 6, 4, 0.98));
  box-shadow: 0 0 40px rgba(168, 41, 28, 0.25) inset;
}
.ending-bad h2 { color: #d13424; text-shadow: 0 0 26px rgba(209, 52, 36, 0.5); }
.ending-bad p { color: #e6d3b4; }
.eb-kicker { font-size: 0.78rem; letter-spacing: 0.34em; color: #9c7c55; }
.eb-tag { color: #ff9a86; letter-spacing: 0.16em; }
.eb-seal { border: 2px solid #d13424; color: #d13424; background: rgba(20, 4, 3, 0.6); }

/* ---------- grey · 账已焚 ---------- */
.ending-grey {
  border: 1px solid rgba(150, 145, 130, 0.35);
  background: linear-gradient(170deg, rgba(30, 29, 26, 0.9), rgba(14, 13, 12, 0.96));
  text-align: center; padding: 56px 36px;
}
.ending-grey h2 { color: #b9b4a5; letter-spacing: 12px; }
.eg-kicker { font-size: 0.78rem; letter-spacing: 0.34em; color: #7d7869; }
.eg-body { color: #cfc9ba; }
.eg-ash { color: #817c6e; font-size: 0.92rem; }
.eg-gap { height: 40px; }
.ending-grey .eg-restart { margin-top: 26px; opacity: 0.75; }
.grey-hint {
  display: block; margin-top: 10px; color: rgba(154,122,85,0.32);
  font-size: 0.78rem; letter-spacing: 0.14em; text-decoration: none; cursor: pointer;
  transition: color 0.5s ease, text-shadow 0.5s ease;
}
.grey-hint:hover { color: rgba(224,178,92,0.9); text-shadow: 0 0 14px rgba(224,178,92,0.35); }

/* ---------- good · 五人出账 ---------- */
.ending-good {
  border: 1px solid rgba(201, 162, 90, 0.5);
  background: linear-gradient(160deg, rgba(48, 38, 22, 0.94), rgba(22, 17, 10, 0.97));
  box-shadow: 0 0 44px rgba(201, 162, 90, 0.14) inset;
}
.ending-good h2 { color: #f0c884; text-shadow: 0 0 24px rgba(240, 200, 132, 0.35); }
.ending-good p { color: #e3d2ad; }
.gg-kicker { font-size: 0.78rem; letter-spacing: 0.34em; color: #a98f5c; }
.gg-tag { color: #f0d9a8; }
.gg-seal { border: 2px solid #c9a25a; color: #f0c884; background: rgba(24, 16, 6, 0.6); }
</style>

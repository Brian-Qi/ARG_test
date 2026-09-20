<template>
  <div>
    <!-- 两件事都完成：合并后的终极确认面板 -->
    <section v-if="bothDone" class="archive-panel help-final">
      <h2 class="help-title">
        {{ HELP_CN }} <small class="help-en">{{ HELP_EN }}</small>
      </h2>
      <p class="help-kicker">回到此处，已是尽头</p>
      <p>你翻过目录之外的那一页，也看过族谱上的名字。馆藏 <b>HZ-1927-0512</b> 之外那份未列入公开目录的关联档案，此刻正等着你落一笔。</p>
      <p>沈晚：<em>“别让它开第六张。查完这五张，去落一笔账。”</em></p>
      <div class="help-final-actions">
        <RouterLink class="btn-flat" to="/collection/HZ-1927-0512/0">进入关联档案</RouterLink>
        <button v-if="!returnedOnce" class="btn-flat btn-noway" type="button" @click="goNoReturn">返回首页</button>
      </div>
    </section>

    <!-- 见过第 0 页（未解锁族谱）：给沈晚/进度的真实提示 -->
    <section v-else-if="seenHiddenVal" class="archive-panel help-restricted">
      <h2 class="help-title">
        {{ HELP_CN }} <small class="help-en">{{ HELP_EN }}</small>
      </h2>
      <p class="help-kicker">只为见过一张残页的人保留</p>
      <p>你翻到过目录之外的那一页。馆藏 <b>HZ-1927-0512</b> 之外还有一份未列入公开目录的关联档案。</p>
      <p>沈晚：<em>“别让它开第六张。查完这五张，去落一笔账。”</em></p>
      <p class="muted">系统已可切换到保管库视图。请在馆藏号后加 <code>/0</code>。</p>
      <RouterLink class="back-link" to="/collection/HZ-1927-0512/0">进入关联档案</RouterLink>
    </section>

    <!-- 未见过第 0 页：提示尚有事情未完成（弹窗） -->
    <section v-else class="archive-panel help-restricted">
      <h2 class="help-title">
        {{ HELP_CN }} <small class="help-en">{{ HELP_EN }}</small>
      </h2>
      <p class="help-kicker">有些地方还没去过</p>
      <p>馆藏 <b>HZ-1927-0512</b> 之外另有一份关联档案，但系统目前还不能为你调阅。</p>
      <p class="muted">尚有事情未完成，先回到目录翻完该翻的那几页。</p>
    </section>

    <!-- 没有退路：红色 -> 乱码 -> 消失 -> 你已经没有退路了 -->
    <div v-if="noReturn" class="noway-screen" :class="{ red: phase >= 1, gone: phase >= 2 }" aria-hidden="true">
      <div v-if="phase === 1" class="noway-text">{{ garbled }}</div>
      <div v-if="phase >= 2" class="noway-dead">你已经没有退路了</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { familyUnlocked } from '../../stores/archive-notify'
import { seenHidden } from '../../stores/game'

// 标题删除线用 Unicode 组合长划线（U+0336），逐字叠加，避免 CSS 在不同分辨率下错位
const HELP_CN = '\u5E2E\u0336\u52A9\u0336'
const HELP_EN = 'H\u0336e\u0336l\u0336p\u0336'

const seenHiddenVal = seenHidden()
const returnedOnce = ref(false)
const bothDone = computed(() => seenHiddenVal && familyUnlocked())

// 没有退路的演出：0=未触发 1=红屏乱码 2=已消失显示文字
const noReturn = ref(false)
const phase = ref(0)
const garbled = ref('')
let timers = []

const BASE = '尚有事情未完成，先回到目录翻完该翻的那几页。'
const GLITCH = '█▓▒░#@%&*0123456789一二三四五六七八九十ABCDEF'

function garble(text, t) {
  let out = ''
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (/\s/.test(c)) {
      out += c
      continue
    }
    if (Math.random() < t) out += GLITCH[Math.floor(Math.random() * GLITCH.length)]
    else out += c
  }
  return out
}

function runGarble() {
  let t = 0
  const iv = setInterval(() => {
    t += 0.06
    garbled.value = garble(BASE, t)
    if (t >= 1) {
      clearInterval(iv)
      phase.value = 2
      timers.push(
        setTimeout(() => {
          noReturn.value = false
        }, 3400)
      )
    }
  }, 60)
  timers.push(iv)
}

function goNoReturn() {
  returnedOnce.value = true
  noReturn.value = true
  phase.value = 1
  garbled.value = BASE
  timers.push(setTimeout(runGarble, 900))
}

onBeforeUnmount(() => {
  timers.forEach((t) => {
    clearTimeout(t)
    clearInterval(t)
  })
})
</script>

<style scoped>
.help-en {
  font-size: 13px;
  color: #8c2f24;
  font-weight: 400;
}
.help-title {
  color: #b3271b;
}
.help-title .help-en {
  color: inherit;
}
.staff-gap {
  display: inline-block;
  width: 1px;
  height: 1px;
}
.help-restricted,
.help-final {
  margin-top: 18px;
  border-color: rgba(140, 47, 36, 0.45);
  background: #f8eee0;
}
.help-kicker {
  font-size: 12px;
  letter-spacing: 3px;
  color: #8c2f24;
  border: 1px solid rgba(140, 47, 36, 0.4);
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  margin-bottom: 14px;
}
.help-restricted code {
  background: #efe2c4;
  border-radius: 3px;
  padding: 1px 6px;
  font-size: 13px;
}
.help-final-actions {
  display: flex;
  gap: 12px;
  margin-top: 18px;
  flex-wrap: wrap;
}
.btn-noway {
  border-color: #8c2f24;
  background: rgba(140, 47, 36, 0.05);
}

/* 没有退路的全屏演出 */
.noway-screen {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background: rgba(20, 2, 2, 0.88);
  pointer-events: none;
}
.noway-screen.red {
  background: radial-gradient(circle at 50% 45%, rgba(150, 12, 6, 0.7), rgba(60, 2, 1, 0.94));
}
.noway-screen.gone {
  background: rgba(20, 2, 2, 0.9);
}
.noway-text {
  color: rgba(255, 140, 120, 0.9);
  font-size: 26px;
  line-height: 2;
  letter-spacing: 3px;
  text-align: center;
  word-break: break-all;
  font-family: 'KaiTi', serif;
  max-width: 640px;
}
.noway-dead {
  color: #e9e0cf;
  font-size: 34px;
  letter-spacing: 10px;
  text-align: center;
  font-weight: 600;
  animation: noway-pulse 3.4s ease forwards;
}
@keyframes noway-pulse {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  15% {
    opacity: 1;
    transform: scale(1.04);
  }
  35% {
    transform: scale(1);
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>

<template>
  <section class="ending-page ending-grey">
    <figure class="ep-hero">
      <img :src="art" alt="" />
      <div class="ep-embers" aria-hidden="true">
        <i v-for="n in 30" :key="n" :style="emberStyle(n)"></i>
      </div>
      <figcaption class="ep-cap">
        <p class="ep-kicker">结账 · 账已焚</p>
        <h1>账已焚</h1>
      </figcaption>
      <span class="ep-seal">焚</span>
    </figure>

    <div class="ep-copy">
      <p>账焚尽了。火停在最后一页，没有再往前烧。</p>
      <p>他看了很久，什么也没说。四样回执齐了，这一页才点得着；点着了，他就再也回不去——您也一样。</p>
      <p>万和号的后间空了。借出去的那些命，一笔一笔还了回去，只是还回来的，总比借出去时少一些。</p>
      <p>灰里还留着字痕。有些字，是烧不掉的。</p>

      <RouterLink class="grey-clue" to="/strike-zero">
        <span class="clue-tag">残页 · 未烧尽</span>
        <span class="clue-text">账烧不干净的那一笔，在灰里也看得见。</span>
        <span class="clue-go">翻回第一页 →</span>
      </RouterLink>

      <button class="btn-flat" @click="restart">重新调阅</button>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import game from '../stores/game'

const router = useRouter()
const art = '/img/ending-ash.webp'
onMounted(() => game.setEnding('grey'))   // 本页即灰结局：确立状态，保证第零笔入口可用
function restart() { game.reset(); router.push('/') }

// 余烬：按序号散列出位置/速度/漂移，避免每次渲染乱跳
function emberStyle(n) {
  const r1 = Math.abs((Math.sin(n * 12.9898) * 43758.5453) % 1)
  const r2 = Math.abs((Math.sin(n * 78.233) * 12543.21) % 1)
  const r3 = Math.abs((Math.sin(n * 39.425) * 9337.11) % 1)
  const size = (2.5 + r3 * 4).toFixed(1) + 'px'
  return {
    left: (r1 * 100).toFixed(1) + '%',
    bottom: (-2 + r3 * 32).toFixed(1) + '%',
    width: size,
    height: size,
    animationDuration: (3.4 + r2 * 4.6).toFixed(2) + 's',
    animationDelay: (-r2 * 7.5).toFixed(2) + 's',
    '--dx': ((r1 - 0.5) * 60).toFixed(0) + 'px',
    opacity: (0.45 + r3 * 0.5).toFixed(2),
  }
}
</script>

<style scoped>
.ending-page { max-width: 1000px; margin: 0 auto; }
.ep-hero {
  position: relative; margin: 6px 0 0; aspect-ratio: 16 / 9; overflow: hidden; border-radius: 6px;
  border: 1px solid rgba(150, 145, 130, 0.4); background: #0d0906;
  box-shadow: 0 0 50px rgba(120, 118, 110, 0.14); animation: ep-in 0.9s ease both;
}
.ep-hero img { width: 100%; height: 100%; object-fit: cover; display: block; filter: grayscale(0.28) sepia(0.14) contrast(1.06) brightness(0.86); animation: ep-breathe 7s ease-in-out infinite alternate; }
/* 压暗 + 底部余烬的暖光 + 暗角 */
.ep-hero::before {
  content: ""; position: absolute; inset: 0; z-index: 1;
  background:
    radial-gradient(90% 60% at 50% 118%, rgba(255, 108, 24, 0.16), transparent 62%),
    radial-gradient(120% 100% at 50% 46%, transparent 44%, rgba(4, 3, 2, 0.62) 86%, rgba(2, 1, 0, 0.92) 100%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.12) 42%, rgba(10, 10, 9, 0.94) 100%);
}
/* 扫描线 */
.ep-hero::after { content: ""; position: absolute; inset: 0; z-index: 2; pointer-events: none; background: repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 3px); mix-blend-mode: multiply; }

/* 余烬飘灰 */
.ep-embers { position: absolute; inset: 0; z-index: 2; pointer-events: none; overflow: hidden; }
.ep-embers i {
  position: absolute; border-radius: 50%;
  background: radial-gradient(circle, #ffdf9a 0%, #ff8a1e 46%, rgba(255, 90, 0, 0) 74%);
  filter: blur(0.4px);
  animation-name: ember-rise; animation-timing-function: ease-in; animation-iteration-count: infinite;
  will-change: transform, opacity;
}
@keyframes ember-rise {
  0% { transform: translate3d(0, 0, 0) scale(0.85); opacity: 0; }
  12% { opacity: 1; }
  70% { opacity: 0.85; }
  100% { transform: translate3d(var(--dx, 12px), -300px, 0) scale(0.35); opacity: 0; }
}

.ep-cap { position: absolute; left: 42px; bottom: 30px; z-index: 3; animation: cap-in 0.9s ease 0.28s both; }
.ep-kicker { margin: 0 0 8px; font-size: 0.82rem; letter-spacing: 0.5em; color: #9d988a; }
.ep-hero h1 { margin: 0; font-family: var(--serif, serif); font-size: clamp(2.4rem, 6vw, 4rem); letter-spacing: 0.18em; color: #c9c4b6; text-shadow: 0 2px 12px #000; }
.ep-seal {
  position: absolute; top: 26px; right: 30px; z-index: 3; width: 64px; height: 64px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center; font-family: "Ma Shan Zheng", serif; font-size: 34px;
  border: 2px solid rgba(150, 145, 130, 0.7); color: #cfc7b4; background: rgba(20, 19, 17, 0.5);
  transform: rotate(-6deg); box-shadow: 0 0 22px rgba(120, 118, 110, 0.3);
  animation: seal-in 0.7s cubic-bezier(0.2, 1.4, 0.4, 1) 0.65s both;
}
.ep-copy { max-width: 660px; margin: 34px auto 0; text-align: center; animation: ep-copy-in 1s ease 0.25s both; }
.ep-copy p { line-height: 2.2; font-size: 1.05rem; color: #cfc9ba; margin: 0 0 0.8em; }

/* 通第零笔：把残页做成一条看得见的线索 */
.grey-clue {
  display: flex; flex-direction: column; align-items: center; gap: 7px;
  max-width: 470px; margin: 28px auto 4px; padding: 16px 22px;
  border: 1px dashed rgba(154, 122, 85, 0.42);
  background: linear-gradient(180deg, rgba(34, 25, 15, 0.5), rgba(20, 14, 9, 0.5));
  text-decoration: none; cursor: pointer;
  transition: border-color 0.5s ease, background 0.5s ease, box-shadow 0.5s ease;
}
.grey-clue:hover { border-color: rgba(224, 178, 92, 0.8); background: rgba(42, 30, 17, 0.66); box-shadow: 0 0 26px rgba(224, 178, 92, 0.2); }
.clue-tag { font-size: 0.68rem; letter-spacing: 0.36em; color: #8a6f4d; }
.clue-text { color: #bfa578; font-size: 0.9rem; letter-spacing: 0.06em; transition: color 0.5s ease; }
.clue-go { font-size: 0.74rem; letter-spacing: 0.2em; color: #7a5b36; transition: color 0.5s ease; }
.grey-clue:hover .clue-text, .grey-clue:hover .clue-go { color: #f0c884; }

.ep-copy .btn-flat { margin-top: 20px; }

@keyframes ep-in { from { opacity: 0; transform: scale(1.035); } to { opacity: 1; transform: scale(1); } }
@keyframes ep-breathe { from { filter: grayscale(0.28) sepia(0.14) contrast(1.06) brightness(0.82); } to { filter: grayscale(0.28) sepia(0.14) contrast(1.06) brightness(0.92); } }
@keyframes ep-copy-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes cap-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes seal-in { from { opacity: 0; transform: rotate(-6deg) scale(0.35); } to { opacity: 1; transform: rotate(-6deg) scale(1); } }

@media (prefers-reduced-motion: reduce) {
  .ep-hero, .ep-hero img, .ep-cap, .ep-seal, .ep-copy { animation: none; }
  .ep-embers i { animation: none; opacity: 0; }
}

@media (max-width: 720px) {
  .ep-hero { aspect-ratio: 16 / 9; }
  .ep-cap { left: 20px; bottom: 18px; }
  .ep-seal { width: 50px; height: 50px; font-size: 26px; top: 14px; right: 14px; }
  .grey-clue { margin: 22px 0 4px; }
}
</style>

<template>
  <div class="search-page" :class="{ landing: !q }">
    <div v-if="!q" class="search-landing-head">
      <p class="search-landing-kicker">杭州民俗数字档案馆</p>
      <h1>馆藏检索</h1>
    </div>

    <form class="archive-searchbar" @submit.prevent="goSearch" role="search">
      <label for="search-input" class="visually-hidden">检索馆藏</label>
      <input id="search-input" v-model="kw" :placeholder="q ? '再次检索馆藏…' : '检索馆藏、文书、图档…'" />
      <button type="submit">检索</button>
    </form>

    <template v-if="q && results.length">
      <h2 class="section-title">检索结果 <small>共 {{ results.length }} 条</small></h2>
      <p class="muted search-result-desc">关键词：{{ q }}。默认按相关度排列。</p>

      <div v-for="(r, i) in results" :key="i" class="archive-panel search-result-panel">
        <div class="search-result-header">
          <h2 class="search-result-title"><RouterLink v-if="r.to" :to="r.to">{{ r.title }}</RouterLink><span v-else>{{ r.title }}</span></h2>
          <span class="pill">{{ r.type }}</span>
        </div>
        <p class="muted search-result-id">{{ r.id }}</p>
        <p>{{ r.desc }}</p>

        <div v-if="r.snippet" class="snippet-block" :class="{ flashed: flashDone }">
          <div class="snippet-title">正文摘录（前 5 条记录）</div>
          <div class="table-wrapper">
            <table class="archive-table">
              <thead><tr><th>日期</th><th>摘要</th><th>金额</th></tr></thead>
              <tbody>
                <tr v-for="(s, si) in snippetRows" :key="si">
                  <td>{{ s.date }}</td>
                  <td>{{ s.note }}</td>
                  <td>{{ s.amount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Transition name="fade">
            <div v-if="showGhost" class="ghost-line">不欠了，开门。</div>
          </Transition>
        </div>
      </div>
    </template>

    <div v-else-if="q" class="archive-panel search-fail">
      <h2>检索失败</h2>
      <p>没有检索到与「{{ q }}」匹配的馆藏。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { familyUnlocked } from '../../store/archive-notify'
import { markShenSearched } from '../../stores/game'

const route = useRoute()
const router = useRouter()
const kw = ref('')
const q = ref('')
const showGhost = ref(false)
const flashDone = ref(false)
let timer = null

const ALL = [
  { to: '/collection/HZ-1927-0512', title: '万和号商号流水账', type: '档案 · 全文公开', id: '馆藏号 HZ-1927-0512', desc: '民国十六年至二十一年，杭州城南绸布南北货商号。日记流水体，毛笔书写，共 86 页，含每月小计与年终汇算。', kw: ['万和号', '账簿', '流水账', '商号', '账'], snippet: true },
  // —— 数字化专题：档案资源整理（民俗学视角，无具体地域） ——
  { title: '财神信俗文献辑录', type: '文献辑录', id: '专题 CW-0001', desc: '辑录各地财神信俗相关的经册、祝文、杂记与口述史料，依主题编次以供检索。', kw: ['信俗', '文献', '辑录', '财神'] },
  { title: '财神年画图档整理', type: '图档整理', id: '专题 CW-0002', desc: '对旧历年画中的财神题材图档进行分类著录，附元宝、聚宝盆、如意等吉祥符号考。', kw: ['年画', '图档', '财神'] },
  { title: '民间商号文书著录', type: '文书著录', id: '专题 CW-0003', desc: '著录民间商号的经营账簿、契约与票单据，为商俗与经济史研究提供原始材料。', kw: ['商号', '文书', '著录', '账簿'] },
  { title: '财神祭祀祝文辑录', type: '祝文辑录', id: '专题 CW-0004', desc: '收录岁首迎财、商铺开市等场合所用的祭祀祝文与祈财疏文，可窥民间仪式语汇。', kw: ['祝文', '祭祀', '疏文'] },
  { title: '民俗碑记拓片整理', type: '拓片整理', id: '专题 CW-0005', desc: '整理记录地方慈善、行会与祭祀碑文的拓片，兼及碑刻书风与款识的著录说明。', kw: ['拓片', '碑记', '碑刻', '慈善'] },
  { title: '民间求财旧俗考释', type: '旧俗考释', id: '专题 CW-0006', desc: '考释开市点灯、破五迎财、供三牲等民间求财旧俗的仪式做法与背后寓意。', kw: ['求财', '旧俗', '考释', '破五'] },
  { title: '财神谱系田野调查', type: '田野调查', id: '专题 CW-0007', desc: '通过田野访谈梳理民间财神谱系的区域性差异，兼及仪式性拜财行为的当代形态。', kw: ['谱系', '田野', '调查', '财神'] },
  // —— 近期上线：知识研究成果 ——
  { title: '五路财神的来源与流变', type: '民俗考源', id: '专题 CW-0008', desc: '梳理"五路财神"由五方之神到财神谱系的演化脉络，兼及"路路通财"的心理祈愿。', kw: ['五路', '财神', '来源', '流变'] },
  { title: '赵公明：从瘟神到财神的演变', type: '信仰演变', id: '专题 CW-0009', desc: '考述赵公明自汉魏厉鬼、魏晋瘟神，至明清定型为"金龙如意正一龙虎玄坛真君"财神的演变。', kw: ['赵公明', '瘟神', '玄坛', '演变'] },
  { title: '武财神关羽的忠义财道', type: '人物考源', id: '专题 CW-0010', desc: '关羽因"挂印封金""一介不取"的忠信义举，被商贾奉为以信义立业之武财神。', kw: ['关羽', '武财神', '忠义', '诚信'] },
  { title: '文财神比干的无私之德', type: '人物考源', id: '专题 CW-0011', desc: '比干因无心而无偏私，被奉为公正无私的文财神，体现"无私方能聚财"的民间财富伦理。', kw: ['比干', '文财神', '无私', '公正'] },
  { title: '小五路财神与招宝纳珍考辨', type: '谱系考辨', id: '专题 CW-0012', desc: '考辨赵公明麾下招宝天尊、纳珍天尊、招财使者、利市仙官"小五路"的构成与职司。', kw: ['小五路', '招宝', '纳珍', '利市'] },
  { title: '「君子爱财，取之有道」考释', type: '思想考释', id: '专题 CW-0013', desc: '由《论语》富与贵之辩出发，考释"取之有道""为富且仁"在民间财神信俗中的渗透。', kw: ['取之有道', '君子爱财', '为富且仁', '义利'] },
  { title: '「以德聚财，以财济世」理念溯源', type: '思想考释', id: '专题 CW-0014', desc: '探讨财神信俗精髓"以德聚财、以财济世"，如何体现民间光明磊落的财富观。', kw: ['以德聚财', '济世', '财富观'] },
  // —— 隐匿族谱：解锁后才会出现 ——
  { to: '/archives/SP-1927-0007', title: '沈晚族谱', type: '家谱档案', id: '馆藏号 SP-1927-0007', hidden: true, desc: '万和号店主沈氏一族家谱。谱末一栏记其后人：女，沈晚。父，沈砚秋。', kw: ['沈晚', '族谱', '沈砚秋', '家谱'] }
]

const results = computed(() => {
  const key = q.value.trim()
  if (!key) return []
  return ALL.filter(r => {
    if (r.hidden && !familyUnlocked()) return false
    return r.kw.some(k => key.includes(k) || k.includes(key))
  })
})

const snippetRows = [
  { date: '民国十七年 正月初五', note: '迎财神，店门启，香烛一串', amount: '0.30' },
  { date: '民国十七年 正月廿三', note: '补米五斗，赊账记东家名下', amount: '3.20' },
  { date: '民国十七年 二月十一', note: '药铺结账，当归黄芪各若干', amount: '1.15' },
  { date: '民国十七年 三月初九', note: '置夏衣布两匹，伙计各裁一件', amount: '2.60' },
  { date: '民国十七年 三月廿一', note: '南货到岸，付脚力钱', amount: '0.80' }
]

function goSearch() {
  const v = kw.value.trim()
  if (!v) { router.replace({ path: '/search' }); return }
  if (/沈砚秋/.test(v)) markShenSearched()
  router.replace({ path: '/search', query: { q: v } })
}

function applyQuery() {
  q.value = (route.query.q || '').toString()
  if (/沈砚秋/.test(q.value)) markShenSearched()
  kw.value = q.value
  flashDone.value = false
  showGhost.value = false
  if (timer) clearTimeout(timer)
  const hasSnippet = results.value.some(r => r.snippet)
  if (hasSnippet) {
    timer = setTimeout(() => {
      showGhost.value = true
      flashDone.value = true
      setTimeout(() => { showGhost.value = false }, 900)
    }, 1600)
  }
}

watch(() => route.query.q, applyQuery)
onMounted(applyQuery)
onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped>
.search-page {
  overflow-anchor: none;
}
.search-page.landing {
  min-height: calc(100vh - 240px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 10vh;
  text-align: center;
}
.search-landing-kicker {
  margin: 0 0 8px;
  font-size: 13px;
  letter-spacing: 4px;
  color: #6d5d42;
}
.search-landing-head h1 {
  margin: 0;
  font-size: 36px;
  font-weight: 600;
  letter-spacing: 8px;
  color: #3c3020;
}
.search-page.landing .archive-searchbar {
  margin-top: 28px;
  width: min(640px, 100%);
  max-width: none;
}
.search-fail h2 {
  margin: 0 0 8px;
}
.snippet-block { margin-top: 10px; border-top: 1px dashed #cdbb94; padding-top: 8px; }
.snippet-title { font-size: 13px; color: #6d5d42; margin-bottom: 6px; }
.ghost-line {
  margin-top: 8px; padding: 6px 12px;
  background: rgba(140,47,36,.08); border-left: 3px solid #8c2f24;
  color: #6f241c; font-size: 14px; letter-spacing: 1px;
}
.fade-enter-active, .fade-leave-active { transition: opacity .35s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

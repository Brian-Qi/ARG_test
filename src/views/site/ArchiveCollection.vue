<template>
  <div>
    <p class="collection-back"><RouterLink class="back-link" to="/search?q=万和号">← 返回检索结果</RouterLink></p>

    <!-- 题名与著录 -->
    <article class="archive-panel">
      <div class="collection-header">
        <span class="pill">馆藏号 HZ-1927-0512</span>
        <span class="pill">全文公开</span>
        <span class="pill muted pill-faded">民国十六年至二十一年</span>
      </div>
      <h2 class="collection-title">万和号商号流水账</h2>
      <p class="muted collection-desc">杭州城南绸布南北货商号 · 日记流水体 · 毛笔书写</p>
      <hr class="collection-divider" />
      <div class="table-wrapper">
        <table class="archive-table collection-table">
          <tbody>
            <tr><th class="table-key-col">馆藏号</th><td>HZ-1927-0512</td></tr>
            <tr><th>题名</th><td>万和号流水账（民国十六年至二十一年）</td></tr>
            <tr><th>年代</th><td>民国十六年（1927）— 民国二十一年（1932）</td></tr>
            <tr><th>载体</th><td>毛边纸线装，墨笔，页角部分缺损</td></tr>
            <tr><th>数量</th><td>共 86 页，含每月小计与年终汇算</td></tr>
            <tr><th>来源</th><td>万和号后人捐赠，2024 年入藏</td></tr>
            <tr><th>数字化</th><td>逐页扫描 · 全文著录 · 双人复核</td></tr>
          </tbody>
        </table>
      </div>
      <p class="muted collection-note">
        复核说明：因纸张脆化，个别影像页与目录著录存在一位错位，正按纸质原件比对，过程见
        <RouterLink to="/records/corrections" class="collection-link">数据校正记录</RouterLink>。
      </p>
    </article>

    <!-- 影像缩略 -->
    <section class="collection-section">
      <h2 class="section-title collection-section-title">影像浏览 <small>Page Images</small></h2>
      <p class="muted collection-section-title">以列表形式逐页查看该册影像（演示站以文本替图），每页 10 条。</p>

      <!-- 花屏层：多条细竖带错开循环闪，进入瞬间 + 第 0 页期间持续 -->
      <!-- 转场闪屏：进出切换时闪现的横向裂纹花屏 -->
      <div v-if="glitchFlash" class="tv-glitch" aria-hidden="true"></div>

      <!-- 第 0 页常驻花屏：条形码式枣红，持续闪烁 -->
      <div v-if="showHidden" class="hidden-glitch" aria-hidden="true">
        <i v-for="(b, i) in bars" :key="i" class="glitch-bar" :style="barStyle(b)"></i>
      </div>

      <!-- 正常列表（含第 0 页隐藏残页以外的页） -->
      <div v-if="!showHidden" class="pg-sheet">
        <div class="pg-list-head" aria-hidden="true">
          <span class="pg-head-word">页字</span>
          <span>摘要</span>
          <span>金额</span>
        </div>
        <button
          v-for="p in currentPageItems"
          :key="p.idx"
          type="button"
          class="pg-row"
          @click="openPage(p.idx)"
        >
          <span class="pg-col-word">{{ p.char }}</span>
          <span class="pg-col-note">{{ p.note }}</span>
          <span class="pg-col-amt">{{ p.amount }}</span>
        </button>
      </div>

      <!-- 第 0 页：无页码残页（隐藏内容） -->
      <div v-else ref="hiddenPageRef" class="pg-sheet pg-hidden-page">
        <div class="pg-glitch" :class="{ collapse: collapseActive, shaking }" aria-hidden="true"><span>{{ text }}</span><span class="typing-caret"></span></div>
      </div>

      <nav class="pg-nav" aria-label="影像翻页">
        <button v-if="page > 0" :key="'nav-prev'" type="button" class="pg-nav-btn" :class="{ 'pg-nav-hide': showHidden }" @click="goPage(page - 1)" aria-label="上一页">‹</button>
        <button v-else :key="'nav-secret-' + tapFeedback" type="button" class="pg-nav-btn pg-secret" :class="{ 'pg-nav-hide': showHidden, 'pg-secret-hot': secretTaps === 5, 'pg-secret-tap': secretTaps > 0 && secretTaps < 5 }" @click="onSecretTap" aria-label="隐藏入口"></button>
        <span class="pg-nav-info">{{ showHidden ? '第 0 页' : '第 ' + (page + 1) + ' / ' + totalPages + ' 页' }}</span>
        <button type="button" class="pg-nav-btn" :class="{ 'pg-nav-hide': showHidden || page >= totalPages - 1 }" @click="onNext">›</button>
      </nav>
    </section>

    <!-- 血红色调遮罩：第 0 页时覆盖全屏 -->
    <div v-if="bloodMode" class="blood-veil" aria-hidden="true"></div>

    <!-- 著录目录下载 -->
    <section class="collection-section">
      <h2 class="section-title collection-section-title">著录目录 <small>Catalog CSV</small></h2>
      <div class="archive-panel">
        <p class="collection-notice-text">按页著录的目录数据，含页码、日期、摘要与金额，可直接用于书目整理与统计。演示环境以预览方式展示，可复制。</p>
        <button class="btn-flat" type="button" @click="showCsv = true">下载著录目录（CSV）</button>
      </div>
    </section>

    <!-- 关联公告 -->
    <section class="archive-panel collection-notice">
      <p class="collection-notice-text">关联公告：<RouterLink to="/notice/3" class="collection-link">关于"近代商号账簿数字化（第一批）"全文开放的说明</RouterLink></p>
    </section>

    <!-- 影像弹层 -->
    <div v-if="cur" class="archive-modal-mask" @click.self="cur = null">
      <div class="archive-modal">
        <button class="modal-close" @click="cur = null">关闭</button>
        <h3>{{ cur.label || '影像预览' }}</h3>
        <p v-if="cur.caption" class="muted modal-caption">{{ cur.caption }}</p>
        <div v-if="cur.lines" class="page-sim">
          <p v-for="(l, li) in cur.lines" :key="li">{{ l }}</p>
        </div>
        <pre v-else class="glitch-sim" aria-hidden="true">{{ cur.glitch }}</pre>
      </div>
    </div>

    <!-- CSV 预览弹层 -->
    <div v-if="showCsv" class="archive-modal-mask" @click.self="showCsv = false">
      <div class="archive-modal">
        <button class="modal-close" @click="showCsv = false">关闭</button>
        <h3>著录目录预览（HZ-1927-0512.csv）</h3>
        <p class="muted modal-label">页码, 日期, 摘要, 金额</p>
        <button class="btn-flat modal-btn" type="button" @click="copyCsv">复制 CSV</button>
        <div class="csv-view">
          <div
            v-for="(line, i) in csvLines"
            :key="i"
            class="csv-line"
            :class="{ 'csv-corrupt': i === csvLines.length - 1 }"
            @click="onCsvLine(i)"
          >{{ line }}</div>
        </div>
      </div>
    </div>

    <!-- 残页 P000 提示弹层 -->
    <div v-if="zeroHint" class="archive-modal-mask" @click.self="zeroHint = false">
      <div class="archive-modal zero-hint">
        <button class="modal-close" @click="zeroHint = false">关闭</button>
        <h3>残页 · P000</h3>
        <p class="zero-hint-tip">{{ zeroHintText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, nextTick } from 'vue'
import { markSeenHidden } from '../../stores/game'

const pad = (n) => String(n).padStart(3, '0')

const CHARS = ['香', '烛', '米', '布', '药', '茶', '纸', '油', '钱', '衣', '灯', '炭', '糖', '盐', '酒', '绒', '绸', '线']
const YEARS = ['民国十六年', '民国十七年', '民国十八年', '民国十九年', '民国二十年', '民国二十一年']
const NOTES = [
  '迎财神，香烛纸马一宗', '补米五斗，记东家账', '药铺结账，当归黄芪各若干',
  '置布两匹，伙计各裁一件', '南货到岸，付脚力钱', '收茶叶款，洋讫',
  '还前欠，洋讫', '修后间屋顶，瓦工钱', '付灯油钱', '年节赏伙计', '账房杂支', '车马费'
]
const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)]
const monthOf = (i) => `正月 ${String((i % 28) + 1).padStart(2, '0')}`
const amt = () => (Math.floor(Math.random() * 950) / 100 + 0.05).toFixed(2)

// 影像共 87 格：无页码残页置于第 0 位（隐藏待揭示），其余 86 格为正常著录页
const TOTAL = 87
const NORMAL = TOTAL - 1
const pages = Array.from({ length: TOTAL }, (_, i) => {
  if (i === 0) {
    return { hidden: true, idx: 0, char: '\uFFFD', no: '', year: '', note: '', amount: '', month: '' }
  }
  const n = i - 1
  const y = YEARS[Math.min(5, Math.floor(n / 15))]
  return { hidden: false, idx: i, char: rnd(CHARS), no: `第 ${n + 1} 页`, year: y, note: rnd(NOTES), amount: amt(), month: monthOf(n) }
})

const visiblePages = computed(() => pages.filter((p) => !p.hidden))

const PER_PAGE = 10
const page = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(visiblePages.value.length / PER_PAGE)))
const currentPageItems = computed(() => {
  const start = page.value * PER_PAGE
  return visiblePages.value.slice(start, start + PER_PAGE)
})

const showHidden = ref(false)
const hiddenPageRef = ref(null)
const glitchFlash = ref(false)
const bloodMode = ref(false)
const secretTaps = ref(0)
const tapFeedback = ref(0)
let secretTimer = null
let typer = null

// 花屏条带：多条细竖带，位置/轨迹/延时错开，形成多处循环闪
const bars = ref([])
function genBars() {
  const n = 7
  const arr = []
  for (let i = 0; i < n; i++) {
    const dir = i % 2 === 0 ? 1 : -1
    arr.push({
      y: 6 + Math.round(Math.random() * 86),
      from: Math.round((Math.random() * 70 - 40) * dir),
      amp: 60 + Math.round(Math.random() * 60),
      dur: (0.3 + Math.random() * 0.35).toFixed(2) + 's',
      delay: (Math.random() * 0.3).toFixed(2) + 's',
      o: (0.55 + Math.random() * 0.4).toFixed(2)
    })
  }
  bars.value = arr
}
function barStyle(b) {
  return {
    '--y': b.y + '%',
    '--from': b.from + '%',
    '--mid': (b.from + b.amp * 0.5) + '%',
    '--to': (b.from + b.amp) + '%',
    '--dur': b.dur,
    '--delay': b.delay,
    '--o': b.o
  }
}

// 第 0 页残页内容：乱码、非常见符号与卦象（打字机逐字显示）
const hiddenGlitch =
  '\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD 页\n' +
  '\u6C11\u56FD\u5341\u4E03\u5E74 \u6B63\u6708\u521D\u4E94\n' +
  '\u9999\uFFFD\uFFFD\uFFFD \uFFFD \uFFFD\uFFFD\uFFFD\n' +
  '\uFFFD\uFFFD \uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD 0.\uFFFD0\n' +
  '\u2610 \u2611 \u25AB \u25A0 \u25A1 \u25A3\n' +
  '\u2630 \u2631 \u2632 \u2633 \u2634 \u2635 \u2636 \u2637\n' +
  '\u4DC0 \u4DC1 \u4DC2 \u4DC3 \u4DC4 \u4DC5 \u4DC6 \u4DC7\n' +
  '\u4DC8 \u4DC9 \u4DCA \u4DCB \u4DCC \u4DCD \u4DCE \u4DCF\n' +
  '\u4DD0 \u4DD1 \u4DD2 \u4DD3 \u4DD4 \u4DD5\n' +
  '\u262F \u25C9 \u25CE \u2600 \u263D \u263E\n' +
  '\u4E0D\u6B20\u4E86\u3002\u958B\u9580\u3002\u4E0D\u6B20\u4E86\u3002\u958B\u9580\u3002'

function onSecretTap() {
  if (showHidden.value) return
  if (secretTimer) clearTimeout(secretTimer)
  secretTaps.value++
  tapFeedback.value++
  if (secretTaps.value >= 6) {
    secretTaps.value = 0
    tapFeedback.value = 0
    enterHidden()
    return
  }
  secretTimer = setTimeout(() => {
    secretTaps.value = 0
    tapFeedback.value = 0
  }, 700)
}

function onNext() {
  if (showHidden.value) {
    exitHidden()
    return
  }
  goPage(page.value + 1)
}

function lockScroll() {
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
}
function unlockScroll() {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
}

// 过渡式文字恐怖：normalText 逐字打出 → 逐字被替换成乱码 → 整屏崩坏
const normalText =
  '\u6C11\u56FD\u5341\u4E03\u5E74 \u6B63\u6708\u521D\u4E94\n' +
  '\u842C\u548C\u865F \u00B7 \u820A\u8CEC\n' +
  '\u7C73 \u85E5 \u8863 \u71C8 \u4EBA\n' +
  '\u4E94\u7B46 \u96F6 \u96F6 \u96F6 \u96F6 \u96F6\n' +
  '\u9999 \u71ED \u7D19 \u99AC \u4E00 \u5B97\n' +
  '\u6771 \u5357 \u897F \u5317 \u4E2D \u4E94 \u8DEF\n' +
  '\u4E94\u8DEF \u901A\u8CA1 \u8DEF\u8DEF \u901A\u8CA1\n' +
  '\u8863 \u98EF \u796D \u62DC \u820A \u4FD7\n' +
  '\u9580 \u5F8C \u6709 \u4EBA \u2026\n' +
  '\u4E0D\u6B20\u4E86\u3002\u958B\u9580\u3002\u4E0D\u6B20\u4E86\u3002\u958B\u9580\u3002\n' +
  '\u4E0D\u6B20\u4E86\u3002\u958B\u9580\u3002\u4E0D\u6B20\u4E86\u3002\u958B\u9580\u3002\n' +
  '\u7C73 \u85E5 \u8863 \u71C8 \u4EBA\n' +
  '\u4E94\u7B46 \u96F6 \u96F6 \u96F6 \u96F6 \u96F6\n' +
  '\u6C11\u56FD\u5341\u4E03\u5E74 \u6B63\u6708\u521D\u4E94'
const glitchChars = [
  '\uFFFD', '\u2630', '\u2631', '\u2632', '\u2633', '\u2634', '\u2635', '\u2636', '\u2637',
  '\u4DC0', '\u4DC1', '\u4DC2', '\u4DC3', '\u4DC4', '\u4DC5', '\u4DC6', '\u4DC7',
  '\u25A0', '\u25A1', '\u25AB', '\u2610', '\u2611', '\u262F', '\u25C9', '\u25CE', '\u25CF', '\u25CB'
]
const text = ref('')
const collapseActive = ref(false)
const shaking = ref(false)
let polluter = null

function startTyping() {
  text.value = ''
  collapseActive.value = false
  let i = 0
  typer = setInterval(() => {
    text.value += normalText[i]
    i++
    if (i >= normalText.length) {
      clearInterval(typer)
      typer = null
      startPollute()
    }
  }, 55)
}

function startPollute() {
  polluter = setInterval(() => {
    const arr = text.value.split('')
    const idx = arr.map((c, k) => (/[\u4e00-\u9fff]/.test(c) ? k : -1)).filter((k) => k >= 0)
    if (idx.length === 0) { startCollapse(); return }
    const times = Math.min(2, idx.length)
    for (let t = 0; t < times; t++) {
      const pos = idx[Math.floor(Math.random() * idx.length)]
      arr[pos] = glitchChars[Math.floor(Math.random() * glitchChars.length)]
      idx.splice(idx.indexOf(pos), 1)
    }
    text.value = arr.join('')
    if (idx.length <= 2) startCollapse()
  }, 32)
}

function startCollapse() {
  collapseActive.value = true
  if (polluter) clearInterval(polluter)
  polluter = null
  typer = setInterval(() => {
    const arr = text.value.split('')
    const idx = arr.map((c, k) => (/[\u4e00-\u9fff]/.test(c) ? k : -1)).filter((k) => k >= 0)
    if (idx.length === 0) {
      clearInterval(typer)
      typer = null
      startShakeExit()
      return
    }
    const pos = idx[Math.floor(Math.random() * idx.length)]
    arr[pos] = glitchChars[Math.floor(Math.random() * glitchChars.length)]
    text.value = arr.join('')
  }, 30)
}

// 崩坏结束后：剧烈振动 5 次，然后自动返回正常页面
function startShakeExit() {
  shaking.value = true
  let n = 0
  const iv = setInterval(() => {
    n++
    if (n >= 5) {
      clearInterval(iv)
      shaking.value = false
      exitHidden()
    }
  }, 600)
}

function stopTyping() {
  if (typer) clearInterval(typer)
  if (polluter) clearInterval(polluter)
  typer = null
  polluter = null
  collapseActive.value = false
}

function enterHidden() {
  if (secretTimer) { clearTimeout(secretTimer); secretTimer = null }
  secretTaps.value = 0
  markSeenHidden()
  genBars()
  glitchFlash.value = true
  setTimeout(async () => {
    showHidden.value = true
    glitchFlash.value = false
    bloodMode.value = true
    await nextTick()
    focusHidden()
    lockScroll()
    startTyping()
  }, 500)
}

function focusHidden() {
  const el = hiddenPageRef.value
  if (el) el.scrollIntoView({ block: 'center', behavior: 'auto' })
}

function exitHidden() {
  stopTyping()
  shaking.value = false
  collapseActive.value = false
  glitchFlash.value = true
  setTimeout(() => {
    showHidden.value = false
    bloodMode.value = false
    unlockScroll()
    glitchFlash.value = false
    text.value = ''
    page.value = 0
  }, 500)
}

function goPage(p) {
  if (p < 0 || p >= totalPages.value) return
  page.value = p
}

onBeforeUnmount(() => {
  stopTyping()
  unlockScroll()
})

const cur = ref(null)
function openPage(idx) {
  const p = pages[idx]
  if (p.hidden || p.no === '') {
    cur.value = { label: null, caption: null, lines: null, glitch: hiddenGlitch }
    return
  }
  cur.value = {
    label: p.no,
    caption: `${p.year} · 账页影像（演示为文本）`,
    lines: [
      p.year + ' 初五 · 万和号',
      '摘要：' + p.note,
      '金额：' + p.amount
    ]
  }
}

// 著录目录 CSV：正文 86 行 + 目录外残页行（无日期、无摘要、无金额，页码以 P000 占位）
const csvText = computed(() => {
  const head = '页码,日期,摘要,金额'
  const body = visiblePages.value.map((p, i) => `P${pad(i + 1)},${p.year} ${p.month},${p.note},${p.amount}`)
  return [head, ...body, 'P000,民国\uFFFD\uFFFD\uFFFD年,\uFFFD月\uFFFD\uFFFD,\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD,\uFFFD\uFFFD\uFFFD'].join('\n')
})
const showCsv = ref(false)
const zeroHint = ref(false)
const csvLines = computed(() => csvText.value.split('\n'))
function onCsvLine(i) {
  if (i === csvLines.value.length - 1) zeroHint.value = true
}

// 残页提示：正文之间掺入乱码（文字恐怖谷 / 火星文 / 组合符），但保持可读
const ZERO_HINT = '册外之页。欲观，于伊始叩左六。'
const HINT_NOISE = [
  '\u0334', '\u0335', '\u0336', '\u0337', '\u0338', '\u0301', '\u0303', '\u0308', '\u030A',
  '\u25A0', '\u25A1', '\u25AB', '\u25AD', '\u25AE', '\u25C7', '\u25C8', '\u25CE', '\u25CF', '\u25EF',
  '\u2630', '\u2631', '\u2632', '\u2633', '\u2634', '\u2635', '\u2636', '\u2637',
  '\u4DC0', '\u4DC1', '\u4DC2', '\u4DC3', '\u4DC4', '\u4DC5', '\u4DC6', '\u4DC7',
  '\uFFFD', '\u00A7', '\u00B6', '\u2020', '\u2021', '\u00D7', '\u00F7',
  '\u2211', '\u221A', '\u221E', '\u222B', '\u2260', '\u2261', '\u2295', '\u2297', '\u2299',
  '\uFF71', '\uFF72', '\uFF73', '\uFF9E', '\uFF9F'
]
const zeroHintText = (() => {
  let out = ''
  for (let i = 0; i < ZERO_HINT.length; i++) {
    const c = ZERO_HINT[i]
    out += c
    if (c === '。' || c === '，') continue
    const r = Math.random()
    const n = r < 0.5 ? 1 : (r < 0.72 ? 2 : 0)
    for (let k = 0; k < n; k++) out += HINT_NOISE[Math.floor(Math.random() * HINT_NOISE.length)]
  }
  return out
})()

async function copyCsv() {
  try {
    await navigator.clipboard.writeText(csvText.value)
  } catch (e) {
    /* 剪贴板不可用时忽略 */
  }
}
</script>

<style scoped>
.pg-sheet {
  border: 1px solid #e0d2b4;
  border-radius: 4px;
  background: #f9f3e4;
  overflow: hidden;
}
.pg-list-head,
.pg-row {
  display: grid;
  grid-template-columns: 64px 1fr 90px;
  gap: 12px;
  align-items: center;
  padding: 12px 18px;
}
.pg-list-head {
  background: #efe2c4;
  font-size: 12px;
  color: #6d5d42;
  letter-spacing: 1px;
  font-family: inherit;
}
.pg-head-word {
  font-family: inherit;
  font-style: normal;
}
.pg-row {
  width: 100%;
  border: 0;
  border-top: 1px solid #e8dcbe;
  background: transparent;
  text-align: left;
  font-family: inherit;
  font-size: 14px;
  color: #4a3d29;
  cursor: pointer;
  transition: background 0.15s;
}
.pg-row:first-of-type {
  border-top: 0;
}
.pg-row:hover {
  background: rgba(140, 47, 36, 0.06);
}
.pg-row:focus {
  outline: 2px solid #8c2f24;
  outline-offset: -2px;
}
.pg-col-amt {
  color: #6d5f45;
  font-size: 13px;
  white-space: nowrap;
}
.pg-col-word {
  font-family: "Ma Shan Zheng", "KaiTi", serif;
  font-size: 22px;
  color: #6e5a3c;
  line-height: 1;
}
.pg-col-note {
  color: #6d5f45;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pg-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin-top: 16px;
}
.pg-nav-btn {
  border: 0;
  background: transparent;
  color: #8c2f24;
  padding: 4px 10px;
  border-radius: 3px;
  font-family: inherit;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
}
.pg-nav-btn:hover {
  color: #5f1d15;
}
.pg-nav-hide {
  visibility: hidden;
  pointer-events: none;
}
.pg-secret {
  visibility: visible;
  opacity: 0;
  color: transparent;
  min-width: 33px;
  min-height: 34px;
  cursor: pointer;
  /* 扩大热区：让前几次点击也能被感知，不必精准点按钮 */
  position: relative;
}
.pg-secret::after {
  content: "";
  position: absolute;
  inset: -14px;
}
.pg-secret-tap {
  animation: secret-tap 0.22s ease;
}
@keyframes secret-tap {
  0% { transform: scale(0.88); }
  60% { transform: scale(1.12); }
  100% { transform: scale(1); }
}
.pg-secret-hot {
  opacity: 1;
  color: #8c2f24;
  border: 1px dashed rgba(140, 47, 36, 0.5);
  background: rgba(140, 47, 36, 0.08);
  animation: secret-pulse 0.5s ease;
}
@keyframes secret-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
.pg-nav-info {
  font-size: 13px;
  color: #6d5d42;
}

/* 第 0 页：无页码残页 */
.pg-hidden-page {
  background: #f1e8d4;
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 44px 30px;
}
.pg-glitch {
  width: min(520px, 100%);
  height: 650px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 22px;
  line-height: 1.8;
  letter-spacing: 3px;
  color: #8a4a36;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: "KaiTi", serif;
  border: 1px dashed rgba(138, 74, 54, 0.4);
  padding: 30px 24px;
  background: rgba(140, 47, 36, 0.05);
}
.typing-caret {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  margin-left: 2px;
  background: #8a4a36;
  vertical-align: text-bottom;
  animation: caret-blink 0.9s steps(1) infinite;
}
@keyframes caret-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 崩坏：残页剧烈抖动滑动，文字隐约滑出 */
.pg-glitch.collapse {
  animation: collapse-shake 0.14s steps(2) infinite;
}
.pg-glitch.collapse .typing-caret {
  display: none;
}
@keyframes collapse-shake {
  0%   { transform: translate(0, 0) rotate(0deg); }
  25%  { transform: translate(-3px, 2px) rotate(-0.6deg); }
  50%  { transform: translate(3px, -2px) rotate(0.5deg); }
  75%  { transform: translate(-2px, -3px) rotate(-0.4deg); }
  100% { transform: translate(2px, 2px) rotate(0.6deg); }
}
.pg-glitch.shaking {
  animation: collapse-shake 0.14s steps(2) infinite;
}

/* 血红色调遮罩：第 0 页时铺满全屏，把页面染成血红 */
.blood-veil {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;
  background:
    radial-gradient(circle at 50% 42%, rgba(150, 12, 6, 0.30), transparent 68%),
    linear-gradient(180deg, rgba(120, 6, 4, 0.34), rgba(60, 2, 1, 0.5));
  mix-blend-mode: multiply;
}

/* 转场闪屏：横向裂纹花屏，进出时闪现（浅红+血红，明区上下扫动，细线多道） */
.tv-glitch {
  position: fixed;
  inset: 0;
  z-index: 999;
  overflow: hidden;
  background: rgba(16, 6, 4, 0.86);
  pointer-events: none;
}
.tv-glitch::before,
.tv-glitch::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg,
      rgba(255, 130, 110, 0.32) 0 1px, transparent 1px 2px,
      rgba(255, 165, 145, 0.18) 2px 3px, transparent 3px 4px,
      rgba(226, 50, 34, 0.24) 4px 5px, transparent 5px 7px,
      rgba(255, 120, 100, 0.20) 7px 8px, transparent 8px 11px),
    linear-gradient(0deg,
      transparent 0 10%, rgba(200, 28, 16, 0.52) 10% 20%,
      transparent 20% 34%, rgba(255, 150, 128, 0.40) 34% 40%,
      transparent 40% 56%, rgba(180, 20, 12, 0.46) 56% 64%,
      transparent 64% 78%, rgba(255, 135, 112, 0.34) 78% 84%,
      transparent 84% 100%);
  background-size: 100% 300%;
}
.tv-glitch::before { animation: glitch-a 0.5s steps(3, end) infinite; }
.tv-glitch::after  { animation: glitch-b 0.4s steps(4, end) infinite; animation-delay: -0.2s; }
@keyframes glitch-a {
  0%   { background-position-y: 0%;   transform: translateX(-8px); opacity: .7; }
  50%  { background-position-y: 50%;  transform: translateX(10px); opacity: 1; }
  100% { background-position-y: 100%; transform: translateX(-5px); opacity: .75; }
}
@keyframes glitch-b {
  0%   { background-position-y: 100%; transform: translateX(9px);  opacity: .6; }
  50%  { background-position-y: 40%;  transform: translateX(-12px); opacity: .95; }
  100% { background-position-y: 0%;   transform: translateX(6px);  opacity: .7; }
}

/* 第 0 页常驻花屏：枣红底 + 多条细竖带（条形码质感）错开循环闪 */
.hidden-glitch {
  position: fixed;
  inset: 0;
  z-index: 998;
  overflow: hidden;
  background: radial-gradient(circle at 50% 50%,
    rgba(96, 12, 8, 0.45) 0%,
    rgba(60, 7, 4, 0.6) 68%,
    rgba(34, 3, 2, 0.72) 100%);
  pointer-events: none;
}
.hidden-glitch .glitch-bar {
  position: absolute;
  left: -6%;
  right: -6%;
  height: 8px;
  top: var(--y);
  opacity: var(--o);
  background:
    repeating-linear-gradient(90deg,
      rgba(232, 40, 28, 0.60) 0 2px, transparent 2px 4px,
      rgba(250, 62, 44, 0.45) 4px 6px, transparent 6px 9px,
      rgba(205, 30, 18, 0.55) 9px 11px, transparent 11px 16px,
      rgba(245, 56, 40, 0.35) 16px 18px, transparent 18px 22px);
  filter: blur(0.4px);
  animation: bar-scroll var(--dur) steps(6, end) infinite;
  animation-delay: var(--delay);
}
@keyframes bar-scroll {
  0%   { transform: translateX(var(--from)); opacity: 0; }
  12%  { opacity: var(--o); }
  45%  { transform: translateX(var(--mid)); opacity: var(--o); }
  78%  { opacity: calc(var(--o) * 0.5); }
  100% { transform: translateX(var(--to)); opacity: 0; }
}
.page-sim {
  background: #f3e9d2;
  border: 1px solid #e0d2b4;
  padding: 16px 20px;
  font-size: 15px;
  line-height: 2.2;
  color: #4a3d29;
  font-family: "Ma Shan Zheng", "KaiTi", serif;
  letter-spacing: 1px;
}
.page-sim p {
  margin: 0;
}
.glitch-sim {
  background: #f3e9d2;
  border: 1px solid #e0d2b4;
  padding: 16px 20px;
  color: #8a6f4d;
  font-size: 15px;
  line-height: 2;
  letter-spacing: 2px;
  white-space: pre-wrap;
  word-break: break-all;
}
.csv-view {
  background: #f6efdf;
  border: 1px solid #ded0b0;
  padding: 14px;
  font-size: 12px;
  line-height: 1.8;
  max-height: 46vh;
  overflow: auto;
  color: #3c3020;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: Consolas, "Courier New", monospace;
}
.csv-line {
  white-space: pre-wrap;
  word-break: break-all;
}
.csv-corrupt {
  cursor: pointer;
  color: #8a4a36;
  border-radius: 3px;
}
.csv-corrupt:hover {
  background: rgba(140, 47, 36, 0.08);
  color: #8c2f24;
}
.zero-hint-tip {
  color: #8c2f24;
  line-height: 2.4;
}
</style>

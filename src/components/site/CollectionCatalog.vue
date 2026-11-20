<template>
  <!-- 著录目录下载 -->
  <section class="collection-section">
    <h2 class="section-title collection-section-title">著录目录 <small>Catalog CSV</small></h2>
    <div class="archive-panel">
      <p class="collection-notice-text">
        按页著录的目录数据，含页码、日期、摘要与金额，可直接用于书目整理与统计。演示环境以预览方式展示，可复制。
      </p>
      <button class="btn-flat" type="button" @click="showCsv = true">下载著录目录（CSV）</button>
    </div>
  </section>

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
        >
          {{ line }}
        </div>
      </div>
    </div>
  </div>

  <!-- 残页 P000 提示弹层 -->
  <div v-if="zeroHint" class="archive-modal-mask" @click.self="zeroHint = false">
    <div class="archive-modal zero-hint">
      <button class="modal-close" @click="zeroHint = false">关闭</button>
      <h3>残页 · P000</h3>
      <p class="zero-hint-tip" :aria-label="ZERO_HINT">
        <span class="sr-only">{{ ZERO_HINT }}</span>
        <span aria-hidden="true">
          <span v-for="(ch, i) in frame" :key="i" class="zc" :class="{ nz: ch.noisy }">{{ ch.c }}</span>
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { glitchFrame } from '../../utils/glitchText'
import game from '../../stores/game'

// 可见著录页（由父级传入），CSV 正文据此生成
const props = defineProps({ pages: { type: Array, default: () => [] } })

const pad = (n) => String(n).padStart(3, '0')

// 著录目录 CSV：正文 86 行 + 目录外残页行（无日期、无摘要、无金额，页码以 P000 占位）
const csvText = computed(() => {
  const head = '页码,日期,摘要,金额'
  const body = props.pages.map((p, i) => `P${pad(i + 1)},${p.year} ${p.month},${p.note},${p.amount}`)
  return [
    head,
    ...body,
    'P000,民国\uFFFD\uFFFD\uFFFD年,\uFFFD月\uFFFD\uFFFD,\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD,\uFFFD\uFFFD\uFFFD'
  ].join('\n')
})
const showCsv = ref(false)
const zeroHint = ref(false)
const csvLines = computed(() => csvText.value.split('\n'))
function onCsvLine(i) {
  if (i === csvLines.value.length - 1) zeroHint.value = true
}

// 残页提示：同一句话在可读与崩坏之间逐帧跳。
// 乱码不是贴在字上的装饰，而是每秒都在抢这句话；隔一阵给一个干净窗口，让人刚好能读完。
// 话只有一句，不给台阶：看不懂就再看一遍。
const ZERO_HINT = '册外之页。欲观，于伊始叩左六。'

const frame = ref(glitchFrame(ZERO_HINT, { quiet: true }))
let ticker = null
let ticks = 0

function startTicker() {
  stopTicker()
  if (game.reduceMotion()) {
    frame.value = glitchFrame(ZERO_HINT, { quiet: true })
    return
  }
  ticks = 0
  ticker = setInterval(() => {
    ticks += 1
    // 每 26 帧（约 2.3s）给 7 帧（约 0.6s）干净窗口，其余帧按 0.32 概率咬字
    const quiet = ticks % 26 < 7
    frame.value = glitchFrame(ZERO_HINT, { quiet, rate: 0.32 })
  }, 90)
}

function stopTicker() {
  if (ticker) clearInterval(ticker)
  ticker = null
}

watch(zeroHint, (open) => {
  if (open) {
    frame.value = glitchFrame(ZERO_HINT, { quiet: false, rate: 0.55 })
    startTicker()
  } else {
    stopTicker()
  }
})

onBeforeUnmount(stopTicker)

async function copyCsv() {
  try {
    await navigator.clipboard.writeText(csvText.value)
  } catch (e) {
    /* 剪贴板不可用时忽略 */
  }
}
</script>

<style scoped>
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
  font-family: Consolas, 'Courier New', monospace;
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
  letter-spacing: 0.08em;
}
.zc {
  transition:
    color 90ms steps(2),
    opacity 90ms steps(2);
}
.zc.nz {
  color: rgba(140, 47, 36, 0.55);
  text-shadow: 0 0 6px rgba(140, 47, 36, 0.35);
  animation: zc-jitter 0.18s steps(2) infinite;
}
@keyframes zc-jitter {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-1px, 1px);
  }
  100% {
    transform: translate(1px, -1px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .zc.nz {
    animation: none;
  }
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}</style>

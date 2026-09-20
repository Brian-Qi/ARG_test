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
      <p class="zero-hint-tip">{{ zeroHintText }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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
    const n = r < 0.5 ? 1 : r < 0.72 ? 2 : 0
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
}
</style>

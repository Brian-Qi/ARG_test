<template>
  <div>
    <h2 class="section-title">数据校正记录 <small>Correction Log</small></h2>
    <p class="muted corrections-desc">本馆对已公开著录持续复核。凡发现讹误、缺漏或依规撤回的内容，均在此留痕，供学界与公众监督。</p>

    <div class="notice-list corrections-list">
      <div v-for="c in corrections" :key="c.id" class="corr-row">
        <div class="corr-head">
          <span class="corr-id">编号 {{ c.id }}</span>
          <time>{{ c.date }}</time>
          <span class="pill">{{ c.record }}</span>
          <span class="corr-status" :class="c.statusClass">{{ c.status }}</span>
        </div>
        <p class="corr-text">{{ c.text }}</p>
        <p v-if="c.author" class="corr-author">
          关联条目：<RouterLink :to="'/staff/' + encodeURIComponent(c.author)">{{ c.author }}</RouterLink>
          <span class="muted">（身份待核实）</span>
        </p>
        <button v-if="c.withdrawn" class="corr-withdrawn" type="button" @click="toggleWithdrawn(c.id)">
          {{ openWithdrawn === c.id ? '收起撤回前版本' : '查看撤回前版本' }}
        </button>
        <p v-if="c.withdrawn && openWithdrawn === c.id" class="corr-withdrawn-body">{{ c.withdrawn }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const openWithdrawn = ref(null)
function toggleWithdrawn(id) {
  openWithdrawn.value = openWithdrawn.value === id ? null : id
}

const corrections = [
  {
    id: 'C-2026-0513',
    date: '2026-08-30',
    record: 'HZ-1927-0512',
    status: '处理中',
    statusClass: 'warn',
    text: '复核发现万和号流水账著录目录与扫描影像的页码存在一位错位：目录著录“共 86 页”，影像装订似多出一页残页，暂未列入目录。已按纸质原件重新比对中，以原件为准，更正结果另行留痕。'
  },
  {
    id: 'C-2026-0024',
    date: '2026-08-27',
    record: 'HZ-1931-0220',
    status: '已更正',
    statusClass: 'ok',
    text: '云林禅寺经卷登记册著录中“韦驮殿”误作“韦陀殿”，已更正，并同步修正检索页摘要。感谢读者来信指正。'
  },
  {
    id: 'C-2026-0016',
    date: '2026-08-12',
    record: 'HZ-1927-0512',
    status: '已撤回',
    statusClass: 'revoke',
    text: '读者“沈晚”提交批注，主张万和号流水账存在五处错讹、并建议联系所谓“账房后人”核实。因批注所留联系方式无效、且“账房后人”身份无法核实，依《公开数据订正规程》第三条，该批注已撤回，不予公开。',
    withdrawn: '（原批注摘要）账房后人的说法有误。著录页码不止错一位。沈砚秋自 2026-06-11 之后，就再没有登录过系统。'
  },
  {
    id: 'C-2026-0009',
    date: '2026-07-02',
    record: 'HZ-1948-0136',
    status: '已更正',
    statusClass: 'ok',
    text: '施食台碑记拓片题名年代由“民国三十六年”更正为“民国三十七年”，与拓片落款一致。'
  },
  {
    id: 'C-2026-0002',
    date: '2026-06-11',
    record: 'HZ-1956-0082',
    status: '已更正',
    statusClass: 'ok',
    text: '灵顺寺旧影一组中两张照片拍摄方向标注相反，已对调。'
  }
]
</script>

<style scoped>
.corr-row {
  padding: 18px;
  border-bottom: 1px solid #e8dcbe;
  background: #f9f3e4;
}
.corr-row:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.corr-row:last-child {
  border-bottom: 0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.corr-head {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.corr-id {
  font-size: 12px;
  color: #6d5f45;
  background: #efe2c4;
  border-radius: 3px;
  padding: 1px 8px;
}
.corr-row time {
  color: #6d5d42;
  font-size: 13px;
}
.corr-status {
  margin-left: auto;
  font-size: 12px;
  padding: 1px 10px;
  border-radius: 999px;
  letter-spacing: 1px;
}
.corr-status.ok { background: rgba(74, 110, 60, 0.12); color: #46623a; border: 1px solid #46623a; }
.corr-status.warn { background: rgba(168, 122, 32, 0.12); color: #8a6414; border: 1px solid #8a6414; }
.corr-status.revoke { background: rgba(140, 47, 36, 0.1); color: #8c2f24; border: 1px solid #8c2f24; }
.corr-text {
  font-size: 14px;
  color: #4a3d29;
  line-height: 2;
  margin: 10px 0 4px;
}
.corr-author {
  font-size: 13px;
  color: #4a3d29;
  margin: 0;
}
.corr-author a {
  color: #8c2f24;
  text-decoration: none;
  border-bottom: 1px dashed #cdbb94;
}
.corr-author a:hover {
  text-decoration: underline;
}
.corr-withdrawn {
  margin-top: 10px;
  border: 0;
  background: transparent;
  color: #8c2f24;
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}
.corr-withdrawn:hover { color: #5f1d15; }
.corr-withdrawn-body {
  margin: 8px 0 0;
  font-size: 13px;
  color: #6f241c;
  background: rgba(140, 47, 36, 0.05);
  border-left: 3px solid #8c2f24;
  padding: 8px 12px;
}
</style>

<template>
  <div>
    <section class="archive-panel">
      <h2>未检索到该成员档案</h2>
      <p>
        在馆藏著录与《杭州民俗数字档案馆 · 工作人员名录》中，均未检索到名为 <b>{{ name }}</b> 的记录。
      </p>
      <p class="muted">可能原因：姓名著录有误；该成员不属于本馆编制；或相关条目已在历次校正中移除。</p>
      <RouterLink class="back-link" to="/records/corrections">← 返回数据校正记录</RouterLink>
      <span class="staff-gap" aria-hidden="true"></span>
      <RouterLink class="back-link" to="/">返回首页</RouterLink>
    </section>

    <!-- 极淡提示：公开页脚同色系、几乎不可见，仅高对比模式可读 -->
    <p class="faint-hint" aria-hidden="true">若为沈晚，去 /help 看看。</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const name = computed(() => decodeURIComponent(route.params.name || ''))
</script>

<style scoped>
.faint-hint {
  text-align: center;
  color: #ded3ba;
  font-size: 12px;
  letter-spacing: 2px;
  margin-top: 40px;
  user-select: none;
}
</style>

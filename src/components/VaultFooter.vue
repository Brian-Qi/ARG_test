<template>
  <footer class="vault-footer">
    <div class="vault-footer-inner">
      <div>
        <strong>杭州民俗数字档案馆</strong><br />
        <address class="vault-address">地址：杭州市西湖区…唔，湖好像干了　｜　开放时间：周二至周日 9:00—17:00，初五除外</address><br />
        本馆为公益性数字文化展示平台。个别卷宗调阅后，可能影响馆藏数量。
      </div>
      <nav aria-label="页脚导航">
        数字化项目：近代商号账簿第 <b class="vault-broken">一</b> 批（编号 HZ-1927 系列）　<br />
        <span class="vault-dead-link">数据校正与勘误公告</span>　
        <span class="vault-dead-link">调阅指引</span>　
        <span class="vault-dead-link">首页已无法访问</span><br />
        <span class="vault-faint">浙公网安备 3301████████ ｜ 浙ICP备████████号-2　<Glitch :n="8" /></span>
      </nav>
    </div>
  </footer>
</template>

<script setup>
import Glitch from './Glitch.vue'
</script>

<style scoped>
.vault-footer {
  margin-top: auto;
  background: #120a06;
  color: #8f7a54;
  border-top: 1px solid rgba(157, 40, 26, 0.3);
  padding: 26px 28px 20px;
  font-size: 13px;
  line-height: 1.9;
}
.vault-footer-inner {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
}
.vault-footer a { color: #bd9c68; text-decoration: none; }
.vault-footer a:hover { text-decoration: underline; }
.vault-address { display: inline; font-style: normal; color: #7a674a; }
.vault-broken { color: #d13424; font-weight: 600; }
.vault-dead-link { text-decoration: line-through; color: #5c4a34; }
.vault-faint { color: #4c3d2b; font-size: 12px; }
</style>

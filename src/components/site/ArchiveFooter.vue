<template>
  <footer class="archive-footer">
    <div class="archive-footer-inner">
      <div>
        <strong>杭州民俗数字档案馆</strong><br />
        <address class="footer-address">地址：杭州市西湖区　｜　开放时间：周二至周日 9:00—17:00</address>
        <br />
        本馆为公益性数字文化展示平台，馆藏内容仅作学术研究与文化科普用途。
      </div>
      <nav aria-label="页脚导航">
        数字化项目：近代商号账簿第一批（编号 HZ-1927 系列）<br />
        <RouterLink to="/records/corrections">数据校正与勘误公告</RouterLink>　 <RouterLink to="/search">检索帮助</RouterLink>　
        <button class="footer-link" type="button" @click="showAbout = true">关于本馆</button>　
        <RouterLink to="/services/feedback">意见建议</RouterLink><br />
        <span class="faint">本馆为虚构创作 · 备案信息从略（非真实备案）</span>
      </nav>
    </div>

    <!-- 关于本馆声明弹窗（极小入口，质疑时可拿得出） -->
    <div v-if="showAbout" class="archive-modal-mask" @click.self="showAbout = false">
      <div class="archive-modal about-modal">
        <button class="modal-close" type="button" @click="showAbout = false">关闭</button>
        <h3>关于本馆</h3>
        <p>
          本馆为数字艺术项目。部分民俗条目为历史文献整理与虚构创作，不代表本馆立场，也不构成对任何现实宗教场所、地标或信仰的描述与评价。
        </p>
        <p class="muted">如您对所展示内容有疑问或不适应，可通过「意见建议」与馆长联系。</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const showAbout = ref(false)
</script>

<style scoped>
.footer-link {
  border: 0;
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
  cursor: pointer;
  text-decoration: none;
}
.footer-link:hover {
  text-decoration: underline;
}
.about-modal h3 {
  margin-top: 0;
  color: #3c3020;
}
.about-modal p {
  color: #4a3d29;
}
.about-modal .muted {
  color: #6d5f45;
}
</style>

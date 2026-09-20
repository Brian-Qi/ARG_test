<template>
  <div class="archive-home">
    <!-- Hero 检索 -->
    <section class="archive-hero" aria-label="馆藏介绍">
      <span class="hero-tag">让散落在街巷里的旧物，有一条归处</span>
      <h1>杭州民俗数字档案馆</h1>
      <p>本馆致力于杭州地区民俗文献、商号文书与民间记忆的数字化保存与公开利用。馆藏以“数字可用、公开可查”为原则，持续整理并向公众开放。</p>
    </section>

    <!-- 数字化专题：左主卡片 + 右列表 -->
    <section aria-labelledby="digital-collections-title">
      <h2 id="digital-collections-title" class="section-title">数字化专题 <small>Digital Collections</small></h2>
      <div class="home-split">
        <RouterLink class="collection-card home-feature" to="/archives/CW-0001">
          <span class="thumb"
            ><img src="/img/home-ledger-project.webp" alt="近代商号账簿数字化（第一批）" width="1536" height="1024"
          /></span>
          <div class="home-feature-copy">
            <div class="meta">专题 · 持续更新</div>
            <h3>近代商号账簿数字化（第一批）</h3>
            <p>民国时期杭州商号流水账册的整理、扫描与全文著录，首批共 7 册 1200 余页。</p>
          </div>
        </RouterLink>
        <ul class="home-sidelist">
          <li><RouterLink to="/archives/CW-0002">财神信俗文献辑录</RouterLink></li>
          <li><RouterLink to="/archives/CW-0003">财神年画图档整理</RouterLink></li>
          <li><RouterLink to="/archives/CW-0004">民间商号文书著录</RouterLink></li>
          <li><RouterLink to="/archives/CW-0005">财神祭祀祝文辑录</RouterLink></li>
          <li><RouterLink to="/archives/CW-0006">民俗碑记拓片整理</RouterLink></li>
          <li><RouterLink to="/archives/CW-0007">民间求财旧俗考释</RouterLink></li>
          <li><RouterLink to="/archives/CW-0008">财神谱系田野调查</RouterLink></li>
        </ul>
      </div>
    </section>

    <!-- 近期上线：左列表 + 右主卡片（标题改到右侧） -->
    <section class="home-recent" aria-labelledby="recent-collections-title">
      <div class="home-split home-split-flip">
        <ul class="home-sidelist">
          <li><RouterLink to="/archives/CW-0010">五路财神的来源与流变</RouterLink></li>
          <li><RouterLink to="/archives/CW-0011">赵公明：从瘟神到财神的演变</RouterLink></li>
          <li><RouterLink to="/archives/CW-0012">武财神关羽的忠义财道</RouterLink></li>
          <li><RouterLink to="/archives/CW-0013">文财神比干的无私之德</RouterLink></li>
          <li><RouterLink to="/archives/CW-0014">小五路财神与招宝纳珍考辨</RouterLink></li>
          <li><RouterLink to="/archives/CW-0015">「君子爱财，取之有道」考释</RouterLink></li>
          <li><RouterLink to="/archives/CW-0016">「以德聚财，以财济世」理念溯源</RouterLink></li>
          <li><RouterLink to="/archives/CW-0017">施食台碑记考</RouterLink></li>
          <li><RouterLink to="/archives/CW-0018">旧时商铺的「灯」与「账」</RouterLink></li>
        </ul>
        <h2 id="recent-collections-title" class="section-title">近期上线 <small>Recently Online</small></h2>
        <RouterLink class="collection-card home-feature" to="/archives/CW-0009">
          <span class="thumb"><img src="/img/home-wanhe-ledger.webp" alt="万和号商号流水账" width="1536" height="1024" /></span>
          <div class="home-feature-copy">
            <div class="meta">馆藏号 HZ-1927-0512 · 全文公开</div>
            <h3>万和号商号流水账</h3>
            <p>民国十六年至二十一年间杭州城南绸布南北货商号账册，共 86 页。</p>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- 公告 -->
    <section aria-labelledby="announcements-title">
      <h2 id="announcements-title" class="section-title">通知公告 <small>Announcements</small></h2>
      <div class="notice-list">
        <div class="notice-row">
          <time>2026-08-27</time><RouterLink to="/notice/3">关于"近代商号账簿数字化（第一批）"全文开放的说明</RouterLink>
        </div>
        <div class="notice-row"><time>2026-08-19</time><RouterLink to="/notice/2">中秋节假期开放时间安排</RouterLink></div>
        <div class="notice-row"><time>2026-08-06</time><RouterLink to="/notice/1">民间文书捐赠征集公告（长期有效）</RouterLink></div>
      </div>
    </section>

    <!-- 服务 -->
    <section aria-labelledby="services-title">
      <h2 id="services-title" class="section-title">服务与授权 <small>Services</small></h2>
      <p class="muted service-hint">本馆数字资源以公益开放为原则</p>
      <div class="service-actions">
        <RouterLink class="btn-flat" to="/search">馆藏检索</RouterLink>
        <RouterLink class="btn-flat" to="/services/authorization">资料授权申请</RouterLink>
        <RouterLink class="btn-flat" to="/services/visit">展览预约</RouterLink>
        <RouterLink class="btn-flat" to="/services/donation">文书捐赠</RouterLink>
      </div>
      <p class="muted service-note">授权与预约请通过页面底部联系方式咨询；涉及第三方版权内容，按原件权属另行约定。</p>
    </section>

    <!-- 出馆：回到个人主页（仅当本站在个人站点的 /arg_01 子路径下时显示） -->
    <div v-if="isSubApp" class="home-outlink">
      <a class="btn-flat home-out-btn" href="/">← 返回个人主页</a>
    </div>
  </div>
</template>

<script setup>
// 只有当本站挂在个人站点的 /arg_01 子路径下时，才提供「返回个人主页」出口；
// 从仓库单独部署在根路径时会隐藏，免得点了只在本站里打转。
const isSubApp = import.meta.env.BASE_URL.replace(/\/+$/, '') === '/arg_01'
</script>

<style scoped>
.home-outlink {
  display: flex;
  justify-content: flex-end;
  margin: 0 0 16px;
}
.home-out-btn {
  font-size: 0.82rem;
  padding: 0.5em 1.1em;
}
</style>

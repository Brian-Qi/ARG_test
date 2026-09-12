<template>
  <div>
    <p class="page-back"><RouterLink class="back-link" to="/">← 返回首页</RouterLink></p>

    <article v-if="notice" class="archive-panel">
      <h1 class="notice-detail-title">{{ notice.title }}</h1>
      <p class="muted notice-detail-meta">发布日期：{{ notice.date }}　来源：杭州民俗数字档案馆</p>
      <hr class="notice-detail-divider" />
      <p v-for="(p, i) in notice.body" :key="i">{{ p }}</p>
    </article>

    <div v-else class="archive-panel">
      <h1>公告不存在</h1>
      <p class="muted">该公告可能已撤下，或编号有误。</p>
    </div>

    <h2 class="section-title">往期公告</h2>
    <div class="notice-list">
      <div v-for="n in others" :key="n.id" class="notice-row">
        <time>{{ n.date }}</time>
        <RouterLink :to="'/notice/' + n.id">{{ n.title }}</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const ALL = [
  {
    id: '1',
    date: '2026-08-06',
    title: '民间文书捐赠征集公告（长期有效）',
    body: [
      '为保存城市记忆、充实馆藏体系，本馆常年接受民间文书无偿捐赠与寄存，范围包括但不限于：商号账簿与票据、契约文书、家谱族谱、书信日记、照片底片、证章地图等。',
      '有意者请先通过页面底部电话或邮箱联系，由工作人员初步鉴定后约定捐赠方式。涉及商业机密的账簿，可按约定进行年限封存后公开。'
    ]
  },
  {
    id: '2',
    date: '2026-08-19',
    title: '中秋节假期开放时间安排',
    body: [
      '2026 年中秋节假期（9 月 25 日至 9 月 27 日），本馆数字阅览室照常开放，人工咨询服务暂停。',
      '线上馆藏检索与数字资源访问不受影响。特此公告。'
    ]
  },
  {
    id: '3',
    date: '2026-08-27',
    title: '关于“近代商号账簿数字化（第一批）”全文开放的说明',
    body: [
      '“近代商号账簿数字化（第一批）”项目已完成复核验收。其中万和号商号流水账（馆藏号 HZ-1927-0512）已完成全文著录并全文公开，可于馆藏目录中查阅。',
      '该账册纸张脆化严重，部分页角缺损，著录时对缺损处以“□”标示；个别影像页与著录页码存在错位，正在校正中，以纸质原件为准。',
      '本批其余账册将按整理进度陆续开放，敬请关注。'
    ]
  },
  {
    id: '4',
    date: '2026-07-08',
    title: '民俗数字资源开放获取说明',
    body: [
      '本馆数字资源以公益开放为原则，面向学术研究与文化科普免费提供在线查阅。',
      '资源内容源自公开文献与馆藏整理，涉及第三方版权或个人信息者已作遮蔽或延期公开处理，请合理引用并注明来源。'
    ]
  },
  {
    id: '5',
    date: '2026-06-20',
    title: '馆藏检索系统上线试运行',
    body: [
      '馆藏检索系统即日起上线试运行，支持按主题、类型、年代检索已公开的数字资源。',
      '试运行期间功能仍在完善，欢迎通过页面底部联系方式反馈意见与建议。'
    ]
  },
  {
    id: '6',
    date: '2026-05-15',
    title: '商号文书征集与数字化进度简报',
    body: [
      '本馆民间商号文书征集正在进行中，目前已完成一定数量的账册、契约与票据的登记与初步整理。',
      '整理进度将按批次在项目中公布，欢迎藏家与研究者参与合作。'
    ]
  },
  {
    id: '7',
    date: '2026-08-30',
    title: '关于读者批注与数据订正的说明',
    body: [
      '近期有读者就馆藏 HZ-1927-0512 的著录提出批注。经复核，部分意见与现行著录不符，相关批注已依《公开数据订正规程》处理，处理结果见“数据校正记录”。',
      '本馆欢迎基于文献的订正意见，惟请一并提供可核实之身份与联系方式，以便回访。未具名或联系方式无效者，恕难逐一答复。'
    ]
  },
  {
    id: '8',
    date: '2026-07-20',
    title: '馆藏留言墙功能调整说明',
    body: [
      '馆藏留言墙因系统维护，自 2026 年 7 月起暂停新增留言。原留言存档待清理后，择期开放查阅。',
      '维护期间，如需提出意见或建议，请转往“意见建议”页面。由此带来的不便，敬请谅解。'
    ]
  },
  {
    id: '9',
    date: '2026-07-01',
    title: '特藏室新增入藏民国文书一批',
    body: [
      '特藏室近期入藏民间文书一批，含民国商号账簿、契约、书信若干，正在登记、除尘与修复。',
      '其中万和号一批（馆藏号 HZ-1927-0512 系列）已优先整理。相关条目将于整理完成后陆续开放，敬请关注。'
    ]
  }
]

const notice = computed(() => ALL.find(n => n.id === route.params.id))
const others = computed(() => (notice.value ? ALL.filter(n => n.id !== notice.value.id) : ALL))
</script>

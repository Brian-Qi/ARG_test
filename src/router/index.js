import { createRouter, createWebHistory } from 'vue-router'
import game from '../stores/game'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    /* ================= A 层 · 杭州民俗数字档案馆（公开站） ================= */
    { path: '/', name: 'site-home', component: () => import('../views/site/ArchiveHome.vue'), meta: { mode: 'public', title: '杭州民俗数字档案馆' } },
    { path: '/search', name: 'site-search', component: () => import('../views/site/ArchiveSearch.vue'), meta: { mode: 'public', title: '馆藏检索 - 杭州民俗数字档案馆' } },
    { path: '/collection/HZ-1927-0512', name: 'site-collection', component: () => import('../views/site/ArchiveCollection.vue'), meta: { mode: 'public', title: '万和号流水账（HZ-1927-0512）' } },
    { path: '/collection/HZ-1927-0512/0', name: 'site-vault-entry', component: () => import('../views/site/VaultEntry.vue'), meta: { mode: 'public', title: '正在载入档案…' } },
    { path: '/records/corrections', name: 'site-corrections', component: () => import('../views/site/ArchiveCorrections.vue'), meta: { mode: 'public', title: '数据校正记录 - 杭州民俗数字档案馆' } },
    { path: '/help', name: 'site-help', component: () => import('../views/site/ArchiveHelp.vue'), meta: { mode: 'public', title: '帮助 - 杭州民俗数字档案馆' } },
    { path: '/messages', name: 'site-messages', component: () => import('../views/site/ArchiveMessages.vue'), meta: { mode: 'public', title: '消息 - 杭州民俗数字档案馆' } },
    { path: '/staff/help', name: 'site-staff-help', component: () => import('../views/site/ArchiveHelp.vue'), meta: { mode: 'public', title: '帮助 - 杭州民俗数字档案馆' } },
    { path: '/staff/:name', name: 'site-staff', component: () => import('../views/site/ArchiveStaff404.vue'), meta: { mode: 'public', title: '页面不存在 - 杭州民俗数字档案馆' } },
    { path: '/notice/:id', name: 'site-notice', component: () => import('../views/site/ArchiveNotice.vue'), meta: { mode: 'public', title: '公告详情 - 杭州民俗数字档案馆' } },
    { path: '/digital-project', name: 'site-project', component: () => import('../views/site/ArchiveProject.vue'), meta: { mode: 'public', title: '近代商号账簿数字化项目 - 杭州民俗数字档案馆' } },
    { path: '/archives/:id', name: 'site-folk', component: () => import('../views/site/FolkArchive.vue'), meta: { mode: 'public', title: '民俗档案 - 杭州民俗数字档案馆' } },
    { path: '/services/authorization', name: 'site-service-auth', component: () => import('../views/site/ArchiveServiceAuthorization.vue'), meta: { mode: 'public', title: '资料授权申请 - 杭州民俗数字档案馆' } },
    { path: '/services/visit', name: 'site-service-visit', component: () => import('../views/site/ArchiveServiceVisit.vue'), meta: { mode: 'public', title: '展览预约 - 杭州民俗数字档案馆' } },
    { path: '/services/donation', name: 'site-service-donation', component: () => import('../views/site/ArchiveServiceDonation.vue'), meta: { mode: 'public', title: '文书捐赠 - 杭州民俗数字档案馆' } },
    { path: '/services/feedback', name: 'site-service-feedback', component: () => import('../views/site/ArchiveFeedback.vue'), meta: { mode: 'public', title: '意见建议 - 杭州民俗数字档案馆' } },

    /* ================= B 层 · 馆藏异变副本（碎片网） ================= */
    { path: '/story', name: 'story', component: () => import('../views/Story.vue'), meta: { mode: 'vault', title: '馆藏总目 - 杭州民俗数字档案馆' } },
    { path: '/f/:id', name: 'vault-fragment', component: () => import('../views/VaultFragment.vue'), meta: { mode: 'vault', title: '馆藏卷宗 - 杭州民俗数字档案馆' } },
    { path: '/e/:id', name: 'vault-entity', component: () => import('../views/VaultEntity.vue'), meta: { mode: 'vault', title: '名号索引 - 杭州民俗数字档案馆' } },
    { path: '/strike-zero', name: 'strike-zero', component: () => import('../views/StrikeZero.vue'), meta: { mode: 'vault', title: '万和号 · 第零笔' } },

    /* ================= 兜底：公开站 404 ================= */
    { path: '/:pathMatch(.*)*', name: 'site-not-found', component: () => import('../views/site/ArchiveNotFound.vue'), meta: { mode: 'public', title: '页面不存在 - 杭州民俗数字档案馆' } }
  ]
})

router.afterEach((to) => {
  const title = to.meta.mode === 'vault' ? '馆藏档案 - 杭州民俗数字档案馆' : (to.meta.title || '杭州民俗数字档案馆')
  document.title = title
  setRobots(to.meta.mode === 'vault' ? 'noindex, nofollow' : 'index, follow')
})

// 按壳层注入 robots：B 层（vault）不入搜索引擎索引，防 SEO 剧透
function setRobots(value) {
  let el = document.querySelector('meta[name="robots"]')
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', 'robots')
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

// B 层不再设线性关卡锁：馆藏档案自由调阅（ARG 非线性质）。
// 唯一例外：第零笔是元秘密，仅完整达成灰结局后可达，防直接输 URL 绕过。
router.beforeEach((to) => {
  if (to.meta.mode !== 'vault') return true
  const root = '/' + to.path.split('/')[1]
  if (root === '/strike-zero') {
    return game.state.ending === 'grey' ? true : { path: '/story', replace: true }
  }
  return true
})

export default router

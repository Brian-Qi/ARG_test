# 《第五张财签》ARG · 系统设计实录

> 本文档事无巨细地记录当前项目的**故事线、交互点、各种入口、路由、状态机、触发器**等全部设计细节。
> 覆盖 **A 层（公开站·杭州民俗数字档案馆）** 与 **B 层（隐藏·万和号旧账后台）** 两套壳层。
> 阅读对象：作者本人 / 后续接手维护者 / 生成配图与文案的辅助角色。
> 最后更新：2026-09-07（B 层支线网重构完成）

---

## 0. 一句话世界观

玩家以为自己在帮人（救被困店主 / 帮沈晚救父），实际是被一本旧账选中，充当一场延寿仪式的**第六根「意」**——补进**五童借财局**，把自己的魂魄献祭给一个早已该死的人。

### 隐藏真相（v3 定稿）
- 1927 年，万和号老板 **沈怀仁** 信奉虚构禁忌"**五路借财**"，以**收养名义**收下五个孩子为养子。
- 每个孩子天生带一根**身体缺陷（六根之五）**，死因对应**五脏 × 五行 × 五路财神**——他是借这五个孩子的命来**给自己延寿**的。
- **五个孩子不是同时、也不是一处死的**：沈怀仁按五行方位，把他们分别安置在宅院（四合院）的**东、南、西、北、中**五处，各以对应五行的物（草木之毒 / 炭火 / 水银 / 木通 / 砒霜）使其"病"死在自己那一方——每一起都像江南孩子常见的病，谁也不会起疑。事后他把账改成"米、药、衣、灯、人，金额零"，裁掉姓名与手印。
- 沈怀仁**借五子的命延寿至今**，为掩盖身份**改名"沈砚秋"**，一直活到当代。但这轮延寿将尽，**大限将至**——他需要仪式补上最后一步。
- **第六根「意」（心识/魂魄）= 玩家**。前五根（眼耳鼻舌身）已由五个孩子填满，唯独"意"这个格是空的。玩家以「意」入局，**献祭自己的魂魄**，就能为沈砚秋（即沈怀仁）铸就永生。

### 关键人物（v3 定稿）
- **沈怀仁 = 沈砚秋**（同一人）：1927 献祭五子延寿；当代以"沈砚秋"身份**装困设局**，把旧账扫描上线，诱引玩家入局作第六位见证者续命。明知故犯、幕后掌局、该死而想活。
- **沈晚**（五个孩子之一，名义养子）：一缕**残魂弥留至今**。她隐约记得自己也是"被填进去的"，但用"去救父亲"来麻醉自己。她误以为"父亲沈砚秋被困后间"，善意地发求救、给提示——但方向全错，恰好把玩家引进沈砚秋的局。善意但被误导。
- **五个孩子**：沈怀仁名义养子，1927 年全部死亡，只余沈晚一缕残魂。好结局的还名对象。
- **玩家**：以「意」入局，被沈砚秋的假"求救"与沈晚的错误提示双重误导，自以为在救人。

### 五童借财局 · 体系表
- 六根：眼、耳、鼻、舌、身、意。
- 前五根（眼耳鼻舌身）＝五个孩子；第六根（意）＝玩家。
- 五路财神＝**大五路财神**（具体五位神，非抽象方位）：

| 方位 | 五行 | 五脏 | 大五路财神 | 文/武 | 六根 | 孩子 |
|---|---|---|---|---|---|---|
| 东 | 木 | 肝 | 比干 | 文 | 眼 | 养子一 |
| 南 | 火 | 心 | 柴荣（柴王爷） | 武 | 耳 | 养子二 |
| 西 | 金 | 肺 | 关公（关羽） | 武 | 鼻 | 养子三 |
| 北 | 水 | 肾 | 赵公明 | 武 | 舌 | 养子四 |
| 中 | 土 | 脾 | 王亥 | 文 | 身 | 养子五 |
| （第六） | — | — | （意 · 玩家） | — | 意 | 玩家 |

> 大五路财神考证来源：`docs/财文化网传资料/筛选前/一、道教大小五路财神_三方考证.md`（书籍《论佛教的财神文化及其财富伦理》＋快懂百科＋湟源县政府网，三方一致）。

### 五子死因 · 四合院方位（已定稿）

五个孩子不是同时、也不是一处死的。沈怀仁按五行方位，把他们分别安置在宅院（四合院）的东、南、西、北、中五处，各以对应五行的物使其"病"死在自己那一方——每一起都像江南孩子常见的病：

| 方位 | 五行 | 取象 | 手段 | 先天六根 | 脏 | 财神 | 拟似病 |
|---|---|---|---|---|---|---|---|
| 东厢 | 木 | 草木 | 毒蕈（鹅膏类） | 眼 | 肝 | 比干 | 黄疸 / 肝病 |
| 南房 | 火 | 火、热 | 密闭炭火（一氧化碳） | 耳 | 心 | 柴荣 | 心痛 / 猝死 |
| 西厢 | 金 | 金属 | 水银蒸气吸入 | 鼻 | 肺 | 关公 | 痨病 / 咳血 |
| 北房 | 水 | 水、药 | 关木通（利水药，马兜铃酸） | 舌 | 肾 | 赵公明 | 水肿 / 尿毒 |
| 中堂 | 土 | 土、矿物 | 砒霜（砷，少量多次） | 身 | 脾 | 王亥 | 吐泻 / 虚脱 |

- **六根（眼/耳/鼻/舌/身）是孩子先天的病症**，非毒所致；死因是五行取象之毒，伤对应之脏。
- 每方留一样合五行的**物证**（东厢野蕈 / 南房炭盆 / 西厢汞痕 / 北房木通渣 / 中堂白粉末），供玩家在「安位」谜题里拼出五行之局。

---

## 1. 技术底座

- 框架：Vue 3.4 + Vue Router 4.3 + Vite 5（无 Pinia，无 Element/Ant；纯手写组件 + 全局 CSS）
- 单一状态：`src/stores/game.js`（B 层游戏状态，`reactive`）
- 跨页通知：`src/store/archive-notify.js`（A 层消息，`localStorage` 持久化 + 响应式版本号）
- 样式：`src/assets/styles/main.css`（B 层暗底）、`src/assets/styles/archive.css`（A 层亮底）
- 构建：`npm run build`（输出 dist/）
- 路由守卫：`src/router/index.js` 的 `beforeEach`（B 层硬锁）

---

## 2. 壳层与路由总览（App.vue）

`App.vue` 根据 `route.meta.mode` 渲染两套壳：

- `mode === 'public'` → **archive-shell**：`ArchiveTopbar` + `<RouterView>` + `ArchiveFooter`（A 层亮底）
- `mode === 'vault'` → **site-shell**：`SiteHeader` + `<RouterView>` + `HorrorOverlay` + 氛围层（烛火/灰烬/噪点/暗角）（B 层暗底）

`App.vue` 会 watch `mode`，给 `<html>` 打 `data-mode="public|vault"` 并 toggle `layer-archive` class；公开站 body 背景 `#efe6d2`。

### 完整路由表

| 路径 | 名称 | 组件 | 壳层 | 说明 |
|---|---|---|---|---|
| `/` | site-home | ArchiveHome | A | 首页 |
| `/search` | site-search | ArchiveSearch | A | 馆藏检索 |
| `/collection/HZ-1927-0512` | site-collection | ArchiveCollection | A | 万和号影像浏览（A 层） |
| `/collection/HZ-1927-0512/0` | site-vault-entry | VaultEntry | A | 转场页（2.4s 后跳 /story） |
| `/records/corrections` | site-corrections | ArchiveCorrections | A | 数据校正记录 |
| `/help` | site-help | ArchiveHelp | A | 帮助页（线索分流） |
| `/messages` | site-messages | ArchiveMessages | A | 消息中心 |
| `/staff/help` | site-staff-help | ArchiveHelp | A | 帮助页别名 |
| `/staff/:name` | site-staff | ArchiveStaff404 | A | 成员 404 |
| `/notice/:id` | site-notice | ArchiveNotice | A | 公告 |
| `/digital-project` | site-project | ArchiveProject | A | 数字化项目页 |
| `/archives/:id` | site-folk | FolkArchive | A | 民俗档案（CW 系列） |
| `/services/authorization` | site-service-auth | ArchiveServiceAuthorization | A | 资料授权申请 |
| `/services/visit` | site-service-visit | ArchiveServiceVisit | A | 展览预约 |
| `/services/donation` | site-service-donation | ArchiveServiceDonation | A | 文书捐赠 |
| `/story` | story | Story | B | **主线门面**（唯一入口） |
| `/orders` | orders | Orders | B | 支线·订单（第2章） |
| `/archive` | archive | Archive | B | 支线·旧账（第3章） |
| `/roads` | roads | Roads | B | 支线·五路（第4章） |
| `/audio` | audio | Audio | B | 支线·录音（第5章） |
| `/portrait` | portrait | Portrait | B | 支线·旧影（第6章） |
| `/finale` | finale | Finale | B | 支线·结账（第7章,终局） |
| `/materials` | materials | Materials | B | 软支线·底档列表 |
| `/materials/:id` | material-detail | MaterialDetail | B | 软支线·底档详情 |
| `/:pathMatch(.*)*` | site-not-found | ArchiveNotFound | A | 404 |

---

## 3. B 层游戏状态机（`src/stores/game.js`）

### 3.1 主线章节定义

```js
CHAPTERS = [
  { n:1, key:'sign',     title:'第六格',   route:'/story'   },
  { n:2, key:'orders',   title:'无人签收', route:'/orders'  },
  { n:3, key:'archive',  title:'五个零',   route:'/archive' },
  { n:4, key:'roads',    title:'门不是路', route:'/roads'   },
  { n:5, key:'audio',    title:'不要数到六',route:'/audio'   },
  { n:6, key:'portrait', title:'五张脸',   route:'/portrait'},
  { n:7, key:'finale',   title:'后间',     route:'/finale'  },
]
```

### 3.2 state 字段

| 字段 | 含义 | 由谁写入 |
|---|---|---|
| wish | 玩家愿望 | createFortune |
| signed | 第1章完成（取签） | createFortune |
| ordersOpened | 第2章完成（开完5笔订单） | Orders.vue markBranch('orders') |
| archiveOpen | 第3章完成（逆走回纹） | Archive.vue markBranch('archive') |
| roadSolved | 第4章完成（五路围合） | Roads.vue markBranch('roads') |
| audioSolved | 第5章完成（录音停在五） | Audio.vue markBranch('audio') |
| portraitSolved | 第6章完成（补全五姓名） | Portrait.vue markBranch('portrait') |
| ending | 第7章结局（bad/grey/hidden） | Finale.vue setEnding |
| softRead | 软支线已读字典 `{id:true}` | MaterialDetail readSoft |
| activeChapter | 当前主线章节（1-7） | advance() |
| scare | 惊吓事件 `{type,text,id}` | triggerScare |
| shortcuts | 捷径币（隐藏结局条件） | takeShortcut / clearShortcut |
| pagesRead | 已读页数（氛围计数） | 各支线页 |

### 3.3 核心函数（解锁栅格）

```js
branchDone(n)   // 第 n 章硬支线是否完成
chapterOpen(n)  // 第 n 章是否解锁（n<=1 恒真；否则需 branchDone(n-1)）
canVisit(path)  // 某路由是否可访问（线性硬锁）
softOpen()      // 任一硬支线完成即开放软支线（= branchDone(1)）
advance()       // 找到下一个未完成章节，更新 activeChapter
readSoft(id) / hasReadSoft(id)  // 软支线已读
createFortune(wish)  // 取签，signed=true，advance()
markBranch(key)      // 标记完成某章支线并 advance()
setEnding(e)         // 写结局，activeChapter=7
```

### 3.4 路由守卫（硬锁）

在 `router/index.js`：

```js
router.beforeEach((to) => {
  if (to.meta.mode !== 'vault' || to.path === '/story') return true
  const root = '/' + to.path.split('/')[1]
  if (root === '/materials') return game.softOpen() ? true : { path:'/story', replace:true }
  if (!game.canVisit(root)) return { path:'/story', replace:true }
  return true
})
```

效果：**B 层所有页面（除 /story 外）在未解锁时，手动输入 URL 也会被重定向回 /story**。`/materials` 用 `softOpen()` 单独放行。

---

## 4. B 层入口与导航

### 4.1 唯一门面
- B 层唯一真入口是 `/story`（Story.vue）。`Home.vue`（旧版带两张入口卡的 B 层页）已**不再挂载**在路由上，属于孤儿组件。

### 4.2 进度罗盘（SiteHeader.vue 重构后）
- 不再平铺 7 项导航。改为**只显示已解锁章节**：
  - `game.chapterOpen(c.n)` 为真 → 渲染 `compass-link`（可点，`.on` 高亮当前且已完成）
  - 否则 → 渲染 `compass-link fog`（灰雾、blur、`cursor:not-allowed`、提示"第 X 章尚未到翻开的时候"）
- 右上角：
  - `game.softOpen()` 为真 → 出现"底档"按钮（`/materials`）
  - 进度文本 `第{{ activeChapter }} / 7 章`
- 顶部左侧品牌：`萬 / 万和号 · 线上迎财 · 旧账后台`，点品牌回 `/story`

### 4.3 底档（软支线）入口
- 进入条件：完成任一硬支线（`softOpen()`），进度罗盘右侧出现"底档"入口。

---

## 5. B 层主线（Story.vue，支线驱动版）

Story 现在是**主线剧情门面**，不再是自包含的线性按钮推进。它按 `game.state.activeChapter - 1`（`chapterIndex`）显示当前章节卡，分支如下：

| 章节 | tag / 标题 | 悬念 | 支线路由 | 本章解锁条件 |
|---|---|---|---|---|
| 第1章 第六格 | 你不是来求财的。你是来补位的。 | 财签 0512 · 五枚指印 | /story | （取签即第1章，完成） |
| 第2章 无人签收 | 五笔订单，没有收件人。 | 米/药/红袄/无芯灯/人 | /orders | ordersOpened |
| 第3章 五个零 | 金额栏里的零，都像一枚手印。 | 旧账第五页 · 逆时针回纹 | /archive | archiveOpen |
| 第4章 门不是路 | 五条财路，五个逃生出口。 | 窗/井/柜/梁/门 | /roads | roadSolved |
| 第5章 不要数到六 | 一、二、三、四、五。停。 | 算盘录音 · 00:03:47 | /audio | audioSolved |
| 第6章 五张脸 | 像可以改。名字必须还。 | 裂纹噪点 · 五个首字 | /portrait | portraitSolved |
| 第7章 后间 | 门后的人，不是沈砚秋。 | 五双小鞋 · 一把锁 | /finale | ending |

每章卡片的**两种按钮态**（v-if 互斥）：
- **本章已解** `game.branchDone(chapterIndex+1)`：
  - 非尾章 → `记下，前往下一章`（`nextChapter()` → `game.advance()`）
  - 尾章 → `进入后间，结这本账`（RouterLink 到 `/finale`）
- **本章未解** → `去解开：XX`（RouterLink 到支线路由）

### 本章卡结构
`故事章卡` = tag + 标题(v-html) + scene(悬念mark/引语/血痕) + task(任务) + body(正文) + 按钮 + `chapter-hint`（推进提示）。

### 顶部/底部氛围
- 顶部：`万和号 · 旧账后台` / `初五 00:XX`（`12 + chapter*4` 补0）/ `第 X / 7 章`
- 进度条：7 格，`n<=chapterIndex+1` 亮
- 底部：`强惊吓：开/关`（`strong` 开关，控制支线页是否 triggerScare）

---

## 6. B 层各支线页（硬支线，逐章解谜）

每个支线页完成后调用 `game.markBranch(key)`，从而推进主线。

### 6.1 Orders.vue（第2章 · /orders）
- 标题：`今晚的订单，没有收件人。`
- 5 笔订单（reactive `orders`）：
  1. `0512-01` 一斗米（时间23:47）→ 查看后 detail"金额0.00，留在门外不要敲门"，ghost"他已经吃过了。"
  2. `0512-02` 一包退烧药（23:51）→ ghost"每刷新一次，配送地址就离店铺近一条街。"
  3. `0512-03` 一件红袄（23:56）→ 点击第3笔 triggerScare('eye','别签。')
  4. `0512-04` 一盏没有灯芯的灯（00:01）→ 配送员：沈砚秋
- 交互：点击订单行 `readOrder(index)` → 该行 `read=true`、`ordersOpened=true`、`pagesRead++`；第3笔触发惊吓。
- 解锁：`readCount === 4` 时显示 `orders-unlock`：**"北高峰山门外 · 施食台"** + RouterLink `去查旧账 →`(/archive)。
- **watch(readCount)**：`n>=4` 时 `game.markBranch('orders')`。

### 6.2 Archive.vue（第3章 · /archive）
- 标题：`五个零`：米、药、衣、灯、人，金额全为零。
- 组件：`LedgerCard`（3 张：一斗米/一包药/一张船票），右侧账房头像 + `已读 {{ 18 + pagesRead }} 人`。
- 交互：按钮 `沿回纹走一圈` → `reveal()`：`archiveOpen=true`、`pagesRead++`、triggerScare('blood','不欠了，开门。')、`markBranch('archive')`。
- 解锁文本：`先看施食台。回转，不等于偿还。`
- 下一跳：`前往山门之外，寻找施食台 →`(/roads)。

### 6.3 Roads.vue（第4章 · /roads）
- 标题：`门不是路。`：东南西北中不是财路，是窗、井、柜、梁、门。
- 五张 road-card（点击 `openRoad(road)` → `opened=true`、triggerScare('crack','一盏灯灭了。'）：
  - 东市：今日暴利→**赊药**
  - 南码头：包赢合伙→**让利**
  - 西巷：财运加速→**合伙**
  - 北峰：福报兑换→**还伞**
  - 中街：贵人助力→**代工**
- 解锁：全部打开 `openedCount===5` 显示"东、南、西、北、中：公正和合" + `领取路印：互利` 按钮。
- `solve()`：`roadSolved=true`、`pagesRead++`、`markBranch('roads')`。
- 下一跳（roadSolved 后）：`报数声从店铺后间传来 →`(/audio)。

### 6.4 Audio.vue（第5章 · /audio）
- 标题：`不要数到六。在五时停下。`
- 磁带视觉：`REC / 00:03:47` + 水壶眼图(`/img/kettle_eye.webp`) + 血痕。
- 交互：五个"静音"clip（id：合/施/还/信/让，各有波形 bars），点击 `choose(clip)` 依序选择（去重，最多5）。
- 答案：`['施','信','让','还','合']`（施舍信让还——五种往来）。
- 判定（computed `message`）：
  - 选满5且对 → `audioSolved=true`、`markBranch('audio')`，显示"报数停下来了。有人在静音里说：财从手过，别从心住。"
  - 错 → triggerScare('face','不要数到六。')，显示"算盘重新响起。它没有说你错了，只把欠字多念了一遍。"
- 下一跳（audioSolved 后）：`录音后还有一张被改过的照片 →`(/portrait)。

### 6.5 Portrait.vue（第6章 · /portrait）
- 标题：`一张脸，被刻过三次。`
- 三张 old-photo（`mark(id)` 标记）：
  - 1901 财/财神石像/披甲
  - 1916 苏/东坡石像/宽袍
  - 今夜 空/无名石龛/不可辨
- 三条提示问题："三张照片里都在右下角的，是？"→ 选项 `同一道裂纹 / 同一张脸 / 同一个题字`。
- 判定 `judge(answer)`：
  - `crack` → 正解：`portraitSolved=true`、`markBranch('portrait')`、triggerScare('blood','第六位 · 等待签收')，显示"裂纹噪点里藏着五个姓名…只留下你的那一枚。"
  - 其他 → 显示"照片轻微闪烁。那一项在每个年代都被改过。"
- 下一跳（portraitSolved 后）：`把这条旧规带回账房 →`(/finale)。

### 6.6 Finale.vue（第7章 · /finale，终局）
- 终局艺术图 `/img/poster_crack.webp`。
- 标题：`请结本月账。`
- 三个按钮（`end(type)` → `game.setEnding(type)`）：
  - `签下见证人` → **bad**「第六位」：沈砚秋走出来，财签变旧合影，第六位收件人已签收。
  - `销毁账簿` → **grey**「账已焚」：账焚尽，留白——"他看了很久，什么也没说"，余下皆交读者脑补。
  - `归还姓名`（`!canHidden` 时 disable）→ **hidden**「五人出账」。
- `canHidden`：`roadSolved && audioSolved && portraitSolved && shortcuts===0`
- 结局后：`重新翻开账册` → `game.reset()`。
- **灰结局隐藏入口**：`ending==='grey'` 时，留白下方渲染一行近隐形 `.grey-hint`——`账烧不干净的那一笔，在灰里也看得见。`（hover 亮起）点击进 `/strike-zero`。
- **`/strike-zero`**（StrikeZero.vue，第 7 章隐藏层）：路由仅 `game.state.ending==='grey'` 放行（路由守卫特判），防直接输 URL。进入后：时间倒流（章/日/子刻倒退）→ 黑屏 `第零笔：谁把门锁上？`，物证图 `/img/strike_zero.webp`（倒走的钟 + 火中账页）。

---

## 7. B 层软支线 · 底档（数据驱动）

### 7.1 数据 `src/data/materials.js`
12 条情报点，按 `layer` 分三层：

| id | layer | 标题 | tag | 图片 |
|---|---|---|---|---|
| shishitai | 1 | 施食台碑文 | 北高峰山门外 | `/img/shishitai.webp` |
| wuxin-lamp | 1 | 无芯灯 | 第五笔订单 | `/img/kettle_eye.webp` |
| xiao-xie | 1 | 五双小鞋 | 后间监控 | `/img/xiao-xie.webp` |
| hongao-shouyin | 1 | 红袄衣角 | 第三笔订单 | `/img/hongao-shouyin.webp` |
| suanpan | 1 | 算盘珠号码 | 第二笔订单 | `/img/suanpan.webp` |
| huiwen | 2 | 回纹走法 | 旧账第五页 | `/img/huiwen.webp` |
| huashu | 2 | 财神化疏仪式 | 开市旧俗 | `/img/huaguang.webp` |
| zhouyi | 2 | 施粥义举碑 | 碑记拓片 | 无（残页占位） |
| dianleng | 2 | 点灯迎财旧俗 | 求财旧俗考释 | `/img/dianleng.webp` |
| yunlin-jing | 2 | 云林禅寺经卷 | 校正记录 | `/img/qianwen.webp` |
| lingshun | 2 | 灵顺寺旧影 | 校正记录 | `/img/baishi.webp` |
| shouni | 3 | 一枚红指印 | 财签 0512 | `/img/shouni.webp` |

- 每条含：id / layer / title / tag / img / desc（卡上简介）/ body（详情正文）。
- 无 `img` 的条目在卡片/详情显示"残页·无影像"占位。

### 7.2 列表页 Materials.vue（/materials）
- 标题：`一些翻到一半的东西`
- 网格卡片（`material-card`，`layer-1` 有红色强调边框），每卡：tag + 图 + 标题 + desc + （已读则显示"已读"）。
- 点卡进入 `/materials/:id`。

### 7.3 详情页 MaterialDetail.vue（/materials/:id）
- 读取 `route.params.id` 匹配数据；掉进详情即 `game.readSoft(id)`。
- 布局：左图右文（标题/lead/body/已阅毕）；底部 `返回底档` / `回到主线`。
- 找不到 id：显示"没有这页残档。" + 返回底档。

### 7.4 软支线规则
- 只影响氛围与暗线，**不硬卡主线**。
- 进入条件：`softOpen()`（完成任一硬支线）。未完成时访问 /materials 被路由守卫拉回 /story。

---

## 8. A 层（公开站）交互与入口

### 8.1 ArchiveHome.vue（首页 /）
- Hero：馆名 + 简介。
- 数字化专题：左主卡片 `/archives/CW-0001`（缩略图 `/img/home-ledger-project.webp`，待办：近期已接入）+ 右列表 CW-0002..CW-0008。
- 近期上线：左列表 CW-0010..CW-0016 + 右主卡片 `/archives/CW-0009`（缩略图 `/img/home-wanhe-ledger.webp`，馆藏号 HZ-1927-0512 · 全文公开）。
- 通知公告：notice 1/2/3。
- 服务与授权：馆藏检索/资料授权申请/展览预约/文书捐赠。

### 8.2 ArchiveSearch.vue（检索 /search）
- 检索数据 `ALL`：万和号（`to: /collection/HZ-1927-0512`, snippet=true）+ CW-0001..CW-0014 + 隐匿的"沈晚族谱"（`hidden:true`）。
- **沈晚族谱**：`{ title:'沈晚族谱', id:'馆藏号 SP-1927-0007', hidden:true, desc:'…女，沈晚。父，沈砚秋。', kw:['沈晚','族谱','沈砚秋','家谱'] }`。
- 检索逻辑：`results` 过滤 `r.hidden && !familyUnlocked()` 则跳过（即未解锁族谱搜不到沈晚族谱）。
- **沈砚秋跳转**：`goSearch()` 与 `applyQuery()` 都检测 `/沈砚秋/`，命中即 `router.replace('/help')`。
- 万和号结果带 snippet 表格（5 条记账）+ 1600ms 后闪出 `ghost-line`"不欠了，开门。"。

### 8.3 ArchiveCollection.vue（影像浏览 /collection/HZ-1927-0512）
详见"第 9 节 转场与气氛演出"。

### 8.4 ArchiveServiceAuthorization.vue（资料授权申请 /services/authorization）
- 字段：申请用途(select)/拟使用馆藏(输入)/拟使用范围(textarea)/所在单位/联系方式(电话或邮箱，校验)。
- 占位：`馆藏号或题名`（已去掉样例 HZ-1927-0512，避免剧透）。
- 校验：电话 `/^1\d{10}$/`（提示"请输入正确手机号"），邮箱正则。
- **提交逻辑（关键）**：
  - `isShen = /沈晚|HZ-1927-0512/i.test(title)`。
  - 命中 → `push({ type:'shen', title:'资料授权申请 · 特殊审核', body:'沈晚？你想查账？账本不是你翻的。去，叫你大人来。没大人来，就回你的那五张签去。', familyAvailable:true })`。
  - 未命中 → `push({ type:'normal', title:'资料授权申请 · 已受理', body:'您提交的资料授权申请已登记…' })`。

### 8.5 消息中心（/messages → ArchiveMessages.vue）
- 导航栏（ArchiveTopbar）新增"消息"链接 + 未读红点徽标（`unreadCount()`）。
- 列表卡片：
  - `msg-shen`（type==='shen' 特殊红色样式）。
  - 未读显示红点；点击 `open(m)` → `markRead(m.id)`。
  - **解锁族谱按钮**：`m.familyAvailable && !unlocked` 时显示"解锁沈晚族谱" → `unlock()` 调 `unlockFamily()`。
  - 解锁后（`m.type==='shen' && unlocked`）显示"族谱已解锁：可在「馆藏检索」输入 **沈砚秋**。"（只对沈晚那一条，普通消息不带此行）。
- 空态：`暂无消息` + `前往资料授权申请`。

### 8.6 ArchiveHelp.vue（帮助 /help，线索分流）
四种条件分支（优先级从上到下）：

1. **bothDone**（`seenHidden && familyUnlocked()`）→ `help-final` 终极面板：
   - 文案"回到此处，已是尽头…"。两个按钮：
     - `进入关联档案`（→ `/collection/HZ-1927-0512/0`）
     - `返回首页` → `goNoReturn()`：触发"没有退路"演出（见 9.5）。
2. **seenHidden 且未解锁族谱** → 沈晚提示 + `进入关联档案`(/0)。
3. **未见过第0页** → "有些地方还没去过" + `返回馆藏目录`(Button → 弹窗)。
   - 弹窗 footer：`返回馆藏目录`(RouterLink /collection/HZ-1927-0512)。
4. 兜底普通帮助说明。

### 8.7 ArchiveStaff404.vue（成员 404 /staff/:name）
- "未检索到该成员档案"+ 极淡提示 `若为沈晚，去 /help 看看。`（颜色几乎不可见，user-select:none）。
- 数据校正记录（ArchiveCorrections）里的 author 会链接到这里。

### 8.8 数据校正记录 ArchiveCorrections.vue（/records/corrections）
5 条（C-2026-0513 处理中 / C-2026-0024 已更正 / C-2026-0016 已撤回 / C-2026-0009 已更正 / C-2026-0002 已更正）。
- C-2026-0513：页码错位，暗示"影像多出一页残页"（暗指第0页）。
- C-2026-0016（已撤回）：读者"沈晚"批注被撤回 + "账房后人"待核实。author 链接 `/staff/沈晚`。
- 无 author 的记录不带链接。

### 8.9 VaultEntry /0（转场）
- 文案"正在调阅关联档案…" + 进度条滑动，`router.replace('/story')`（2.4s）。
- 提供 `返回公开目录`（→ /collection/HZ-1927-0512）。

---

## 9. 转场与气氛演出（跨层共用）

### 9.1 A 层影像浏览 · 第 0 页（ArchiveCollection 内部）
- 正常列表：页字/摘要/金额，翻页 `‹ 第 X / N 页 ›`。
- **左侧翻页按钮两态**：
  - `page > 0` → `‹` 箭头（正常上一页）。
  - `page === 0`（第一页）→ 隐藏的**6 连击入口按钮**（`pg-secret`，`opacity:0` 可点击）。
- **6 连击逻辑** `onSecretTap()`：
  - 每次点击 `secretTaps++`；到 6 → `enterHidden()`。
  - **第 5 次时**加 `pg-secret-hot`（虚框闪现 + `secret-pulse` 脉动反馈）。
  - 每次点后设 500ms 定时器 `secretTimer`；逾时未再点 → `secretTaps=0`（防误触）。
  - `showHidden` 时按钮隐藏（`pg-nav-hide`）。

### 9.2 进入第 0 页（enterHidden）
- 清计数；`genBars()`；`glitchFlash=true`；**写 `sessionStorage.setItem('cx_seen_hidden','1')`**。
- 500ms 后：`showHidden=true`、`glitchFlash=false`、`bloodMode=true`、`nextTick` → `focusHidden()`(scrollIntoView center)+`lockScroll()`+`startTyping()`。

### 9.3 第 0 页演出
- `hidden-glitch`：枣红底 + 多条细竖带（`glitch-bar`，条形码质感错开循环闪）。
- `pg-glitch`：可读账文**打字机**输入 → `polluter` 逐字侵蚀为**乱码** → `collapseActive` 崩坏震动。
- 崩坏结束 → `startShakeExit()`：剧烈位移 5 次 → `exitHidden()`。

### 9.4 退出第 0 页（exitHidden）
- `stopTyping()`、重置 shake/collapse、`glitchFlash=true`；500ms 后 `showHidden=false`、`bloodMode=false`、`unlockScroll()`、`glitchFlash=false`、`text=''`、`page=0`。

### 9.5 没有退路演出（ArchiveHelp 的"返回首页"）
- `goNoReturn()`：`noReturn=true`、`phase=1`、文字= BASE（"尚有事情未完成…"）。
- 900ms 后 `runGarble()`：逐帧 `t+=0.06` 把 BASE 不同程度替换为 GLITCH 字符（`█▓▒░#@%&*…`），t>=1 时 `phase=2`。
- `phase>=2`：隐藏乱码，显示 **"你已经没有退路了"**（`noway-dead`）脉动浮现，3.4s 后结束（`noReturn=false`）。
- 全屏层 `z-index:200`、pointer-events:none；`.red` 变径向血红背景。
- 清理：`onBeforeUnmount` 清所有 timer。

### 9.6 惊吓层 HorrorOverlay.vue（B 层）
- 监听 `game.state.scare`（`{type,text,id}`），出现时渲染 `scare-overlay`（根据 type 切换 face 样式）+ 惊吓文案 + 噪点。1.3s 后 `scare=null`。

---

## 10. 视觉基调与氛围

### 10.1 B 层（暗夜瓦舍）
- 氛围层（App.vue site-shell）：烛火 2 盏、飘落灰烬 16 片、film grain 噪点、vignette 暗角。
- 主变量（main.css）：`--paper`、`--blood`(暗红)、`--blood-bright`、`--gold`、`--kai`(楷体)。
- 惊吓开关：每个支线页触发 `triggerScare`；Story 底部 `强惊吓：开/关`（`strong`）控制是否渲染（但各支线页目前由自己 `strong` 独立性处理，见下文"已知问题"）。

### 10.2 A 层（民国档案馆亮底）
- 泛黄纸底 `#efe6d2`、米色面板 `#f9f3e4`、暗红强调 `#8c2f24`、棕褐文字。
- 图片统一 sepia 做旧。

---

## 11. 已知问题 / 待办（提醒作者）

### 已定稿（v3 叙事）
- **6 沈晚立场**：五个孩子之一的残魂，善意但被碎片信息误导，误以为"父亲沈砚秋被困"→ 方向全错的提示。
- **8 沈砚秋动机**：= 沈怀仁本人（延寿后改名装困设局），明知故犯、幕后掌局、该死而想活，需玩家以「意」入局续命。
- **五童借财局体系**：前五根（眼耳鼻舌身）= 五个养子，各带先天缺陷；死因对应五脏×五行×**大五路财神**（东比干/南柴荣/西关公/北赵公明/中王亥，三方考证一致）；第六根「意」= 玩家，献祭魂魄为沈砚秋铸永生。

### 已定稿（作者已拍板）
- **结局档位**（第 10 条）：四结局已按"沈砚秋才是该死的人"重写——
  - bad 第六位：玩家补位，沈砚秋成活。
  - grey 账已焚：焚尽留白，不写结局，交读者脑补。
  - hidden 五人出账（好结局）：还名 + 拒绝补位。第六位无人，沈怀仁自己坐进去——用自己的魂续自己的命，但因借财路是单行道（只能借外来者之魂），自我续命=以柴引燃自身，烧不出火只成灰，**永世不得超生**，被永远钉在第六位，年年初五都醒着。非旧版"救出被困店主"，而是"让该死的人自食其果、求死不能"。
  - **第零笔**（灰结局专属 · 二周目隐藏层，非第四终局）：完整达成一次《账已焚》后，灰结局页隐形 `.grey-hint` → `/strike-zero`（时间倒流 → 黑屏 `第零笔：谁把门锁上？`）。语义：前五笔借五子之命、第六笔本该借玩家，而**第零笔是沈怀仁自己欠下的命债**（应死于 1927 却被自己逃掉）；玩家销毁账本恰替他藏了名，而第零笔将他永远钉在没锁的门里。物证图 `/img/strike_zero.webp`（倒走的钟 + 火中账页）。
- **13 冷启动站外种子线索**：示例文案+平台+指向站内路径。
- **21 年龄/惊吓默认**：惊吓默认关？首屏提示？
- **24 shortcuts 玩法**：触发方式+叙事含义，与 hidden 结局的因果。
- **26 素材可读性验收**：是否要一枚人工修的标志性物证。

### 遗留技术问题
1. **强惊吓开关未全局联动**：各支线页独立调用 `triggerScare`，未读取全局 `strong`。可在 game.js 加 `strong` 状态统一控制（现 triggerScare 已读 `cx_strong` localStorage，但支线页仍各自触发——已通过 `cx_strong=off` 拦截全局惊吓，Story 底部开关已写回该值）。
2. **施粥义举碑（zhouyi）无图**：多次生成均偏成建筑/山水，暂以"残页·无影像"占位。
3. **Home.vue（B层旧首页）是孤儿组件**：已不挂路由，保留不影响构建，仅冗余。
4. **activeChapter 初始推进**：第1章取签即完成，主线从第2章开始需解订单支线。若希望第1章也有动作门槛，需加子完成标记。
5. **A 层第0页 / 6连击入口** 只存在于影像浏览第一页，普通访问者无从得知，属刻意隐藏。
6. **五子与五路对应表（已落定）**：东比干-木-肝-眼 / 南柴荣-火-心-耳 / 西关公-金-肺-鼻 / 北赵公明-水-肾-舌 / 中王亥-土-脾-身；第六根「意」= 玩家。已按用户确认写入 §0，后续支线文案据此展开。

---

## 12. 配色/样式速查

| 用途 | 值 |
|---|---|
| A层底色 | `#efe6d2` |
| A层面板 | `#f9f3e4` / 边框 `#e0d2b4` |
| A层暗红强调 | `#8c2f24` |
| A层正文/棕 | `#4a3d29` / muted `#6d5f45` |
| B层暗红 | `--blood`（约 `#a8291c`） |
| B层亮红 | `--blood-bright`（`#d13424`） |
| B层金字/纸 | `--gold` / `--paper` |

---

## 13. 生产环境文件清单（要配图的）

`public/img/` 现有：
- 主页缩略图：`home-ledger-project.jpg`、`home-wanhe-ledger.jpg`
- 民俗档案 32 图：`folk-01.png` ~ `folk-32.png`
- 底图纹理：`bg_paper.jpg`
- B层氛围/物什：`fortune_candle.png`、`kettle_eye.png`、`poster_crack.png`、`shishitai.png`、`huaguang.png`、`ganlu.png`、`qianwen.png`、`baishi.png`、`bijie.png`、`guihua_stego.png`、`heihu.png`、`jinchan.png`、`ledger_blood.png`、`mingce.png`、`yanxia.png`、`zhangfang_silhouette.png`
- 底档软支线（本次新增）：`xiao-xie.png`、`hongao-shouyin.png`、`suanpan.png`、`huiwen.png`、`dianleng.png`、`shouni.png`
- 墙壁图：`wall_01.jpg`、`wall_03.jpg`、`wall_04.jpg`、`wall_05.jpg`

---

## 14. 参考文档

- `STORY_FLOW.md`：七章剧情 + 惊吓节点 + 结局分档（《第六位/账已焚/五人出账/第零笔》）。
- 本文档基于当前代码实录（非设计稿），后续改动请同步更新。

---

## 15. 实现现状（v4，2026-09-12）

> **重要**：本节之前的章节（第 3–7 节：线性章节、`Orders/Archive/Materials` 页、`materials.js`、`SiteHeader.vue`、`canVisit` 硬锁等）**已被 v4 取代**，保留作早期设计参考。以下为**当前真实结构**。

### 15.1 架构
- **B 面 = 碎片网**：`fragments.js`(33) + `journal.js`(16) + `entities.js`(11)；引用由 `net.js` 解析（137 边，`check_refs.py` 校验无悬空）。
- **旧页已删**：`Orders.vue` / `Archive.vue` / `Materials.vue` / `MaterialDetail.vue` / `materials.js` / 旧 `SiteHeader.vue`。
- **`game.js` 旧章节系统已清**：`CHAPTERS` / `branchDone` / `chapterOpen` / `canVisit` / `softOpen` / `advance` / `readSoft` 等全部移除；`state` 仅存 `wish/signed/roadSolved/audioSolved/portraitSolved/ending/shortcuts/pagesRead/keys/read`。
- **路由**：A 面（`mode:'public'`）/ B 面（`mode:'vault'`，`App.vue` 切壳 `archive-shell` / `vault-shell`）。
  B 面：`/story` `/f/:id` `/e/:id` `/journal` `/journal/:id` `/vault-search` `/strike-zero`。

### 15.2 线索分级（替代旧"章节硬锁"）
- `net.js` `LEVELS`：一级=主线10；二级=解谜素材；三级=隐藏；四级=干扰；文章默认一级。
- `game.maxLevel()`：未取签=1，取签=2，≥1钥匙=3，≥3钥匙=4。
- 首页只列"免锁"条目；检索按 `level ≤ maxLevel` 放开（`VaultSearch.vue`）。

### 15.3 钥匙链
`five-gods` 解五路→`de-mu`；`recording` 解录音→`huan-ming`；`photo-three` 解旧影→`di-liu-wei`；`zhaiyuan` 解安位→`zhenxiang`。（`fragments.js` 的 `requires`/`puzzle`/`key`。）

### 15.4 结局门槛（按钮按前置隐藏）
`Finale.vue`：
- 归还姓名(good)：`roadSolved && audioSolved && portraitSolved && shortcuts===0`。
- 销毁账簿(grey)：走完**灰线**（读 `ledger-errata` → `fenyu`《焚余》→ 集齐 4 回执 `obituary/yaozha/fortuneslip/guestbook`）。
- 第零笔：仅 `ending==='grey'` 经 `/strike-zero` 可达。

### 15.5 音频（B5 做实）
`public/audio/rec.mp3` 单条整轨（约 17s，双声道，−16LUFS）；`Audio.vue` 单播放器 + 真波形 + 监听仪残迹兜底；生成脚本 `_audio_tmp/gen.py`（edge-tts + ffmpeg）。

### 15.6 资产
- 图片全量 **WebP**（`public/img/*.webp`，约 8.3MB）；原图备份 `_img_src_backup`。
- 出图：`genimg.mjs`（GrsAI 中转 `/v1/draw/completions`），清单 `img_manifest.json`/`_batch2`/`_batch3`。
- 鬼脸跳脸 `HorrorOverlay.vue` 用生成图 `scare_face.webp`。

### 15.7 结项待办
见 `结项待办.md`。


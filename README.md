# 杭州民俗数字档案馆 · ARG

一个「民俗黑汤」风格的浏览器 **ARG（Alternate Reality Game）**。

表世界是一座平平无奇的 **杭州民俗数字档案馆**；翻开目录之外的那一页，是同一个档案馆的**异变副本**。

> ⚠️ **剧透预警**：本项目为解谜作品，README 与源码均含线索。想先体验请直接跑起来。

## 玩法一览

- **A 面（公开站）**：博物馆官网风格的档案馆——首页、馆藏检索、馆藏详情、公告、服务与授权、消息、帮助、数据校正记录。
- **B 面（异变副本）**：同一站点的腐坏版（暗底、血红框、乱码、失效导航）。以**碎片网**组织卷宗——
  碎片 / 馆刊 / 实体互相引用，靠**线索分级**随进度逐步放开；4 个谜题 → 4 档结局，含一个隐藏层。
- 恐怖**含蓄**，线索一律**文字驱动**；图片与音频仅作氛围。

## 技术栈

- **Vue 3 + Vue Router 4 + Vite 5**，纯静态、**无后端**。
- 无状态管理库；B 面进度用 Vue `reactive` + `localStorage` 持久化。
- 音频用 Web Audio API 播放；无第三方 UI 框架。

## 运行

```bash
npm install
npm run dev       # 开发预览
npm run build     # 构建到 dist/
npm run preview   # 预览构建产物
```

## 目录结构

```
src/
  views/            A 面页面（site/）与 B 面页面（碎片/馆刊/实体/谜题/结局）
  data/             fragments.js · journal.js · entities.js · net.js · courtyard.js
  stores/game.js    B 面进度状态（取签 / 钥匙 / 已读 / 结局）
  components/       壳层（A/B 两套）与视觉特效
public/
  img/              站点图片（全量 WebP）
  audio/            录音音频
```

## 说明

- 文中「回纹、初五、施食、财签、五路财神」等均为**虚构民俗意象**，不指向、也不污名化任何现实宗教场所或信仰。
- 剧情、人物、机构、馆藏号均为虚构。

## License

[CC BY-NC-ND 4.0](LICENSE)：署名 · 非商业性使用 · 禁止演绎（可非商业转发，但不得修改或商用）。
详见 [LICENSE](LICENSE)。

// 馆藏碎片网：碎片是节点，refs 是边，entities 是聚合点，puzzle/key 是解密与解锁。
// 主线不是页面顺序，而是穿过这张网的一条路径（玩家循钩子自己走）。
//
// 字段：
//   type      账册 / 图像 / 声音 / 文书 / 底档
//   content   碎片正文（段落数组）
//   refs      相关碎片 id（边）
//   entities  提到的实体 id（反向聚合）
//   puzzle    内嵌谜题（'roads' | 'audio' | 'portrait'），解开产出 key
//   key       阅读/解开后获得的钥匙 id
//   requires  需要某把钥匙才能调阅（锁）

const FRAGMENTS = [
  {
    id: 'ledger', type: '账册', title: '万和号流水簿', tag: 'HZ-1927-0512',
    img: '/img/home-wanhe-ledger.jpg',
    summary: '民国十六年至二十一年间杭州城南绸布南北货商号账册，共 86 页。',
    content: [
      '民国十六年至二十一年，杭州城南，万和号。绸布、南北货。逐页著录：日期、摘要、金额、经手人。',
      '馆藏号 HZ-1927-0512，共 86 页。第 5 页金额栏连续五个“零”，著录员于页边画回纹一道。',
      '附：订货存根一册，同批入藏。同批者另有一份火灾调查底稿，未见归档编号。',
      '入藏时间 2026-08-27，捐赠人栏为空。'
    ],
    refs: ['zero-page', 'order-stub', 'corrections'],
    entities: ['wanhe', 'shen-huai-ren']
  },
  {
    id: 'zero-page', type: '账册', title: '旧账第五页 · 五个零', tag: 'HZ-1927-0512 / P05',
    img: '/img/huiwen.png',
    summary: '米、药、衣、灯、人，金额全为零。每一笔零，都是被裁掉的一个名字。',
    content: [
      '初二，一斗米，街东王家，留作过年。—',
      '初六，一包药，落款被水迹浸去。0.00',
      '十二，一张船票，向南，勿候归期。0.00',
      '又及，一斗米、一包药、一张船票之外，账上还留着两笔没有摘要的零。',
      '账纸背面有一道反复描过的回纹。走满一圈，纸心有一处刀痕。',
      '著录员曾就本页提交一份勘误，未被采纳。'
    ],
    refs: ['shishitai-rubbing', 'huiwen', 'corrections'],
    entities: ['wanhe', 'five-children']
  },
  {
    id: 'order-stub', type: '账册', title: '订货存根 · 五笔', tag: '初四 23:47 起',
    img: '/img/xiao-xie.png',
    summary: '四笔零金额订单签收于 1927 年初五，第五笔的配送员是沈砚秋。',
    content: [
      '0512-01 一斗米，待签收。配送说明：留在门外，不要敲门。',
      '0512-02 一包退烧药，待签收。联系电话是一串算盘珠数。',
      '0512-03 一件红袄，待签收。衣角有被火烧过的手印。',
      '0512-04 一盏没有灯芯的灯，正在配货。配送员：沈砚秋，目的地：后间。',
      '四笔都写着“无需签收”。第五笔没有收件人。',
      '订单后台另存有一份留言墙快照，待清理。'
    ],
    refs: ['ledger', 'wuxin-lamp', 'hongao-shouyin', 'suanpan'],
    entities: ['wanhe', 'houjian', 'shen-huai-ren']
  },
  {
    id: 'shishitai-rubbing', type: '图像', title: '施食台碑拓', tag: '北高峰山门外',
    img: '/img/shishitai.png',
    summary: '碑额残损，碑文漫漶，唯有一句"受施者不得自报姓名"格外清晰。',
    content: [
      '拓纸左侧有一道反复描过的虫纹。收拾拓片的人没有把它归入"新近收到"，而是单独钉在了旧账的夹层里。',
      '碑上列着几尊财神的名号，方位却被人用刀刮乱，与拓片原本的顺序对不上。'
    ],
    refs: ['zero-page', 'five-gods', 'zhouyi'],
    entities: ['beigaofeng']
  },
  {
    id: 'five-gods', type: '图像', title: '五路财神 · 方位', tag: '山门之外',
    img: '/img/hongao-shouyin.png',
    summary: '东南西北中不是财路，是窗、井、柜、梁、门。五张卡片各写着一位神的名号。',
    content: [
      '东市、南码头、西巷、北峰、中街——五条"财路"的广告语底下，压着五尊神。',
      '认出他们，再按他们的典故，反推出各自守着哪一槛。'
    ],
    refs: ['shishitai-rubbing', 'recording', 'huashu', 'dianleng'],
    entities: ['bi-gan', 'chai-rong', 'guan-gong', 'zhao-gong-ming', 'wang-hai'],
    puzzle: 'roads', key: 'de-mu'
  },
  {
    id: 'recording', type: '声音', title: '后间录音 · 报数', tag: '00:03:47',
    img: '/img/kettle_eye.png',
    summary: '五个孩子的声音轮流报数，每到第六声就被一个男人的算盘打断。',
    content: [
      '五段静音是同一段录音的五次变声。各藏着一个字。',
      '别让它数到六。'
    ],
    refs: ['order-stub', 'family-tree', 'suanpan', 'wuxin-lamp'],
    entities: ['houjian', 'five-children'],
    requires: 'de-mu', puzzle: 'audio', key: 'huan-ming'
  },
  {
    id: 'family-tree', type: '文书', title: '沈晚族谱', tag: '馆藏号 SP-1927-0007',
    img: '/img/qianwen.png',
    summary: '一册残缺的族谱。只留一个名字：女，沈晚。父，沈砚秋。',
    content: [
      '谱系栏大部分是空的，纸被水浸过。唯独“沈晚”二字被人反复描过，墨色比别处新。',
      '“父，沈砚秋。”——可沈砚秋这个名字，在 1927 年的账上并不存在。',
      '馆员登记表里另有一个“沈砚秋”，在编。'
    ],
    refs: ['recording', 'photo-three', 'ledger'],
    entities: ['shen-wan', 'shen-huai-ren'],
    requires: 'huan-ming'
  },
  {
    id: 'photo-three', type: '图像', title: '旧影 · 五张脸', tag: '影像修复',
    img: '/img/baishi.png',
    summary: '三张馆藏影像，年代不同，却都留着同一道像孩子蜷背的裂纹。',
    content: [
      '1901 的财神像、1916 的东坡像、今夜的无名石龛。',
      '三张脸被刻过三次，却都留着同一条裂纹——那是名字被刮掉后留下的。',
      '修复记录旁另钉着一张财签，编号 0512。'
    ],
    refs: ['family-tree', 'zhaiyuan', 'shouni'],
    entities: ['shen-huai-ren', 'five-children'],
    puzzle: 'portrait', key: 'di-liu-wei'
  },
  {
    id: 'zhaiyuan', type: '图像', title: '宅院图 · 四合院', tag: '万和号后院',
    img: '/img/baishi.png',
    summary: '一座四合院的平面。五个孩子不是同时死的，也死在不同的方位。',
    content: [
      '东厢、南房、西厢、北房、中堂——五处。',
      '账上只记了各自的病，没记死在哪儿。'
    ],
    refs: ['photo-three', 'finale-ledger'],
    entities: ['wanhe', 'five-children'],
    requires: 'di-liu-wei', puzzle: 'zhaiyuan', key: 'zhenxiang'
  },
  {
    id: 'finale-ledger', type: '账册', title: '封卷 · 结本月账', tag: 'HZ-1927-0512 / 末',
    img: '/img/poster_crack.png',
    summary: '五个名字已经补齐。现在只等你签第六格。',
    content: [
      '后间门后不是普通后台。',
      '这本账要封了。'
    ],
    refs: ['zhaiyuan', 'ledger'],
    entities: ['wanhe', 'shen-huai-ren'],
    requires: 'zhenxiang', puzzle: 'finale'
  },

  /* ---------- 文书 · 校正 ---------- */
  {
    id: 'corrections', type: '文书', title: '数据校正记录', tag: 'C-2026 系列',
    img: '/img/qianwen.png',
    summary: '馆方对著录错漏的更正留痕。有一条，改的墨和原字一样旧。',
    content: [
      'C-2026-0016：云林禅寺经卷登记册"韦驮殿"误作"韦陀殿"，已更正。',
      'C-2026-0031：施食台碑记拓片题名年代由"民国三十六年"更正为"民国三十七年"。',
      'C-2026-0513：万和号流水簿著录"共 86 页"，影像装订似多出一页残页，暂未列入目录。'
    ],
    refs: ['ledger', 'zero-page'],
    entities: ['wanhe']
  },

  /* ---------- 底档碎片（线索） ---------- */
  {
    id: 'suanpan', type: '底档', title: '算盘珠号码', tag: '第二笔订单',
    img: '/img/suanpan.png',
    summary: '联系电话是一串算盘珠的数。拨到第五位，算盘自己又拨回了一颗。',
    content: [
      '摊开来，它更像一组坐标——指向山门外那个不存在的门牌。',
      '灯下看，算盘横梁上被人用指甲刻了个小字：义。',
      '账房批注：东向这位，比干，无心故无私，主一个人字。'
    ],
    refs: ['order-stub', 'recording'],
    entities: ['bi-gan', 'wanhe']
  },
  {
    id: 'wuxin-lamp', type: '底档', title: '无芯灯', tag: '第五笔订单',
    img: '/img/kettle_eye.png',
    summary: '一盏没有灯芯的灯。灯芯位置总是不太对——像有一只眼睛隔着铜口朝外看。',
    content: [
      '你看着它的时候，它也在看你。配货员一栏写着沈砚秋，目的地写着后间。',
      '铜口内侧被摩挲出一道浅痕，凑近了看是个字：商。',
      '账房批注：中向这位，王亥，服牛驯马、负贩四方，主一个商字。'
    ],
    refs: ['order-stub', 'recording'],
    entities: ['wang-hai', 'houjian', 'shen-huai-ren']
  },
  {
    id: 'hongao-shouyin', type: '底档', title: '红袄衣角', tag: '第三笔订单',
    img: '/img/hongao-shouyin.png',
    summary: '一件红袄的衣角，缝着一个烧焦的小手印。',
    content: [
      '有人想把它剪掉。剪到一半又停了，留了个口子，像是在等谁来接。',
      '衣角背面用红线补了一笔，凑成小字：让。',
      '账房批注：南向这位，柴荣，少年贩茶、让利于人，主一个让字。'
    ],
    refs: ['order-stub', 'recording'],
    entities: ['chai-rong', 'five-children']
  },
  {
    id: 'huashu', type: '底档', title: '财神化疏仪式', tag: '开市旧俗',
    img: '/img/huaguang.png',
    summary: '正月初五开市，商铺点香化疏。唯独这一家的疏文末尾，多了半句没写完的话。',
    content: [
      '纸角被香灰压住一小块，正好圈出一个字：信。',
      '账房批注：西向这位，关公，挂印封金、忠信立业，主一个信字。'
    ],
    refs: ['five-gods'],
    entities: ['guan-gong']
  },
  {
    id: 'dianleng', type: '底档', title: '点灯迎财旧俗', tag: '求财旧俗考释',
    img: '/img/dianleng.png',
    summary: '旧俗点灯迎财——灯要亮到鸡鸣，灭了就不吉利。',
    content: [
      '这一年灯没灭过。可账上写着，灯油早就见底了。',
      '灯座底刻了个字：和。',
      '账房批注：北向这位，赵公明，玄坛黑虎、和合聚财，主一个和字。'
    ],
    refs: ['five-gods'],
    entities: ['zhao-gong-ming']
  },
  {
    id: 'huiwen', type: '底档', title: '回纹走法', tag: '旧账第五页',
    img: '/img/huiwen.png',
    summary: '账纸背面的回形纹路。顺时针读是吉祥如意，逆时针读却是一行小字。',
    content: [
      '"回转，不等于偿还。"',
      '走满一圈，纸心有一处刀痕。'
    ],
    refs: ['zero-page'],
    entities: ['wanhe']
  },
  {
    id: 'zhouyi', type: '底档', title: '施粥义举碑', tag: '碑记拓片',
    img: '/img/zhouyi.png',
    summary: '"施粥义举"碑的石拓。捐资人的名字被凿去过，只留一行空。',
    content: [
      '凿痕很深，像是下了死力气，又像是在替某人遮掩。',
      '碑侧小字记着年份：民国二十七年。'
    ],
    refs: ['shishitai-rubbing'],
    entities: ['beigaofeng']
  },
  {
    id: 'shouni', type: '底档', title: '一枚红指印', tag: '财签 0512',
    img: '/img/shouni.png',
    summary: '财签上第五枚红指印。指腹纹路清楚，像是刚按上去的。',
    content: [
      '它不该出现在这里。签纸日期是 1927 年。',
      '五枚指印里，有四枚已经淡了。'
    ],
    refs: ['photo-three'],
    entities: ['five-children']
  },

  /* ---------- 干扰项 / 正常记录（网里的冗余） ---------- */
  {
    id: 'nianhua', type: '图像', title: '财神年画图档整理', tag: 'CW-0003',
    img: '/img/huaguang.png',
    summary: '旧历年画中的财神题材分类著录。元宝、聚宝盆、如意、连钱逐一考源。',
    content: [
      '文财神、武财神、五路财神、刘海戏蟾——按题材分目。',
      '其中"五路财神"一幅，横幅下缘的方位标注被人剪去，只剩五个空位。'
    ],
    refs: ['five-gods'],
    entities: []
  },
  {
    id: 'noticemid', type: '文书', title: '中秋节假期开放时间安排', tag: '2026-08-19',
    img: '',
    summary: '本馆中秋假期开放时间安排，闭馆一日。',
    content: [
      '中秋假期本馆照常开放，10 月 1 日闭馆一日。',
      '特藏室照常预约。'
    ],
    refs: [],
    entities: []
  },
  {
    id: 'donation', type: '文书', title: '民间文书捐赠征集公告', tag: '长期有效',
    img: '',
    summary: '面向社会征集民间文书。附历年受赠清单。',
    content: [
      '征集范围：账册、契据、书信、照片。',
      '受赠清单中，HZ-1927 系列之后空了一行，编号被划去，未注明原因。'
    ],
    refs: ['ledger'],
    entities: []
  },

  /* ---------- 只靠检索才浮现的碎片（hidden） ---------- */
  {
    id: 'fire-report', type: '文书', title: '火灾调查报告', tag: '民国十六年 · 存疑',
    img: '/img/ledger_blood.png',
    summary: '一份关于万和号旧址火灾的调查记录。结论一栏被涂改过。',
    content: [
      '民国十六年正月初五夜，万和号后间起火。火势不大，未及邻铺。',
      '在场人员：沈怀仁（店主）。伤亡：无。',
      '结论栏原有数字被涂去，重写为"意外"。原件背面另有一行小字：后间门自外锁。',
      '此件未见归档编号，疑为底稿。'
    ],
    refs: ['ledger', 'zero-page'],
    entities: ['wanhe', 'shen-huai-ren', 'five-children'],
    hidden: true
  },
  {
    id: 'staff-shen', type: '文书', title: '馆员登记表 · 沈砚秋', tag: '在编',
    img: '',
    summary: '一名馆员的登记表。入职年份一栏，写着一个早于本馆成立的年份。',
    content: [
      '姓名：沈砚秋。职务：特藏整理。',
      '入职年份：民国十六年。',
      '备注：该馆员负责万和号一批账册的整理。近年仍在列，未见离退记录。'
    ],
    refs: ['ledger', 'family-tree'],
    entities: ['shen-huai-ren'],
    hidden: true
  },
  {
    id: 'guestbook', type: '文书', title: '留言墙存档', tag: '待清理',
    img: '',
    summary: '网页留言墙的存档。所有留言来自同一时间、同一段话。',
    content: [
      '"请问第五笔订单什么时候到？"',
      '"请问第五笔订单什么时候到？"',
      '"请问第五笔订单什么时候到？"',
      '——共 47 条，同一秒发出。'
    ],
    refs: ['ledger', 'order-stub'],
    entities: ['wanhe'],
    hidden: true
  },
  {
    id: 'fortuneslip', type: '文书', title: '财签 · 0512', tag: '取签记录',
    img: '/img/shouni.png',
    summary: '一张 1927 年的财签。底部有六格指印位，按了五格。',
    content: [
      '签文：求财者众，补位者寡。',
      '底部六格，五格有红指印，第六格空着，纸面发潮。',
      '签纸日期：民国十六年正月初五。'
    ],
    refs: ['photo-three', 'shouni', 'recording'],
    entities: ['five-children', 'wanhe'],
    hidden: true
  },
  {
    id: 'ledger-errata', type: '文书', title: '著录勘误 · 存疑', tag: '未采纳',
    img: '',
    summary: '一份未被采纳的勘误。它说第五页的五个零，原本是五个名字。',
    content: [
      '勘误：旧账第五页金额栏"0.00"系后人涂改。原件此处应为五个人名，墨迹尚存。',
      '处理意见：不予采纳。原件已按现貌著录。',
      '经办：沈砚秋。'
    ],
    refs: ['zero-page', 'corrections', 'staff-shen'],
    entities: ['wanhe', 'shen-huai-ren'],
    hidden: true
  }
]

export default FRAGMENTS

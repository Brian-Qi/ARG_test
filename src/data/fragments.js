// 馆藏碎片网：碎片是节点，refs 是边，entities 是聚合点，puzzle/key 是解密与解锁。
// 主线不是页面顺序，而是穿过这张网的一条路径（玩家循钩子自己走）。
//
// 字段：
//   type      账册 / 图像 / 声音 / 文书 / 底档
//   content   碎片正文（段落数组）——一律写成"档案原文/著录"口吻，不指图、不指位、不写物件部位
//   refs      相关碎片 id（边）
//   entities  提到的实体 id（反向聚合）
//   puzzle    内嵌谜题（'roads' | 'audio' | 'portrait' | 'zhaiyuan' | 'finale'），解开产出 key
//   key       阅读/解开后获得的钥匙 id
//   requires  需要某把钥匙才能调阅（锁）
//   img       氛围用图（不承载线索）

const FRAGMENTS = [
  /* ================= 一级 · 主线核心 ================= */
  {
    id: 'ledger', type: '账册', title: '万和号流水簿', tag: 'HZ-1927-0512',
    img: '/img/ledger-dark.webp',
    summary: '民国十六年至二十一年间杭州城南绸布南北货商号账册，共 86 页。',
    content: [
      '馆藏号 HZ-1927-0512。万和号，杭州城南，绸布、南北货，前店后院。经营凡五年，民国十六年至二十一年。',
      '半框朱丝栏，竹纸，双股棉线装。逐页著录：日期、摘要、金额、经手人。字迹有二：一为账房行楷，一为另一人细笔，笔锋生硬，似后补。',
      '共八十六页。页码至八十五止，然装订实多一页，无页码、无摘要，夹于第五页之后。',
      '第五笔往来，金额连着五个“零”。墨色较全册为深，纸面却未见刮擦痕。',
      '页边另有一道回纹，其读法见底档《回纹走法》。馆方另存《数据校正记录》一份，涉及本册页数。',
      '同批入藏：订货存根一册；讣告五张，未编号。',
      '入藏时间 2026-08-27。捐赠人栏空白。'
    ],
    refs: ['zero-page', 'order-stub', 'corrections', 'huiwen'],
    entities: ['wanhe', 'shen-huai-ren']
  },
  {
    id: 'zero-page', type: '账册', title: '旧账第五页 · 五个零', tag: 'HZ-1927-0512 / P05',
    img: '/img/huiwen.webp',
    summary: '米、药、衣、灯、人，金额全为零。每一笔零，都是被裁掉的一个名字。',
    content: [
      '此页夹于第五页之后，无页码、无摘要，纸色与全册微异，边角有烟熏痕。',
      '初二，一斗米，街东王家，留作过年。——金额栏空。',
      '初六，一包药，落款被水迹浸去。0.00',
      '十二，一张船票，向南，勿候归期。0.00',
      '又及：一斗米、一包药、一张船票之外，另有两笔没有摘要的零。五笔合计，仍是零。',
      '著录员注：本页回纹走满一圈，圈心见一道刀痕；逆读之，得一句。见底档《回纹走法》。',
      '著录员曾就本页“零”字提交勘误，未被采纳。原件已按现貌著录。'
    ],
    refs: ['shishitai-rubbing', 'huiwen', 'corrections'],
    entities: ['wanhe', 'five-children']
  },
  {
    id: 'order-stub', type: '账册', title: '订货存根 · 五笔', tag: '初四 23:47 起',
    img: '/img/xiao-xie.webp',
    summary: '四笔零金额订单签收于 1927 年初五，第五笔的配送员是沈砚秋。',
    content: [
      '存根一册，共五联，前四联有编号，第五联无。',
      '0512-01 一斗米，待签收。备注：留在门外，不要敲门。',
      '0512-02 一包退烧药，待签收。联系电话是一串算盘珠数，见底档《算盘珠号码》。',
      '0512-03 一件红袄，待签收。衣角缝着一个焦黑的小手印，见底档《红袄衣角》。',
      '0512-04 一盏没有灯芯的灯，正在配货。配送员：沈砚秋。目的地：后间。见底档《无芯灯》。',
      '四笔皆注“无需签收”，签收时间同为初五 23:47。',
      '第五笔没有收件人，也没有摘要。',
      '另存留言墙快照一份，待清理。'
    ],
    refs: ['ledger', 'menwai', 'suanpan', 'hongao-shouyin', 'wuxin-lamp', 'koushu'],
    entities: ['wanhe', 'houjian', 'shen-huai-ren']
  },
  {
    id: 'shishitai-rubbing', type: '图像', title: '施食台碑拓', tag: '北高峰山门外',
    img: '/img/shishitai.webp',
    summary: '碑额残损，碑文漫漶，唯有一句"受施者不得自报姓名"格外清晰。',
    content: [
      '北高峰山门外，施食台碑，民国立。拓本一件，纸本墨拓，边角有虫蛀。',
      '碑额残损，碑文漫漶，唯“受施者不得自报姓名”一句清晰可辨。',
      '五尊财神的名号与方位被人刮乱，刮痕新于拓墨，与拓本顺序对不上。',
      '碑阴另有一行小字，拓工未录。原石上似有，待勘。',
      '同批碑拓另有《施粥义举碑》一件，捐资人一栏亦被凿空。',
      '此拓未入“新近收到”之列，另钉于旧账夹层。'
    ],
    refs: ['zero-page', 'five-gods', 'zhouyi'],
    entities: ['beigaofeng']
  },
  {
    id: 'five-gods', type: '图像', title: '五路财神 · 方位', tag: '山门之外',
    img: '/img/five-gods.webp',
    summary: '东南西北中不是财路，是窗、井、柜、梁、门。五张卡片各写着一位神的名号。',
    content: [
      '城南旧岁，五条“财路”的广告招贴：东市、南码头、西巷、北峰、中街。',
      '招贴上的广告语底下，压着五尊神的名号。名号与通行谱系不合，方位亦被人剪去，只剩五个空位。',
      '东市——比干；南码头——柴荣；西巷——关公；北峰——赵公明；中街——王亥。',
      '认出他们，再按各自的典故，反推出各自守着哪一槛。五槛非路，是门、柜、梁、井、窗。',
      '五神的德目与旧事，另见底档《财神化疏仪式》《点灯迎财旧俗》。'
    ],
    refs: ['shishitai-rubbing', 'recording', 'huashu', 'dianleng'],
    entities: ['bi-gan', 'chai-rong', 'guan-gong', 'zhao-gong-ming', 'wang-hai'],
    puzzle: 'roads', key: 'de-mu'
  },
  {
    id: 'recording', type: '声音', title: '后间录音 · 报数', tag: '00:03:47',
    img: '/img/recording.webp',
    summary: '五个孩子的声音轮流报数，每到第六声就被一个男人的算盘打断。',
    content: [
      '磁带一盘，标“后间，00:03:47”，来源不详，与账册同批入藏。',
      '前段是空房间的底噪，夹着算盘珠滚动的轻响。',
      '后段是五个孩子的声音，轮流报数：一、二、三、四、五。每到第六声，就被一个男人的算盘打断。',
      '五段静音是同一段录音的五次变声，各藏着一个字。一盘磁带只标干支，字藏在电流里。',
      '别让它数到六。',
      '相关物证见底档《算盘珠号码》《无芯灯》《红袄衣角》。'
    ],
    refs: ['order-stub', 'family-tree', 'suanpan', 'wuxin-lamp', 'hongao-shouyin'],
    entities: ['houjian', 'five-children'],
    requires: 'de-mu', puzzle: 'audio', key: 'huan-ming'
  },
  {
    id: 'family-tree', type: '文书', title: '沈晚族谱', tag: '馆藏号 SP-1927-0007',
    img: '/img/qianwen.webp',
    summary: '一册残缺的族谱。只留一个名字：女，沈晚。父，沈砚秋。',
    content: [
      '一册残缺族谱，竹纸，线装，谱系大半空白，似被水浸后又撕去数页。',
      '谱末只留一名：女，沈晚。生于民国十六年正月初四。',
      '“父，沈砚秋。”——可“沈砚秋”这个名字，在 1927 年的账上并不存在。',
      '母氏一栏空白。旁注一行小字：“寄养，勿寻。”',
      '馆员登记表里另有一个“沈砚秋”，在编，入职年份早于本馆成立。'
    ],
    refs: ['recording', 'photo-three', 'ledger'],
    entities: ['shen-wan', 'shen-huai-ren'],
    requires: 'huan-ming'
  },
  {
    id: 'photo-three', type: '图像', title: '旧影 · 五张脸', tag: '影像修复',
    img: '/img/baishi.webp',
    summary: '三张馆藏影像，年代不同，却都留着同一道像孩子蜷背的裂纹。',
    content: [
      '馆藏影像三张，来源各异，同批修复。',
      '其一，1901，洋人镜头下的城南街市；其二，1916，某商号开业合影；其三，修复系统显示“今日”入档，原片来源不明。',
      '三张脸都被刻过，都留着同一条裂纹——像孩子蜷起背的弧度。那是名字被刮掉后留下的。',
      '修复员注：三张照片的裂纹走向一致，疑为同一工具所致。',
      '另附财签一张，编号 0512；其指印见底档《一枚红指印》。'
    ],
    refs: ['family-tree', 'zhaiyuan', 'shouni'],
    entities: ['shen-huai-ren', 'five-children'],
    puzzle: 'portrait', key: 'di-liu-wei'
  },
  {
    id: 'zhaiyuan', type: '图像', title: '宅院图 · 四合院', tag: '万和号后院',
    img: '/img/zhaiyuan.webp',
    summary: '一座四合院的平面。五个孩子不是同时死的，也死在不同的方位。',
    content: [
      '万和号后院，四合院格局：东厢、南房、西厢、北房，中为天井。',
      '与常制不同者，各房另设一门，直通院外小巷。五门方位，恰合东、南、西、北、中。',
      '图上五房皆有注记，注记被人涂去，只余墨团。',
      '账上只记了五个孩子各自的病，没记死在哪儿。',
      '五子各自的病殁，另见《讣告 · 五童》。'
    ],
    refs: ['photo-three', 'finale-ledger', 'menpai'],
    entities: ['wanhe', 'five-children'],
    requires: 'di-liu-wei', puzzle: 'zhaiyuan', key: 'zhenxiang'
  },
  {
    id: 'finale-ledger', type: '账册', title: '封卷 · 结本月账', tag: 'HZ-1927-0512 / 末',
    img: '/img/poster_crack.webp',
    summary: '五个名字已经补齐。现在只等你签第六格。',
    content: [
      '本月账，未结。',
      '五个名字已经补齐。第六格空着。',
      '后间门后不是普通后台。门后是那本账。',
      '这本账要封了。签与不签，都在你。'
    ],
    refs: ['zhaiyuan', 'ledger', 'houjian'],
    entities: ['wanhe', 'shen-huai-ren'],
    requires: 'zhenxiang', puzzle: 'finale'
  },

  /* ================= 文书 · 校正 ================= */
  {
    id: 'corrections', type: '文书', title: '数据校正记录', tag: 'C-2026 系列',
    img: '/img/corrections.webp',
    summary: '馆方对著录错漏的更正留痕。有一条，改的墨和原字一样旧。',
    content: [
      'C-2026-0016：云林禅寺经卷登记册“韦驮殿”误作“韦陀殿”，已更正。',
      'C-2026-0022：某口述史录音时长由“00:03:46”更正为“00:03:47”，据录音原件。',
      'C-2026-0031：施食台碑记拓片题名年代由“民国三十六年”更正为“民国三十七年”。',
      'C-2026-0513：万和号流水簿著录“共 86 页”，实际似多出一页残页，暂未列入目录。',
      'C-2026-0514：第五页“0.00”墨色异常，拟另案处理。',
      '末条批注：此项墨色与原档一致，且用旧墨，疑非本年度所加。'
    ],
    refs: ['ledger', 'zero-page'],
    entities: ['wanhe']
  },

  /* ================= 二级 · 解谜素材 ================= */
  {
    id: 'menwai', type: '底档', title: '门外 · 一斗米', tag: '第一笔订单',
    img: '/img/menwai.webp',
    summary: '第一笔订单：一斗米，留在门外，不要敲门。米没被取走，门也没开。',
    content: [
      '0512-01 一斗米，待签收。备注：留在门外，不要敲门。',
      '米袋搁在门槛外，一夜未动。次日清点，袋口系着的红绳仍是原样，未曾解开。',
      '门内无脚步声。门外也无。',
      '账房批注：此笔不入流水，另记。'
    ],
    refs: ['order-stub', 'houjian'],
    entities: ['wanhe', 'houjian']
  },
  {
    id: 'suanpan', type: '底档', title: '算盘珠号码', tag: '第二笔订单',
    img: '/img/suanpan.webp',
    summary: '联系电话是一串算盘珠的数。拨到第五位，算盘自己又拨回了一颗。',
    content: [
      '第二笔订单的联系电话，是一串算盘珠的数：上二下七，逢五进一，拨到第五位。',
      '拨到第五位时，算盘自己又拨回了一颗。再拨，再回。',
      '算盘边框上刻着一个字：义。刻痕与算盘同年，非后加。',
      '账房批注：东向这位，比干，无心故无私，主一个人字。'
    ],
    refs: ['order-stub', 'recording'],
    entities: ['bi-gan', 'wanhe']
  },
  {
    id: 'wuxin-lamp', type: '底档', title: '无芯灯', tag: '第四笔订单',
    img: '/img/kettle_eye.webp',
    summary: '一盏没有灯芯的灯。像一只眼睛，朝外看着。',
    content: [
      '一盏铜灯，无芯。灯座尚有余油，早已凝住。',
      '灯罩上留着一圈熏痕，像是长明过许久。像一只眼睛，朝外看着。',
      '配货员：沈砚秋。目的地：后间。',
      '灯底磨出一个字：商。',
      '账房批注：中向这位，王亥，服牛驯马、负贩四方，主一个商字。'
    ],
    refs: ['order-stub', 'recording'],
    entities: ['wang-hai', 'houjian', 'shen-huai-ren']
  },
  {
    id: 'hongao-shouyin', type: '底档', title: '红袄衣角', tag: '第三笔订单',
    img: '/img/hongao-shouyin.webp',
    summary: '一件红袄，缝着一个焦黑的小手印。',
    content: [
      '一件红袄，女童样式，前襟缝着一个焦黑的小手印。',
      '手印五指分明，像是隔着布烙上去的。',
      '衣角有剪痕，剪到一半又停。断口处补着一笔，凑成一个小字：让。',
      '账房批注：南向这位，柴荣，少年贩茶、让利于人，主一个让字。'
    ],
    refs: ['order-stub', 'recording'],
    entities: ['chai-rong', 'five-children']
  },
  {
    id: 'huashu', type: '底档', title: '财神化疏仪式', tag: '开市旧俗',
    img: '/img/huaguang.webp',
    summary: '正月初五开市，商铺点香化疏。唯独这一家的疏文末尾，多了半句没写完的话。',
    content: [
      '正月初五开市，商铺点香化疏，迎五路财神。疏文格式，各号略同。',
      '唯独这一家的疏文，末尾多了半句没写完的话，墨迹到此断住。',
      '香灰落定，圈出一个字：信。',
      '账房批注：西向这位，关公，挂印封金、忠信立业，主一个信字。'
    ],
    refs: ['five-gods'],
    entities: ['guan-gong']
  },
  {
    id: 'dianleng', type: '底档', title: '点灯迎财旧俗', tag: '求财旧俗考释',
    img: '/img/dianleng.webp',
    summary: '旧俗点灯迎财——灯要亮到鸡鸣，灭了就不吉利。',
    content: [
      '旧俗点灯迎财——正月初五起，灯要亮到鸡鸣。中途灭了，主一年不利。',
      '这一年，灯没灭过。',
      '可账上写着，灯油早就见底了。',
      '灯座刻着一个字：和。',
      '账房批注：北向这位，赵公明，玄坛黑虎、和合聚财，主一个和字。'
    ],
    refs: ['five-gods'],
    entities: ['zhao-gong-ming']
  },
  {
    id: 'huiwen', type: '底档', title: '回纹走法', tag: '旧账第五页',
    img: '/img/huiwen.webp',
    summary: '回形纹路。顺时针读是吉祥如意，逆时针读却是一行小字。',
    content: [
      '回形纹路，账册页边常见，取“财源回转”之吉。',
      '顺时针读，皆是吉祥语；逆时针读，字序全反，别成一句。',
      '本页逆读，得八字：“回转，不等于偿还。”',
      '走满一圈，圈心见一处刀痕。刀痕何来，无考。',
      '按账房旧例，“回转”谓款项往来，“偿还”谓债务了结。二者本非一事，此页却并提。'
    ],
    refs: ['zero-page'],
    entities: ['wanhe']
  },
  {
    id: 'zhouyi', type: '底档', title: '施粥义举碑', tag: '碑记拓片',
    img: '/img/zhouyi.webp',
    summary: '"施粥义举"碑的石拓。捐资人的名字被凿去过，只留一行空。',
    content: [
      '“施粥义举”碑的石拓，纸本墨拓，碑在城北。',
      '碑记年份：民国二十七年。施粥之举，多在灾年。',
      '捐资人的名字被凿去过，只留一行空。凿痕很深，像是下了死力气，又像是在替某人遮掩。',
      '碑阴另有一行，记施粥起讫。受施者照例不留名。',
      '凿者是谁、所凿何名，碑记无载。'
    ],
    refs: ['shishitai-rubbing'],
    entities: ['beigaofeng']
  },
  {
    id: 'shouni', type: '底档', title: '一枚红指印', tag: '财签 0512',
    img: '/img/shouni.webp',
    summary: '第五枚红指印。纹路清楚，像是刚按上去的。',
    content: [
      '财签一张，编号 0512，底部设六格指印位，已按五格。',
      '第五枚红指印，纹路清楚，像是刚按上去的。',
      '它不该出现在这里。签纸日期是民国十六年正月初五。',
      '五枚指印里，有四枚已经淡了。唯这一枚，新得不合常理。',
      '第六格空着，未按。'
    ],
    refs: ['photo-three'],
    entities: ['five-children']
  },
  {
    id: 'koushu', type: '文书', title: '店伙口供 · 录副', tag: '民国十七年',
    img: '/img/koushu.webp',
    summary: '一份店伙的口供录副。他只肯说，初五夜里后间亮着灯，孩子一个接一个进去。',
    content: [
      '问：初五夜里，店中可有异状？',
      '答：后间亮着灯。店主不许人近。',
      '问：可有旁人出入？',
      '答：五个孩子，一个接一个被叫进去。头一个进去，就没再出来。',
      '问：你可看清里面？',
      '答：灯是亮的，门是关的。里头没有声。',
      '问：后来呢？',
      '答：后来账就平了。',
      '录副至此止。末页有墨点，似搁笔良久。'
    ],
    refs: ['order-stub', 'zhaiyuan', 'recording'],
    entities: ['wanhe', 'houjian', 'five-children']
  },
  {
    id: 'menpai', type: '图像', title: '五门门牌 · 拓存', tag: '后院五门',
    img: '/img/menpai.webp',
    summary: '后院五门各有一块门牌，牌上的字号被凿去，只留方位。',
    content: [
      '后院五门，各钉门牌一块，木制，字口尚清。',
      '东厢、南房、西厢、北房、中堂——五牌方位分明。',
      '每块牌上，原刻有一个孩子的名。名被凿去，凿痕深浅不一：有的只刮一层，有的凿穿了木。',
      '中堂那块，凿得最浅，像是下不去手。'
    ],
    refs: ['zhaiyuan', 'photo-three'],
    entities: ['five-children', 'wanhe']
  },
  {
    id: 'houjian', type: '图像', title: '后间 · 门后', tag: '万和号后进',
    img: '/img/houjian.webp',
    summary: '后间的平面。门后不是墙，是一口柜。柜里放着一本账。',
    content: [
      '后间一间，无窗，一灯一门。',
      '门后不是墙——是一口立柜，柜门朝里。',
      '柜中一格，恰容一册账。格底有压痕，与流水簿大小相符。',
      '图上另注：柜锁早失，门却始终关着。'
    ],
    refs: ['finale-ledger', 'order-stub', 'zhaiyuan'],
    entities: ['houjian', 'wanhe']
  },

  /* ================= 四级 · 干扰项 / 正常记录（网里的冗余） ================= */
  {
    id: 'nianhua', type: '图像', title: '财神年画图档整理', tag: 'CW-0003',
    img: '/img/nianhua.webp',
    summary: '旧历年画中的财神题材分类著录。元宝、聚宝盆、如意、连钱逐一考源。',
    content: [
      '旧历年画，按财神题材分目：文财神、武财神、五路财神、刘海戏蟾。',
      '其中“五路财神”一幅，方位标注被人剪去，只剩五个空位。',
      '年画用色：丹红、石青、槐黄。杭城年画多用套色木版，此为近刻。',
      '图档编号 CW-0003。'
    ],
    refs: ['five-gods'],
    entities: []
  },
  {
    id: 'noticemid', type: '文书', title: '中秋节假期开放时间安排', tag: '2026-08-19',
    img: '/img/noticemid.webp',
    summary: '本馆中秋假期开放时间安排，闭馆一日。',
    content: [
      '中秋假期本馆照常开放，10 月 1 日闭馆一日。',
      '特藏室照常预约，每日限二十名。',
      '闭馆期间，线上检索照常。'
    ],
    refs: [],
    entities: []
  },
  {
    id: 'donation', type: '文书', title: '民间文书捐赠征集公告', tag: '长期有效',
    img: '',
    summary: '面向社会征集民间文书。附历年受赠清单。',
    content: [
      '征集范围：账册、契据、书信、照片，不限年代。',
      '受赠者将获颁收藏证书，并可优先调阅所捐文书之数字件。',
      '受赠清单中，HZ-1927 系列之后空了一行，编号被划去，未注明原因。'
    ],
    refs: ['ledger'],
    entities: []
  },

  /* ================= 三级 · 只靠检索才浮现（hidden） ================= */
  {
    id: 'obituary', type: '文书', title: '讣告 · 五童', tag: '民国十六年',
    img: '/img/obituary.webp',
    summary: '五条讣告，记着五个孩子的“病殁”。都像病，可日子对不上。',
    content: [
      '讣告五张，未编号，与账册同批入藏。落款日期前后不过一年。',
      '养子一，病殁。殁前目黄、身黄。',
      '养子二，病殁。殁前心悸、猝倒。',
      '养子三，病殁。殁前干咳、咯血。',
      '养子四，病殁。殁前舌溃、水肿。',
      '养子五，病殁。殁前吐泻、虚脱。',
      '五张所记症状各异，分观之各为一病，合观之恰应五脏。死的地方，没记。',
      '主人姓氏一栏，五张皆空。'
    ],
    refs: ['ledger', 'zhaiyuan', 'yaozha'],
    entities: ['wanhe', 'five-children'],
    hidden: true
  },
  {
    id: 'staff-shen', type: '文书', title: '馆员登记表 · 沈砚秋', tag: '在编',
    img: '/img/staff-shen.webp',
    summary: '一名馆员的登记表。入职年份一栏，写着一个早于本馆成立的年份。',
    content: [
      '姓名：沈砚秋。职务：特藏整理。',
      '入职年份：民国十六年。',
      '学历、籍贯、年龄三栏，皆空白。',
      '备注：该馆员负责万和号一批账册的整理。',
      '近年仍在列，未见离退记录。人事科曾就其入职年份发文询问，未获回复。'
    ],
    refs: ['ledger', 'family-tree'],
    entities: ['shen-huai-ren'],
    hidden: true
  },
  {
    id: 'guestbook', type: '文书', title: '留言墙存档', tag: '待清理',
    img: '/img/guestbook.webp',
    summary: '网页留言墙的存档。所有留言来自同一时间、同一段话。',
    content: [
      '网页留言墙的存档，导出于系统维护前夜。',
      '“请问第五笔订单什么时候到？”',
      '“请问第五笔订单什么时候到？”',
      '“请问第五笔订单什么时候到？”',
      '……共 47 条，同一秒发出，IP 相同。',
      '留言者昵称一栏，皆为空白。'
    ],
    refs: ['ledger', 'order-stub'],
    entities: ['wanhe'],
    hidden: true
  },
  {
    id: 'fortuneslip', type: '文书', title: '财签 · 0512', tag: '取签记录',
    img: '/img/shouni.webp',
    summary: '一张 1927 年的财签。六格指印位，按了五格。',
    content: [
      '财签一张，编号 0512，与族谱同批入藏。',
      '签文：求财者众，补位者寡。',
      '六格指印位，按了五格，第六格空着。',
      '签纸日期：民国十六年正月初五。',
      '签筒内另有一签，编号相同，签文空白。'
    ],
    refs: ['photo-three', 'shouni', 'recording'],
    entities: ['five-children', 'wanhe'],
    hidden: true
  },
  {
    id: 'ledger-errata', type: '文书', title: '著录勘误 · 存疑', tag: '未采纳',
    img: '/img/ledger-errata.webp',
    summary: '一份未被采纳的勘误。它说第五页的五个零，原本是五个名字。',
    content: [
      '勘误一件，纸短，字迹细硬，与流水簿第五页后补之笔同出一手。',
      '勘误：旧账第五页“0.00”系后人涂改。原件应为五个人名，墨迹尚存。',
      '处理意见：不予采纳。原件已按现貌著录。',
      '经办：沈砚秋。'
    ],
    refs: ['zero-page', 'corrections', 'staff-shen', 'fenyu'],
    entities: ['wanhe', 'shen-huai-ren'],
    hidden: true
  },
  {
    id: 'fenyu', type: '文书', title: '焚余', tag: '残页 · 未编号',
    img: '/img/fenyu.webp',
    summary: '一页烧剩半张的登记。它记的不是账，是“如何把账烧干净”。',
    content: [
      '此页边角焦黑，余下不足一半。纸背透出上一页的字，已不可辨。',
      '残存文字：焚账非火，乃“回执”。回执不全，火点不着。',
      '回执者，四样：死者之名、死者之药、死者之签、待收之信。',
      '四样既齐，于封卷之时，方可焚。',
      '末行小字：焚了，他就再也回不去。您也一样。'
    ],
    refs: ['ledger-errata', 'obituary', 'yaozha', 'fortuneslip', 'guestbook', 'finale-ledger'],
    entities: ['wanhe', 'shen-huai-ren'],
    hidden: true
  },
  {
    id: 'yaozha', type: '底档', title: '药渣 · 检验', tag: '后院五处',
    img: '/img/yaozha.webp',
    summary: '五处药渣的检验记录。五味药，各对一味，分量都重。',
    content: [
      '后院五处，各采药渣一份，送检。',
      '东厢：毒蕈。南房：炭烬。西厢：水银。北房：关木通。中堂：砒霜。',
      '五味皆在常用药方之内，单用无害，量大则伤。',
      '检验单注明：五处药渣，煎法一致，火候一致，像是同一双手所为。',
      '送检人不明。检验科批注：本案未见报案记录。'
    ],
    refs: ['zhaiyuan', 'obituary', 'koushu'],
    entities: ['five-children', 'wanhe'],
    hidden: true
  }
]

export default FRAGMENTS

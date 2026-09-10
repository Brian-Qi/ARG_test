<template>
  <article class="folk-archive" v-if="item">
    <nav class="folk-crumb" aria-label="面包屑">
      <RouterLink to="/">首页</RouterLink>
      <span class="crumb-sep">›</span>
      <RouterLink to="/search" :query="{ q: item.category }">{{ item.category }}</RouterLink>
      <span class="crumb-sep">›</span>
      <span aria-current="page">{{ item.title }}</span>
    </nav>

    <header class="folk-head">
      <div class="folk-tags">
        <span class="pill">{{ item.type }}</span>
        <span class="pill">{{ item.category }}</span>
        <span class="pill">{{ item.id }}</span>
        <span class="pill muted">{{ item.progress }}</span>
      </div>
      <h1>{{ item.title }}</h1>
      <p class="folk-intro">{{ item.intro }}</p>
    </header>

    <section class="folk-body">
      <figure v-for="img in item.images" :key="img.key" class="folk-figure">
        <div class="gold-ratio">
          <img v-if="img.src" class="folk-img" :src="img.src" :alt="img.caption" loading="lazy" />
          <div v-else class="img-placeholder" role="img" :aria-label="'图片占位：' + img.caption">
            <span class="ph-glyph">图</span>
            <span class="ph-text">{{ img.caption }}</span>
          </div>
        </div>
        <figcaption>{{ img.caption }}</figcaption>
      </figure>

      <section v-for="(sec, j) in item.sections" :key="j" class="folk-sec">
        <h2>{{ sec.heading }}</h2>
        <p>{{ sec.text }}</p>
      </section>

      <div v-if="item.linkedTo" class="folk-linked">
        <RouterLink class="btn-flat" :to="item.linkedTo">{{ item.linkLabel }}</RouterLink>
      </div>
    </section>

    <footer class="folk-foot">
      <RouterLink class="back-link" :to="item.from">← 返回{{ item.category }}</RouterLink>
      <p v-if="id.startsWith('CW-')" class="folk-disclaimer">馆藏备注：本条目为历史文献整理，仅供参考。</p>
    </footer>
  </article>

  <div v-else class="archive-panel">
    <h2>未找到该档案</h2>
    <p>您访问的档案条目不存在。</p>
    <RouterLink class="back-link" to="/">返回首页</RouterLink>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = computed(() => route.params.id)

const ARCHIVES = [
  /* ============ 数字化专题 · 档案资源整理 ============ */
  {
    id: 'CW-0001',
    title: '近代商号账簿数字化（第一批）',
    category: '数字化专题',
    type: '专题项目',
    progress: '持续更新',
    intro: '将民国时期民间商号流水账册进行整理、扫描与全文著录的专题项目，首批共 7 册 1200 余页。',
    sections: [
      { heading: '项目缘起', text: '民间商号账簿保存了物价、计量、商俗与日常信用的第一手记录，但因纸墨脆弱、字体潦草，长期"有而不见"。本专题自 2023 年起征集并数字化整理。' },
      { heading: '整理流程', text: '按征集登记、除尘修复、逐页扫描、文字著录、双人复核、分级公开的流程推进，著录馆藏号、年代、店号、经营内容、页数等字段。' }
    ],
    images: [
      { key: 'folk-01', src: '/img/folk-01.png', caption: '近代商号账簿书影' },
      { key: 'folk-02', src: '/img/folk-02.png', caption: '账册逐页扫描场景' }
    ],
    linkedTo: '/digital-project',
    linkLabel: '查看项目详情',
    from: '/'
  },
  {
    id: 'CW-0002',
    title: '财神信俗文献辑录',
    category: '数字化专题',
    type: '文献辑录',
    progress: '持续更新',
    intro: '本辑录汇集散见于地方志、笔记、碑刻与口述史中的财神信俗材料，依主题编次，供民俗研究与公众查阅。',
    sections: [
      { heading: '辑录范围', text: '材料覆盖财神信仰的起源传说、祭祀仪轨、祀神祝文，以及历代笔记小说所记的求财轶事。为便于比对，各条均标注出处与年代。' },
      { heading: '整理原则', text: '按"信俗类型—地域—年代"三级分类著录，对存在异说的材料采取并列存目、注明歧异的方式，保留原始面貌。' }
    ],
    images: [
      { key: 'folk-03', src: '/img/folk-03.png', caption: '财神信俗文献书影' },
      { key: 'folk-04', src: '/img/folk-04.png', caption: '旧刻财神经册内页' }
    ],
    from: '/'
  },
  {
    id: 'CW-0003',
    title: '财神年画图档整理',
    category: '数字化专题',
    type: '图档整理',
    progress: '持续更新',
    intro: '对旧历年画中的财神题材进行分类著录，附见各类吉祥符号的寓意解读。',
    sections: [
      { heading: '题材分类', text: '图档按文财神、武财神、五路财神、刘海戏蟾等题材分目，著录画面构图、款识、印版与绘制年代。' },
      { heading: '吉祥符号', text: '画面中的元宝、聚宝盆、如意、连钱等符号逐一考源，说明其在民间表达中"招财纳福"的象征意义。' }
    ],
    images: [
      { key: 'folk-05', src: '/img/folk-05.png', caption: '五路财神年画横幅' },
      { key: 'folk-06', src: '/img/folk-06.png', caption: '财神年画版印拓本' }
    ],
    from: '/'
  },
  {
    id: 'CW-0004',
    title: '民间商号文书著录',
    category: '数字化专题',
    type: '文书著录',
    progress: '持续更新',
    intro: '著录民间商号的经营账簿、契约与票单据，为商俗与经济史研究提供原始材料。',
    sections: [
      { heading: '材料构成', text: '含流水账、零售底账、借贷契约、栈单、纸币样张等，反映旧时商铺的日常经营与信用网络。' },
      { heading: '著录方法', text: '逐页著录日期、摘要、金额与经手人，对残缺处按规范标注，兼顾版式与笔迹信息的保留。' }
    ],
    images: [
      { key: 'folk-07', src: '/img/folk-07.png', caption: '民国商号流水账页' },
      { key: 'folk-08', src: '/img/folk-08.png', caption: '旧商铺契约单据' }
    ],
    from: '/'
  },
  {
    id: 'CW-0005',
    title: '财神祭祀祝文辑录',
    category: '数字化专题',
    type: '祝文辑录',
    progress: '持续更新',
    intro: '收录岁首迎财、商铺开市等场合所用的祭祀祝文与祈财疏文，可窥民间仪式语汇。',
    sections: [
      { heading: '仪式语汇', text: '祝文多采用骈俪句式，称颂财神、述说行善积德，并祈愿生意兴隆、五路通财。' },
      { heading: '应用场合', text: '按年节开市、乔迁、祭祀等场合分列，附注仪式中的赞礼、上香与化疏等环节说明。' }
    ],
    images: [
      { key: 'folk-09', src: '/img/folk-09.png', caption: '祭财神祝文抄本' },
      { key: 'folk-10', src: '/img/folk-10.png', caption: '商铺开市化疏仪式' }
    ],
    from: '/'
  },
  {
    id: 'CW-0006',
    title: '民俗碑记拓片整理',
    category: '数字化专题',
    type: '拓片整理',
    progress: '持续更新',
    intro: '整理记录地方慈善、行会与祭祀碑文的拓片，兼及碑刻书风与款识的著录说明。',
    sections: [
      { heading: '碑刻类型', text: '收录施米施粥、兴修义学、商帮行规等碑记，展现民间互助与经济伦理的记载。' },
      { heading: '著录说明', text: '对碑额、碑阴、款识与拓本年代逐项著录，辨析漫漶文字，附碑文重录与存疑标记。' }
    ],
    images: [
      { key: 'folk-11', src: '/img/folk-11.png', caption: '施粥义举碑记拓片' },
      { key: 'folk-12', src: '/img/folk-12.png', caption: '行会公所碑文拓片' }
    ],
    from: '/'
  },
  {
    id: 'CW-0007',
    title: '民间求财旧俗考释',
    category: '数字化专题',
    type: '旧俗考释',
    progress: '持续更新',
    intro: '考释开市点灯、破五迎财、供三牲等民间求财旧俗的仪式做法与背后寓意。',
    sections: [
      { heading: '仪式流程', text: '由年关敬神、破五开市到常年拜财，梳理各节令求财活动的时间节点与供奉内容。' },
      { heading: '古俗寓意', text: '解读点灯为"照亮财路"、供三牲为"酬谢神佑"等象征，说明民间渴望丰盈的朴素心理。' }
    ],
    images: [
      { key: 'folk-13', src: '/img/folk-13.png', caption: '破五开市敬神供桌' },
      { key: 'folk-14', src: '/img/folk-14.png', caption: '商铺点灯迎财场景' }
    ],
    from: '/'
  },
  {
    id: 'CW-0008',
    title: '财神谱系田野调查',
    category: '数字化专题',
    type: '田野调查',
    progress: '持续更新',
    intro: '通过田野访谈梳理民间财神谱系的区域性差异，兼及仪式性拜财行为的当代形态。',
    sections: [
      { heading: '跨地比照', text: '对不同地区供奉的财神名号、形象与职司进行比较，观察同一神祇在各地的职能分化。' },
      { heading: '当代形态', text: '记录庙会、商铺供奉与新式求财习俗，探讨传统信俗在现代社会中的延续与变易。' }
    ],
    images: [
      { key: 'folk-15', src: '/img/folk-15.png', caption: '田野访谈财神神龛' },
      { key: 'folk-16', src: '/img/folk-16.png', caption: '庙会祈财场面旧照' }
    ],
    from: '/'
  },

  /* ============ 近期上线 · 知识研究成果 ============ */
  {
    id: 'CW-0009',
    title: '万和号商号流水账',
    category: '近期上线',
    type: '档案 · 全文公开',
    progress: '全文公开',
    intro: '民国十六年至二十一年间杭州城南绸布南北货商号账册，日记流水体，毛笔书写，共 86 页。',
    sections: [
      { heading: '馆藏概况', text: '馆藏号 HZ-1927-0512，涵盖各月小计与年终汇算，是研究近代商号日常经营与信用往来的史料。' },
      { heading: '著录说明', text: '该账册纸张脆化、部分页角缺损，著录时对缺损处以"□"标示；个别影像页与著录页码存在错位，以纸质原件为准。' }
    ],
    images: [
      { key: 'folk-17', src: '/img/folk-17.png', caption: '万和号流水账首页' },
      { key: 'folk-18', src: '/img/folk-18.png', caption: '账页著录文字样张' }
    ],
    linkedTo: '/collection/HZ-1927-0512',
    linkLabel: '查看完整馆藏',
    from: '/'
  },
  {
    id: 'CW-0010',
    title: '五路财神的来源与流变',
    category: '近期上线',
    type: '民俗考源',
    progress: '新辑',
    intro: '梳理"五路财神"由五方之神到财神谱系的演化脉络，兼及"路路通财"的心理祈愿。',
    sections: [
      { heading: '五方到五路', text: '古人以五方配五色，民间将四方与中央并指为"路"，遂有"五路通财"之说，汇聚四方财源。' },
      { heading: '财神化进程', text: '由五路之"神"逐步演进为具体的历史人物财神，反映民间信仰由泛神向人神复合的转向。' }
    ],
    images: [
      { key: 'folk-19', src: '/img/folk-19.png', caption: '五路财神组合神像' },
      { key: 'folk-20', src: '/img/folk-20.png', caption: '五路通财年画' }
    ],
    from: '/'
  },
  {
    id: 'CW-0011',
    title: '赵公明：从瘟神到财神的演变',
    category: '近期上线',
    type: '信仰演变',
    progress: '新辑',
    intro: '考述赵公明自汉魏厉鬼、魏晋瘟神，至明清定型为"金龙如意正一龙虎玄坛真君"财神的演变。',
    sections: [
      { heading: '神格变迁', text: '赵公明最初以厉鬼、瘟神形象出现，历魏晋之瘟神、元代之形象分裂，至明清转为司财之神。' },
      { heading: '定型之后', text: '封号"金龙如意正一龙虎玄坛真君"，黑面浓须、骑黑虎、持银鞭与元宝，兼掌驱雷除瘟与管领财运。' }
    ],
    images: [
      { key: 'folk-21', src: '/img/folk-21.png', caption: '赵公明骑虎形象' },
      { key: 'folk-22', src: '/img/folk-22.png', caption: '玄坛真君神签' }
    ],
    from: '/'
  },
  {
    id: 'CW-0012',
    title: '武财神关羽的忠义财道',
    category: '近期上线',
    type: '人物考源',
    progress: '新辑',
    intro: '关羽因"挂印封金""一介不取"的忠信义举，被商贾奉为以信义立业之武财神。',
    sections: [
      { heading: '忠义成神', text: '关羽忠勇信义、不为财帛所动，商界取其诚信立业之义，尊为武财神，谓"财自义中取"。' },
      { heading: '三教共尊', text: '关羽一身兼为佛之护法、道之圣君、儒之文衡，在跨信仰背景下更添"义中求财"的普适性。' }
    ],
    images: [
      { key: 'folk-23', src: '/img/folk-23.png', caption: '关公读春秋立像' },
      { key: 'folk-24', src: '/img/folk-24.png', caption: '武财神关公神像' }
    ],
    from: '/'
  },
  {
    id: 'CW-0013',
    title: '文财神比干的无私之德',
    category: '近期上线',
    type: '人物考源',
    progress: '新辑',
    intro: '比干因无心而无偏私，被奉为公正无私的文财神，体现"无私方能聚财"的民间财富伦理。',
    sections: [
      { heading: '无心故无私', text: '比干身为忠臣，被剖心而死，民间取其"无心"以喻"无私"，遂主掌公正，司人间财利。' },
      { heading: '文财神之德', text: '文财神多以文官形象出现，寓意以德行财、以公持家，构成民间"取之有道"的人格化身。' }
    ],
    images: [
      { key: 'folk-25', src: '/img/folk-25.png', caption: '文财神比干画像' },
      { key: 'folk-26', src: '/img/folk-26.png', caption: '公正无私文财神' }
    ],
    from: '/'
  },
  {
    id: 'CW-0014',
    title: '小五路财神与招宝纳珍考辨',
    category: '近期上线',
    type: '谱系考辨',
    progress: '新辑',
    intro: '考辨赵公明麾下招宝天尊、纳珍天尊、招财使者、利市仙官"小五路"的构成与职司。',
    sections: [
      { heading: '小五路构成', text: '以赵公明为中路，配招宝天尊萧升、纳珍天尊曹宝、招财使者陈九公、利市仙官姚少司，合称小五路。' },
      { heading: '职司分化', text: '招宝、纳珍、招财、利市四司分别掌宝货、财珍、财运与市利，体现民间对财源精细化的祈愿。' }
    ],
    images: [
      { key: 'folk-27', src: '/img/folk-27.png', caption: '小五路财神方位图' },
      { key: 'folk-28', src: '/img/folk-28.png', caption: '利市仙官神像' }
    ],
    from: '/'
  },
  {
    id: 'CW-0015',
    title: '「君子爱财，取之有道」考释',
    category: '近期上线',
    type: '思想考释',
    progress: '新辑',
    intro: '由《论语》富与贵之辩出发，考释"取之有道""为富且仁"在民间财神信俗中的渗透。',
    sections: [
      { heading: '义利之辨', text: '孔子不排斥财富，但强调"不以其道得之，不处也"。君子爱财，当以道义为限，见利思义。' },
      { heading: '民间化表达', text: '财神信俗将"取之有道"具象化，劝人诚信经营、以德聚财，遂使儒家伦理融入民间求财心理。' }
    ],
    images: [
      { key: 'folk-29', src: '/img/folk-29.png', caption: '《论语》富与贵书页' },
      { key: 'folk-30', src: '/img/folk-30.png', caption: '诚信经营商训匾额' }
    ],
    from: '/'
  },
  {
    id: 'CW-0016',
    title: '「以德聚财，以财济世」理念溯源',
    category: '近期上线',
    type: '思想考释',
    progress: '新辑',
    intro: '探讨财神信俗精髓"以德聚财、以财济世"，如何体现民间光明磊落的财富观。',
    sections: [
      { heading: '以德聚财', text: '财富之得来，须以德行相配，行善积德方能厚德载物，此乃民间"德财相济"的基本观念。' },
      { heading: '以财济世', text: '致富之后当回报乡里、兴学济贫，使财富发挥最大社会价值，是为"仁者以财发身"。' }
    ],
    images: [
      { key: 'folk-31', src: '/img/folk-31.png', caption: '商号捐资义举碑记' },
      { key: 'folk-32', src: '/img/folk-32.png', caption: '富而好礼商人家训' }
    ],
    from: '/'
  }
]

const item = computed(() => ARCHIVES.find((a) => a.id === id.value))

watch(item, (val) => {
  if (val) document.title = `${val.title} - 杭州民俗数字档案馆`
}, { immediate: true })
</script>

<style scoped>
.folk-archive {
  max-width: 760px;
  margin: 0 auto;
  padding: 28px 22px 64px;
}
.folk-crumb {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 13px;
  color: #6d5d42;
  margin-bottom: 22px;
}
.folk-crumb a {
  color: #8c2f24;
  text-decoration: none;
}
.folk-crumb a:hover {
  text-decoration: underline;
}
.crumb-sep {
  color: #a4967a;
}
.folk-head {
  border-bottom: 1px solid #d8c9a8;
  padding-bottom: 18px;
  margin-bottom: 26px;
}
.folk-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}
.folk-head h1 {
  font-family: "Noto Serif SC", "Songti SC", serif;
  font-weight: 600;
  font-size: 30px;
  line-height: 1.4;
  letter-spacing: 2px;
  color: #3c3020;
  margin: 0 0 12px;
  text-shadow: none;
}
.folk-intro {
  color: #6d5f45;
  font-size: 16px;
  line-height: 2;
  margin: 0;
}
.folk-body {
  font-size: 16px;
  color: #4a3d29;
  line-height: 2;
}
.folk-body h2 {
  font-family: "Noto Serif SC", "Songti SC", serif;
  font-weight: 600;
  font-size: 20px;
  color: #3c3020;
  letter-spacing: 1px;
  margin: 30px 0 10px;
}
.folk-body p {
  margin: 0 0 16px;
}
.folk-linked {
  margin-top: 26px;
}
.folk-figure {
  margin: 26px 0;
}
.folk-figure figcaption {
  text-align: center;
  font-size: 13px;
  color: #6d5f45;
  margin-top: 10px;
}
.gold-ratio {
  border: 1px solid #e0d2b4;
  background: #f3e9d2;
  overflow: hidden;
}
.folk-img {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  filter: sepia(0.18) contrast(0.96);
}
.img-placeholder {
  aspect-ratio: 3 / 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #a4967a;
}
.ph-glyph {
  font-family: "Ma Shan Zheng", "KaiTi", serif;
  font-size: 46px;
  opacity: 0.5;
  line-height: 1;
}
.ph-text {
  font-size: 13px;
  letter-spacing: 1px;
}
.folk-foot {
  margin-top: 40px;
  border-top: 1px solid #d8c9a8;
  padding-top: 18px;
}
.folk-disclaimer {
  margin: 14px 0 0;
  font-size: 11px;
  color: #9a8a6f;
  letter-spacing: 0.5px;
}
</style>

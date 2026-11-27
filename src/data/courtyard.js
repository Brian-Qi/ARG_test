// 四合院 · 五方五子（「安位」谜题数据）
// 五方对应五行/五脏/六根/财神；五子各殁于一方，死法取象于该方五行。
export const PLACES = [
  { id: 'north', name: '北房', wuxing: '水', organ: '肾', god: '赵公明', trace: '药罐渣里有木通' },
  { id: 'west', name: '西厢', wuxing: '金', organ: '肺', god: '关公', trace: '铜器上有汞痕' },
  { id: 'center', name: '中堂', wuxing: '土', organ: '脾', god: '王亥', trace: '地缝里一点白粉末' },
  { id: 'east', name: '东厢', wuxing: '木', organ: '肝', god: '比干', trace: '窗台上晒着几朵野蕈' },
  { id: 'south', name: '南房', wuxing: '火', organ: '心', god: '柴荣', trace: '角落一只炭盆，炭未燃尽' }
]

// 病亡录：只给「先天缺陷 + 症状」，不给方位；方位靠玩家推（六根→脏→五行→方位）
// child 用收养次序（与《讣告·五童》一致），**不得**带方位，否则谜题自答
// clueId = 记着这个孩子口语称呼的那条碎片；西厢没有口头记录，只能取自 A 面族谱
export const DEATHS = [
  { id: 'd1', name: '沈荣', child: '养子一', defect: '先天目疾', symptom: '目黄、身黄', place: 'east', clueId: 'yaopu-zhang' },
  { id: 'd2', name: '沈明', child: '养子二', defect: '先天耳疾', symptom: '心悸、猝倒', place: 'south', clueId: 'tanpu-dan' },
  { id: 'd3', name: '沈晚', child: '养子三', defect: '先天鼻疾', symptom: '干咳、咯血', place: 'west', clueId: null },
  { id: 'd4', name: '沈海', child: '养子四', defect: '先天舌疾', symptom: '舌溃、水肿', place: 'north', clueId: 'zhuayao-bu' },
  { id: 'd5', name: '沈根', child: '养子五', defect: '先天体弱', symptom: '吐泻、虚脱', place: 'center', clueId: 'zaofang' }
]

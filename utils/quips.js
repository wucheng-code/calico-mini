// utils/quips.js
// 猫的台词库。不联网、不调模型，纯本地随机取。
//
// 为什么要自己写台词库，而不是接大模型：
//   1. AI 问答属于「深度合成」类目，个人主体申请不到，硬做会被代码审核驳回
//   2. 台词可枚举、可逐条过审，不会突然冒出一句医疗建议或人身攻击
//   3. 零延迟、零调用成本
//
// 合规底线（写新台词时必须守）：
//   · 可以毒舌、可以冷淡，但不能身材羞辱
//   · 不能暗示疾病、不能承诺效果
//   · 不能出现「减脂」「瘦身」这类会被判定为医疗健康建议的词

const QUIPS = {
  // 这一顿热量偏高
  heavy: [
    '这一顿，够我跑三趟猫砂盆了。',
    '数字我记下了，你心里也清楚。',
    '好吃是好吃，账是要还的。',
    '我不评判，我只记账。',
    '嘴是你的，热量也是你的。',
    '这顿有点超，下一顿收着点。',
    '行吧，今天的水果免了。',
    '我数了，你没数。'
  ],

  // 正常一餐
  normal: [
    '还行，中规中矩。',
    '这顿没问题，继续。',
    '记下了，别停。',
    '正常发挥，猫满意。',
    '这个量，勉强合格。',
    '不算多，也不算少。'
  ],

  // 这一顿很轻
  light: [
    '这么点？你是给猫留的？',
    '吃这么少，别硬撑。',
    '清淡是好事，但别过头。',
    '这顿够轻，下一顿正常吃。',
    '饿着不是办法，记住了。',
    '我记了，你也吃点。'
  ],

  // 夜里记的
  late: [
    '几点了还吃？',
    '夜里这一口，明天见分晓。',
    '我睡了，账我记着。',
    '夜宵可以，代价自己担。',
    '这个点吃，我劝不动你。',
    '吃完刷牙，别问我为什么。'
  ]
}

// 按场景随机取一条
function pickQuip(scene) {
  const list = QUIPS[scene] || QUIPS.normal
  const i = Math.floor(Math.random() * list.length)
  return list[i]
}

// 判断场景：深夜 > 分量 > 清淡
function pickScene(calories, hour) {
  if (hour >= 21 || hour < 5) return 'late'
  if (calories >= 600) return 'heavy'
  if (calories <= 200) return 'light'
  return 'normal'
}

// ── 首页的每日一句 ──────────────────────────────
// 不用随机，按"今天是今年的第几天"取模。
// 好处：同一天打开多少次都是同一句，不会来回跳。
const HOME_QUIPS = {
  empty: ['今天还没开张，记一笔吧。', '空着。我等着。'],
  low: ['才这么点，别饿着。', '这么少，你是给猫留的？'],
  mid: ['节奏还行，稳住。', '正常发挥，猫满意。'],
  near: ['快到线了，晚饭收着点。', '还剩一点，你自己算。'],
  over: ['超了。明天见。', '今天这一笔，我记下了。']
}

function pickHomeQuip(total, target) {
  let list = HOME_QUIPS.mid

  if (!total) {
    list = HOME_QUIPS.empty
  } else {
    const p = total / target
    if (p > 1) list = HOME_QUIPS.over
    else if (p >= 0.7) list = HOME_QUIPS.near
    else if (p < 0.3) list = HOME_QUIPS.low
  }

  const now = new Date()
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)

  return list[dayOfYear % list.length]
}

module.exports = { pickQuip, pickScene, pickHomeQuip }

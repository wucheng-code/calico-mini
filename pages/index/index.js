// pages/index/index.js
// 首页：今日汇总。从 records 里查今天的记录，算出总热量、三大营养素、按餐分组。

const MEAL_LABELS = { 1: '早餐', 2: '午餐', 3: '晚餐', 4: '加餐' }
const TARGET_CALORIE = 1800   // TODO: W5 改成从 users 表读用户自己的目标

function todayStr() {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

Page({
  data: {
    loading: true,
    errMsg: '',
    date: '',
    total: 0,
    target: TARGET_CALORIE,
    percent: 0,
    protein: 0,
    fat: 0,
    carb: 0,
    sections: [],
    isEmpty: true,
    isDev: false
  },

  onLoad() {
    const info = wx.getAccountInfoSync ? wx.getAccountInfoSync() : null
    const envVersion = (info && info.miniProgram && info.miniProgram.envVersion) || 'develop'
    this.setData({ isDev: envVersion !== 'release' })
  },

  // 用 onShow 而不是 onLoad：从记录页返回时会重新触发，数据能自动刷新
  onShow() {
    this.loadToday()
  },

  loadToday() {
    const date = todayStr()
    this.setData({ date })

    const db = wx.cloud.database()
    db.collection('records')
      .where({ date })
      .get()
      .then(res => this.render(res.data))
      .catch(err => {
        console.error('[index] 读取今日记录失败', err)
        this.setData({
          loading: false,
          errMsg: (err && err.errMsg) || '读取失败'
        })
      })
  },

  // 把记录列表算成页面要显示的数据
  render(raw) {
    // 按创建时间排一下序，避免顺序乱
    const list = raw.slice().sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return ta - tb
    })

    const total = list.reduce((sum, r) => sum + (r.calorie || 0), 0)
    const protein = list.reduce((sum, r) => sum + (r.protein || 0), 0)
    const fat = list.reduce((sum, r) => sum + (r.fat || 0), 0)
    const carb = list.reduce((sum, r) => sum + (r.carb || 0), 0)

    // 按餐次分组
    const groups = { 1: [], 2: [], 3: [], 4: [] }
    list.forEach(r => {
      const t = groups[r.mealType] ? r.mealType : 1
      groups[t].push(r)
    })

    // 只保留有内容的餐次，并算出每餐小计
    const sections = [1, 2, 3, 4]
      .map(t => ({
        type: t,
        label: MEAL_LABELS[t],
        items: groups[t],
        subtotal: groups[t].reduce((sum, r) => sum + (r.calorie || 0), 0)
      }))
      .filter(s => s.items.length > 0)

    this.setData({
      loading: false,
      errMsg: '',
      total,
      protein: this.round(protein),
      fat: this.round(fat),
      carb: this.round(carb),
      sections,
      isEmpty: list.length === 0,
      percent: Math.min(100, Math.round(total / this.data.target * 100))
    })
  },

  goSearch() {
    wx.navigateTo({ url: '/pages/search/search' })
  },

  goDebug() {
    wx.navigateTo({ url: '/pages/debug/debug' })
  },

  round(n) {
    return Math.round(n * 10) / 10
  }
})

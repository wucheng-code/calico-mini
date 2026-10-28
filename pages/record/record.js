// pages/record/record.js
// 记录页：从搜索页带过来 foodId / name / cal / protein / fat / carb，
// 用户填克数，算出这一份的热量与三大营养素，存进 records。

// 参数里的中文是编码过的，解码失败时兜底返回原文
function safeDecode(s) {
  try {
    return decodeURIComponent(s || '')
  } catch (e) {
    return s || ''
  }
}

Page({
  data: {
    foodId: '',
    name: '',
    calPer100g: 0,
    proteinPer100g: 0,
    fatPer100g: 0,
    carbPer100g: 0,
    grams: 100,        // 默认 100 克
    calories: 0,       // 当前这份的热量
    mealType: 1,       // 1 早 2 午 3 晚 4 加餐
    meals: [
      { value: 1, label: '早餐' },
      { value: 2, label: '午餐' },
      { value: 3, label: '晚餐' },
      { value: 4, label: '加餐' }
    ],
    saving: false
  },

  // options 就是上一个页面 url 里 ? 后面的参数
  // 直接编译本页时可能没有参数，所以兜一个空对象，避免白屏
  onLoad(options) {
    const opt = options || {}
    const calPer100g = Number(opt.cal) || 0

    this.setData({
      foodId: opt.foodId || '',
      name: safeDecode(opt.name) || '未选择食物',
      calPer100g,
      proteinPer100g: Number(opt.protein) || 0,
      fatPer100g: Number(opt.fat) || 0,
      carbPer100g: Number(opt.carb) || 0,
      grams: 100,
      calories: Math.round(100 / 100 * calPer100g)   // 默认 100g 的热量
    })
  },

  // 输入克数：每次输入都重新算一遍热量
  onGramsInput(e) {
    const grams = Number(e.detail.value) || 0
    const calories = Math.round(grams / 100 * this.data.calPer100g)
    this.setData({ grams, calories })
  },

  // 切换餐次
  onMeal(e) {
    this.setData({ mealType: Number(e.currentTarget.dataset.value) })
  },

  // 存进数据库
  save() {
    const { foodId, name, grams, calories, mealType, saving } = this.data

    if (saving) return

    if (!foodId) {
      wx.showModal({
        title: '没有选食物',
        content: '请从搜索页点一条食物进来',
        showCancel: false
      })
      return
    }

    if (!grams || grams <= 0) {
      wx.showToast({ title: '请输入克数', icon: 'none' })
      return
    }

    this.setData({ saving: true })

    const ratio = grams / 100
    const db = wx.cloud.database()

    db.collection('records').add({
      data: {
        date: this.today(),
        mealType,
        foodId,
        foodName: name,
        grams,
        // 以下四项都是"快照"：把当时的数值固化下来，食物库以后改了也不影响历史
        calorie: calories,
        protein: this.round(ratio * this.data.proteinPer100g),
        fat: this.round(ratio * this.data.fatPer100g),
        carb: this.round(ratio * this.data.carbPer100g),
        createdAt: db.serverDate()
      }
    }).then(() => {
      wx.showToast({ title: '已记录', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 800)
    }).catch(err => {
      console.error('[record] 保存失败', err)
      this.setData({ saving: false })
      wx.showModal({
        title: '保存失败',
        content: (err && err.errMsg) || '请检查 records 集合是否已创建、权限是否为「仅创建者可读写」',
        showCancel: false
      })
    })
  },

  // 保留一位小数
  round(n) {
    return Math.round(n * 10) / 10
  },

  // 生成 YYYY-MM-DD
  today() {
    const d = new Date()
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }
})

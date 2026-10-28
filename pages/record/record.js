// pages/record/record.js
// 记录页：从搜索页带过来 foodId / name / cal，用户填克数，算出热量，存进 records。

// 万一参数里没有中文编码，decodeURIComponent 会抛错，包一层
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
  onLoad(options) {
    const calPer100g = Number(options.cal) || 0

    this.setData({
      foodId: options.foodId || '',
      name: safeDecode(options.name),
      calPer100g,
      grams: 100,
      calories: Math.round(100 / 100 * calPer100g)   // 默认 100g 的热量
    })
  },

  // 输入克数：每次输入都重新算一遍
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

    if (!grams || grams <= 0) {
      wx.showToast({ title: '请输入克数', icon: 'none' })
      return
    }

    this.setData({ saving: true })

    const db = wx.cloud.database()
    db.collection('records').add({
      data: {
        date: this.today(),
        mealType,
        foodId,
        foodName: name,
        grams,
        calorie: calories,          // 关键：存热量快照，不是只存 foodId
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

  // 生成 YYYY-MM-DD
  today() {
    const d = new Date()
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }
})

// pages/index/index.js
const seedFoods = require('../../data/foods.js')

Page({
  data: {
    foods: [],
    loading: true,
    errMsg: '',
    seeding: false,
    isDev: false
  },

  onLoad() {
    const info = wx.getAccountInfoSync ? wx.getAccountInfoSync() : null
    const envVersion = (info && info.miniProgram && info.miniProgram.envVersion) || 'develop'
    this.setData({ isDev: envVersion !== 'release' })

    this.loadFoods()
  },

  goSearch() {
    wx.navigateTo({ url: '/pages/search/search' })
  },

  goDebug() {
    wx.navigateTo({ url: '/pages/debug/debug' })
  },

  loadFoods() {
    const db = wx.cloud.database()

    db.collection('foods').limit(20).get()
      .then(res => {
        console.log('[foods] 读到', res.data.length, '条')
        this.setData({ foods: res.data, loading: false, errMsg: '' })
      })
      .catch(err => {
        console.error('[foods] 读取失败', err)
        this.setData({
          loading: false,
          errMsg: (err && err.errMsg) || '未知错误'
        })
      })
  },

  // 一次性把 60 条食物写进数据库。
  // 前提：foods 集合权限需临时设为「所有用户可读写」，导完立刻改回「所有用户可读」。
  async seedAll() {
    if (this.data.seeding) return
    this.setData({ seeding: true })
    wx.showLoading({ title: '写入中 0/60', mask: true })

    const db = wx.cloud.database()
    const col = db.collection('foods')
    let done = 0

    try {
      // 每批 10 条并发，避免一次打太多请求
      for (let i = 0; i < seedFoods.length; i += 10) {
        const batch = seedFoods.slice(i, i + 10)
        await Promise.all(batch.map(item => col.add({ data: item })))
        done += batch.length
        wx.showLoading({ title: `写入中 ${done}/60`, mask: true })
      }

      wx.hideLoading()
      wx.showToast({ title: `已写入 ${done} 条`, icon: 'none' })
      this.loadFoods()
    } catch (err) {
      wx.hideLoading()
      console.error('[seed] 失败', err)
      wx.showModal({
        title: '写入失败',
        content: (err && err.errMsg) || '请检查 foods 集合权限是否为「所有用户可读写」',
        showCancel: false
      })
    } finally {
      this.setData({ seeding: false })
    }
  }
})

// pages/review/review.js
// 保存成功后进来：猫说一句话。
// 台词来自 utils/quips.js，本地随机，不联网。

const { pickQuip, pickScene } = require('../../utils/quips.js')

Page({
  data: {
    quip: '',
    name: '',
    grams: 0,
    calories: 0
  },

  onLoad(options) {
    const opt = options || {}
    const calories = Number(opt.calories) || 0
    const hour = new Date().getHours()
    const scene = opt.scene || pickScene(calories, hour)

    this.setData({
      quip: pickQuip(scene),
      name: decodeURIComponent(opt.name || ''),
      grams: Number(opt.grams) || 0,
      calories
    })
  },

  // 回到首页，reLaunch 会清掉页面栈，顺带触发首页 onShow 刷新
  done() {
    wx.reLaunch({ url: '/pages/index/index' })
  }
})

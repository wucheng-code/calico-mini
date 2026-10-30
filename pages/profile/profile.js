// pages/profile/profile.js
// 我的：身高、体重、每日目标热量。
// 存进 users 集合（权限「仅创建者可读写」，每条记录自动带 _openid）。
//
// 目标热量不自动算，只给参考值：
//   参考 = 体重(kg) × 30，仅作起点，用户可自己改。
// 不出现「减脂 / 减重 / 建议摄入」这类表述，避免被判定为健康建议。

Page({
  data: {
    height: '',
    weight: '',
    targetCalorie: '',
    suggest: 0,
    saving: false,
    loading: true,
    hasProfile: false
  },

  onLoad() {
    this.loadProfile()
  },

  loadProfile() {
    const db = wx.cloud.database()
    db.collection('users').get()
      .then(res => {
        const u = res.data[0]
        if (u) {
          this.setData({
            height: u.height || '',
            weight: u.weight || '',
            targetCalorie: u.targetCalorie || '',
            suggest: u.weight ? u.weight * 30 : 0,
            hasProfile: true,
            loading: false
          })
        } else {
          this.setData({ loading: false })
        }
      })
      .catch(err => {
        console.error('[profile] 读取失败', err)
        this.setData({ loading: false })
      })
  },

  onHeight(e) {
    this.setData({ height: e.detail.value })
  },

  onWeight(e) {
    const weight = e.detail.value
    const suggest = Number(weight) ? Math.round(Number(weight) * 30) : 0
    this.setData({ weight, suggest })
  },

  onTarget(e) {
    this.setData({ targetCalorie: e.detail.value })
  },

  // 把参考值填进输入框
  useSuggest() {
    if (!this.data.suggest) {
      wx.showToast({ title: '先填体重', icon: 'none' })
      return
    }
    this.setData({ targetCalorie: String(this.data.suggest) })
  },

  save() {
    const { height, weight, targetCalorie, saving } = this.data

    if (saving) return

    const h = Number(height)
    const w = Number(weight)
    const t = Number(targetCalorie)

    if (!h || h < 80 || h > 250) {
      wx.showToast({ title: '身高填 80–250 之间', icon: 'none' })
      return
    }
    if (!w || w < 20 || w > 300) {
      wx.showToast({ title: '体重填 20–300 之间', icon: 'none' })
      return
    }
    if (!t || t < 800 || t > 5000) {
      wx.showToast({ title: '目标热量填 800–5000 之间', icon: 'none' })
      return
    }

    this.setData({ saving: true })

    const db = wx.cloud.database()
    const data = {
      height: h,
      weight: w,
      targetCalorie: t,
      updatedAt: db.serverDate()
    }

    db.collection('users').get().then(res => {
      const u = res.data[0]
      if (u) {
        return db.collection('users').doc(u._id).update({ data })
      }
      return db.collection('users').add({ data })
    }).then(() => {
      wx.showToast({ title: '已保存', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 700)
    }).catch(err => {
      console.error('[profile] 保存失败', err)
      this.setData({ saving: false })
      wx.showModal({
        title: '保存失败',
        content: (err && err.errMsg) || '请检查 users 集合是否已创建、权限是否为「仅创建者可读写」',
        showCancel: false
      })
    })
  }
})

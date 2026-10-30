// pages/history/history.js
// 历史：近 7 天的每日热量柱状图。
// 柱状图不用图表库，纯 CSS 高度百分比实现（主包 2MB 的限制，echarts 太占地方）。

function pad(n) {
  return String(n).padStart(2, '0')
}

function dateStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// 返回最近 7 天的日期字符串，从早到晚
function last7Days() {
  const now = new Date()
  const arr = []
  for (let i = 6; i >= 0; i--) {
    arr.push(dateStr(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)))
  }
  return arr
}

Page({
  data: {
    loading: true,
    errMsg: '',
    bars: [],
    maxTotal: 0,
    sumTotal: 0,
    avg: 0,
    hasData: false
  },

  onShow() {
    this.loadWeek()
  },

  loadWeek() {
    const dates = last7Days()
    const start = dates[0]
    const end = dates[dates.length - 1]

    const db = wx.cloud.database()
    const _ = db.command

    db.collection('records')
      .where({ date: _.gte(start).and(_.lte(end)) })
      .get()
      .then(res => this.render(dates, res.data))
      .catch(err => {
        console.error('[history] 查询失败', err)
        this.setData({
          loading: false,
          errMsg: (err && err.errMsg) || '查询失败'
        })
      })
  },

  render(dates, list) {
    // 先按日期汇总
    const map = {}
    dates.forEach(d => { map[d] = 0 })
    list.forEach(r => {
      if (map[r.date] !== undefined) {
        map[r.date] += (r.calorie || 0)
      }
    })

    const totals = dates.map(d => map[d])
    const maxTotal = Math.max.apply(null, totals.concat([1]))   // 避免除以 0
    const sumTotal = totals.reduce((a, b) => a + b, 0)

    const bars = dates.map((d, i) => {
      const total = totals[i]
      return {
        date: d,
        label: d.slice(5),                                  // 10-30
        total,
        // 有数据时按比例给高度，最少 6% 保证看得见；没数据只留一条细线
        height: total ? Math.max(6, Math.round(total / maxTotal * 100)) : 2,
        isToday: i === dates.length - 1
      }
    })

    this.setData({
      loading: false,
      errMsg: '',
      bars,
      maxTotal,
      sumTotal,
      avg: Math.round(sumTotal / 7),
      hasData: sumTotal > 0
    })
  }
})

// pages/search/search.js
Page({
  data: {
    keyword: '',
    activeCategory: '',
    categories: ['主食', '肉类', '奶蛋', '蔬菜', '水果', '饮料'],
    list: [],
    loading: false,
    errMsg: ''
  },

  // 输入事件：300ms 防抖
  onInput(e) {
    const kw = e.detail.value.trim()
    this.setData({ keyword: kw })

    clearTimeout(this._timer)
    this._timer = setTimeout(() => this.search(), 300)
  },

  onCategory(e) {
    const cat = e.currentTarget.dataset.cat
    // 再点一次同一个分类 = 取消筛选
    const next = this.data.activeCategory === cat ? '' : cat
    this.setData({ activeCategory: next })
    this.search()
  },

  search() {
    const { keyword, activeCategory } = this.data

    // 关键词和分类都为空 = 不查，直接清空列表
    if (!keyword && !activeCategory) {
      this.setData({ list: [], loading: false, errMsg: '' })
      return
    }

    this.setData({ loading: true, errMsg: '' })

    // 开发期用来数查询次数，联调完可以删掉
    console.log('[search]', keyword || '(空)', activeCategory || '(全部分类)')

    const db = wx.cloud.database()
    const _ = db.command
    const parts = []

    // 关键词：名称或分类名，都能模糊匹配
    if (keyword) {
      const reg = db.RegExp({ regexp: keyword, options: 'i' })
      parts.push(_.or([{ name: reg }, { category: reg }]))
    }

    // 分类标签：精确匹配
    if (activeCategory) {
      parts.push({ category: activeCategory })
    }

    const where = parts.length === 1 ? parts[0] : _.and(parts)

    db.collection('foods').where(where).limit(20).get()
      .then(res => {
        this.setData({ list: res.data, loading: false })
      })
      .catch(err => {
        console.error('[search] 查询失败', err)
        this.setData({
          loading: false,
          errMsg: (err && err.errMsg) || '查询失败'
        })
      })
  }
})

// pages/debug/debug.js
// 在开发者工具里跑一遍 JS 四道题，结果同时显示在页面和 Console。
// 每一行前面的【第N题】就是题号。

const out = []

Page({
  data: { lines: [] },

  onLoad() {
    this.run()
  },

  push(text) {
    out.push(text)
    console.log(text)
    this.setData({ lines: out.slice() })
  },

  hr() {
    this.push('━━━━━━━━━━━━━━━━━━━━')
  },

  run() {
    out.length = 0
    const that = this

    // 同步题先跑，异步题的输出会晚一步出现
    this.hr()
    this.push('第 2 题 · this 指向谁')
    this.hr()

    const obj = {
      name: 'a',
      say() { return this.name }
    }

    that.push('【第2题】obj.say()  →  ' + obj.say())

    const f = obj.say
    try {
      that.push('【第2题】f()        →  ' + f())
    } catch (e) {
      that.push('【第2题】f()        →  报错：' + e.message)
      that.push('【第2题】小程序是严格模式，this 是 undefined；node 普通脚本非严格，会打印 undefined')
    }

    this.hr()
    this.push('第 3 题 · map(parseInt)')
    this.hr()

    that.push('【第3题】parseInt("11", 2)  →  ' + parseInt('11', 2))
    that.push('【第3题】parseInt("3", 2)   →  ' + parseInt('3', 2))
    that.push('【第3题】[1,2,3].map(parseInt)  →  ' + String([1, 2, 3].map(parseInt)))
    that.push('【第3题】正确写法  →  ' + String([1, 2, 3].map(n => parseInt(n, 10))))
    that.push('【第3题】换个数据 [10,10,10]  →  ' + String(['10', '10', '10'].map(parseInt)))
    that.push('【第3题】原因：下标 0→进制10、1→进制1(非法)、2→进制2')

    this.hr()
    this.push('第 4 题 · 执行顺序')
    this.hr()

    that.push('【第4题】1  A（同步）')
    setTimeout(() => that.push('【第4题】4  B（setTimeout，宏任务）'))
    Promise.resolve().then(() => that.push('【第4题】3  C（Promise.then，微任务）'))
    that.push('【第4题】2  D（同步）')
    that.push('【第4题】规则：同步 → 微任务 → 宏任务')

    this.hr()
    this.push('第 1 题 · var 与 let')
    this.hr()

    for (var i = 0; i < 3; i++) {
      setTimeout(() => that.push('【第1题】var  i = ' + i))
    }
    for (let j = 0; j < 3; j++) {
      setTimeout(() => that.push('【第1题】let  j = ' + j))
    }
    this.push('【第1题】下面几行稍后出现：var 全是 3，let 是 0 1 2')

    setTimeout(() => {
      that.hr()
      that.push('答案速查')
      that.hr()
      that.push('1：var 3 3 3 ｜ let 0 1 2')
      that.push('2：obj.say() = a ｜ f() = 报错/undefined')
      that.push('3：[1, NaN, NaN]')
      that.push('4：A → D → C → B')
    }, 60)
  }
})

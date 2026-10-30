// js-第三批练习.js
// 用法：node js-第三批练习.js
// 这 10 道题用的都是你项目里真实的数据结构，不是抽象例子。
// 先自己写，答案在文件最底下。

const records = [
  { foodName: '米饭', grams: 150, calorie: 174, mealType: 2 },
  { foodName: '鸡胸肉', grams: 100, calorie: 133, mealType: 2 },
  { foodName: '鸡蛋', grams: 50, calorie: 72, mealType: 1 },
  { foodName: '全脂牛奶', grams: 250, calorie: 163, mealType: 1 },
  { foodName: '香蕉', grams: 120, calorie: 112, mealType: 4 }
]

// ── 1. 用 reduce 算出总热量，打印出来
// 预期：654


// ── 2. 用 filter + map，取出「热量 > 100」的食物名，打印成数组
// 预期：[ '米饭', '鸡胸肉', '全脂牛奶', '香蕉' ]


// ── 3. 按 mealType 分组，得到 { 1: [...], 2: [...], 4: [...] }
// 提示：先建空的 {}，再 forEach 往里 push，键不存在就初始化成 []


// ── 4. 用模板字符串打印：今天吃了 5 条记录，共 654 kcal
// 提示：反引号 `${}`，别用加号拼


// ── 5. 按 calorie 从大到小排序，打印每一条的「食物名 热量」
// 注意：sort 会改原数组，先 slice() 复制一份


// ── 6. 把 '2026-10-30' 变成 '10-30'


// ── 7. 写函数 dateStr(d)，传入 Date 对象，返回 'YYYY-MM-DD'
// 提示：padStart(2, '0')


// ── 8. 写函数 greet(name = '陌生人')，不传参数时打印「你好，陌生人」


// ── 9. 不用 Math.max，手写循环求数组最大值
// 数组用：[174, 133, 72, 163, 112]


// ── 10. 判断数组是否为空，分别打印「有数据」/「没数据」
// 用两条不同的路径各跑一次，确认都对


// ═══════════════════════════════════════════════
// 答案
// ═══════════════════════════════════════════════
//
// 1.
// const total = records.reduce((sum, r) => sum + r.calorie, 0)
// console.log(total)                       // 654
//
// 2.
// const names = records.filter(r => r.calorie > 100).map(r => r.foodName)
// console.log(names)
//
// 3.
// const groups = {}
// records.forEach(r => {
//   if (!groups[r.mealType]) groups[r.mealType] = []
//   groups[r.mealType].push(r)
// })
// console.log(groups[1].length, groups[2].length, groups[4].length)   // 2 2 1
//
// 4.
// console.log(`今天吃了 ${records.length} 条记录，共 ${total} kcal`)
//
// 5.
// const sorted = records.slice().sort((a, b) => b.calorie - a.calorie)
// sorted.forEach(r => console.log(r.foodName, r.calorie))
//
// 6.
// console.log('2026-10-30'.slice(5))        // '10-30'
//
// 7.
// function dateStr(d) {
//   const pad = n => String(n).padStart(2, '0')
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
// }
//
// 8.
// function greet(name = '陌生人') {
//   console.log(`你好，${name}`)
// }
// greet()          // 你好，陌生人
// greet('吴城')    // 你好，吴城
//
// 9.
// const nums = [174, 133, 72, 163, 112]
// let max = nums[0]
// for (let i = 1; i < nums.length; i++) {
//   if (nums[i] > max) max = nums[i]
// }
// console.log(max)        // 174
//
// 10.
// const isEmpty = arr => arr.length === 0 ? '没数据' : '有数据'
// console.log(isEmpty([]))         // 没数据
// console.log(isEmpty(records))    // 有数据

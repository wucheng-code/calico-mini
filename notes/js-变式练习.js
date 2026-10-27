// js-变式练习.js
// 用法：先自己写出答案，再往下看文件末尾的答案区。
// 每题都可以直接跑： node js-变式练习.js

// ═══════════ A 组 · 变量与作用域（对应第 1 题）═══════════

// A1  输出？
for (var i = 0; i < 3; i++) { setTimeout(() => console.log('A1:', i), i * 100) }

// A2  输出？
for (var k = 0; k < 3; k++) {
  (function (n) { setTimeout(() => console.log('A2:', n)) })(k)
}

// A3  输出？会报错吗？
function a3() {
  for (var m = 0; m < 3; m++) {}
  console.log('A3:', m)
}
a3()


// ═══════════ B 组 · this（对应第 2 题）═══════════

// B1  输出？
const b1 = { name: 'x', say() { return this.name } }
const b1f = b1.say.bind(b1)
console.log('B1:', b1f())

// B2  输出？注意 say 是箭头函数
const b2 = {
  name: 'outer',
  inner: { name: 'inner', say: () => this.name }
}
console.log('B2:', b2.inner.say())

// B3  输出？
const b3 = {
  name: 'o',
  inner: { name: 'i', say() { return this.name } }
}
console.log('B3:', b3.inner.say())


// ═══════════ C 组 · 参数传递（对应第 3 题）═══════════

// C1  输出？
console.log('C1:', String(['1', '2', '3'].map(Number)))

// C2  输出？
console.log('C2:', String(['10', '10', '10'].map(parseInt)))

// C3  输出？
console.log('C3:', String([1, 2, 3].map((n, i) => n + i)))


// ═══════════ D 组 · 执行顺序（对应第 4 题）═══════════

// D1  输出顺序？
setTimeout(() => console.log('D1: t1'))
Promise.resolve().then(() => console.log('D1: p1'))
setTimeout(() => console.log('D1: t2'))
Promise.resolve().then(() => console.log('D1: p2'))

// D2  输出顺序？
async function d2() {
  console.log('D2: a')
  await 1
  console.log('D2: b')
}
d2()
console.log('D2: c')

// D3  输出顺序？
Promise.resolve().then(() => {
  console.log('D3: m1')
  Promise.resolve().then(() => console.log('D3: m2'))
})
setTimeout(() => console.log('D3: t'))


// ═══════════════════════════════════════════════════════
// ↓↓↓
// ↓↓↓  先自己写完答案再看
// ↓↓↓
// ═══════════════════════════════════════════════════════
//
//
//
//
//
//
//
//
//
//
// ═══════════ 答案 ═══════════
//
// A1: 3 3 3
//     延迟不同不影响值，三个回调读的都是同一个 i（var）
//
// A2: 0 1 2
//     用函数把每轮的 k 包起来，n 就是当轮的值；ES5 时代没有 let 时的解法
//
// A3: 3，不报错
//     var 是函数作用域，循环结束后 m 还在，值是 3
//     换成 let m 就会报错：m is not defined
//
// B1: x
//     bind 把 this 永久绑成 b1，之后怎么调用都不会变
//
// B2: undefined
//     箭头函数没有自己的 this，它用的是"定义时外层"的 this
//     外层是模块作用域，没有 name 这个字段
//
// B3: i
//     this 看紧挨着的那个点号：b3.inner.say() 里，点号前面是 inner
//
// C1: 1,2,3
//     Number 只接收一个参数，多传的会被忽略
//
// C2: 10,NaN,2
//     下标 0 → 进制 0（当 10 进制）→ 10
//     下标 1 → 进制 1（不合法）→ NaN
//     下标 2 → 进制 2 → 2
//
// C3: 1,3,5
//     (1+0) (2+1) (3+2)
//
// D1: p1 p2 t1 t2
//     两个 Promise 都是微任务，先进先出；两个 setTimeout 是宏任务，排在后面
//
// D2: a c b
//     await 后面的代码等价于 then 里的代码，进入微任务队列
//
// D3: m1 m2 t
//     微任务里再产生微任务，仍然会先于宏任务执行（会把微任务队列清空）

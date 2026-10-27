/* eslint-disable no-loop-func */
// notes/js-practice.js
// 用法：cd D:\Calico\notes 然后 node js-practice.js
// 步骤：先把你预测的输出写在 predict 注释里，再运行。

// ── 1 ─────────────────────────────────────────────
// 第一段：var —— 用错了，输出 3 3 3
// predict:
for (var i = 0; i < 3; i++) { setTimeout(() => console.log('1-a:', i)) }

// 第二段：let —— 正确写法，输出 0 1 2
// predict:
for (let j = 0; j < 3; j++) { setTimeout(() => console.log('1-b:', j)) }

// ── 2 ─────────────────────────────────────────────
const obj = { name: 'a', say() { console.log('2:', this.name) } }
const f = obj.say
// predict:
f()

// ── 3 ─────────────────────────────────────────────
// predict:
console.log('3:', [1, 2, 3].map(parseInt))

// ── 4 ─────────────────────────────────────────────
// predict:
console.log('4-1: A')
setTimeout(() => console.log('4-2: B'))
Promise.resolve().then(() => console.log('4-3: C'))
console.log('4-4: D')

// ── 每题跑完补一句「为什么」──────────────────────
// 1:
// 2:
// 3:
// 4:

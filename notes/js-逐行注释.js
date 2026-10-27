/* eslint-disable no-loop-func */
// js-逐行注释.js
// 运行：cd D:\Calico\notes  然后  node js-逐行注释.js
//
// 每一行前面的 【第N题】 就是题号。
// 带 setTimeout / Promise 的行会"晚一点"输出，所以你会看到顺序被打乱——这本身就是要讲的东西。

// ============================================================
// 第 1 题：var 和 let 在循环里的区别
// ============================================================
// C++ 对照：for (int i = 0; i < 3; i++) { 登记一件事，等会儿打印 i }
// 区别只有一个：这里用的是 var，然后就出问题了。

for (var i = 0; i < 3; i++) {
  // setTimeout(函数, 毫秒)：把函数交给计时器，等会儿执行，不阻塞
  // () => console.log(...) 是"一个不需要参数的小函数"
  // 循环跑完后 i 变成 3，三个函数都读同一个 i
  setTimeout(() => console.log('【第1题】var  i =', i))
}

for (let j = 0; j < 3; j++) {
  // 换成 let：每一轮循环新建一个 j，三个函数各自记住自己那一轮
  setTimeout(() => console.log('【第1题】let  j =', j))
}


// ============================================================
// 第 2 题：this 指向
// ============================================================
// 造一个对象（C++ 里相当于 struct + 一个成员函数）
const obj = {
  name: 'a',
  say() { return this.name }        // this 相当于 C++ 的 this->
}

console.log('【第2题】obj.say()  =', obj.say())   // 点号前面是 obj，this 就是 obj → a

const f = obj.say                    // 把方法单独取出来存进 f（C++ 里写不出来）
try {
  console.log('【第2题】f()        =', f())
} catch (e) {
  // node 的普通脚本是"非严格模式"，this 是全局对象，打印 undefined
  // 小程序里是严格模式，this 是 undefined，访问 .name 会直接报错
  console.log('【第2题】f()         报错：', e.message)
}


// ============================================================
// 第 3 题：map(parseInt)
// ============================================================
// [1,2,3] 是数组（C++ 的 vector<int>）
// .map(函数) = 对每个元素调用一次函数，把返回值收成新数组
// parseInt(内容, 进制) = 把字符串按指定进制转成整数（C++ 的 std::stoi(s, nullptr, 进制)）

console.log('【第3题】parseInt("11", 2) =', parseInt('11', 2))   // 3
console.log('【第3题】parseInt("3", 2)  =', parseInt('3', 2))    // NaN（二进制没有 3）

// map 会传三个参数：(元素, 下标, 数组)，于是下标被 parseInt 当成了进制
console.log('【第3题】[1,2,3].map(parseInt) =', [1, 2, 3].map(parseInt).join(' , '))
// 展开就是：parseInt(1,0)=1  parseInt(2,1)=NaN  parseInt(3,2)=NaN

// 正确写法：自己包一层，只把元素传进去
console.log('【第3题】正确写法 map(n => parseInt(n,10)) =', [1, 2, 3].map(n => parseInt(n, 10)).join(' , '))


// ============================================================
// 第 4 题：执行顺序
// ============================================================
console.log('【第4题】1  A（同步）')
setTimeout(() => console.log('【第4题】4  B（setTimeout，宏任务）'))
Promise.resolve().then(() => console.log('【第4题】3  C（Promise.then，微任务）'))
console.log('【第4题】2  D（同步）')

// 规则：同步代码全部跑完 → 清空微任务 → 再取宏任务
// 结果顺序：A → D → C → B


// ============================================================
// 答案卡（脚本跑完会打印一次，方便对照）
// ============================================================
setTimeout(() => {
  console.log('')
  console.log('========== 答案 ==========')
  console.log('第1题：var 是 3 3 3；let 是 0 1 2')
  console.log('第2题：obj.say() 是 a；单独调用 f() 报错（非严格模式下是 undefined）')
  console.log('第3题：[1, NaN, NaN]；正确写法 [1, 2, 3]')
  console.log('第4题：A → D → C → B')
}, 50)

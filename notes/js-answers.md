# JS 四道题 · 详解 + 举一反三

> 配套文件：`notes/js-practice.js`。看完解释，回那个文件把 `predict` 补对，再跑一遍。

## 看这类题的固定顺序

1. **谁是同步、谁是异步**（决定执行顺序）
2. **变量是什么作用域**（var / let / 闭包）
3. **函数是怎么被调用的**（决定 this）
4. **回调收到了几个参数**（决定 parseInt 这类函数的行为）

四道题正好各考一条。

---

## 第 1 题 · var 和 let 在循环里的区别

```js
for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i)) }   // 3 3 3
for (let j = 0; j < 3; j++) { setTimeout(() => console.log(j)) }   // 0 1 2
```

### 为什么

`setTimeout` 的回调不会立刻执行，它被放进**宏任务队列**，等同步代码跑完才轮到。

- `var` 是**函数作用域**：整个循环只有**一个** `i`。循环结束时 `i` 变成 3，三个回调排队等着，等它们执行时读到的都是同一个 `i` = 3。
- `let` 是**块级作用域**，而且 `for` 循环对 `let` 有特殊处理：**每一轮迭代都会创建一个新的绑定**。第 0 轮的回调捕获的是那一轮的 `j`，所以是 0、1、2。

一句话记住：**var 共享一个变量，let 每轮一个。**

### 举一反三

```js
// 变形 1：加延迟也没用，顺序不影响结果
for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), i * 1000) }  // 3 3 3

// 变形 2：ES5 时代的解法——用函数包一层，造出独立作用域
for (var i = 0; i < 3; i++) {
  (function (n) { setTimeout(() => console.log(n)) })(i)                   // 0 1 2
}

// 变形 3：不是异步就没这问题
for (var i = 0; i < 3; i++) { console.log(i) }                             // 0 1 2
```

### 在你项目里会碰到

遍历列表批量请求数据：

```js
// 错的：所有回调拿到的都是最后一个 index
for (var i = 0; i < foods.length; i++) {
  wx.request({ url, success: () => console.log(foods[i]) })
}

// 对的
foods.forEach((food, i) => { /* 用 food，不用 i */ })
```

---

## 第 2 题 · this 由调用方式决定

```js
const obj = { name: 'a', say() { console.log(this.name) } }
const f = obj.say
f()        // undefined
```

### 为什么

`this` 不看函数在哪定义，只看**怎么被调用**。

| 调用方式 | this 指向 |
|---|---|
| `obj.say()` | `obj`（方法调用，点号前面是谁就是谁） |
| `f()` | 非严格模式 → `globalThis`；严格模式 → `undefined` |
| `new F()` | 新创建的对象 |
| `f.call(x)` / `f.apply(x)` / `f.bind(x)` | `x` |

`f()` 是普通调用，点号没了，`this` 就是全局对象。`globalThis.name` 不存在，所以打印 `undefined`（浏览器里是空字符串，因为 `window.name` 默认 `""`）。

### 举一反三

```js
const g = obj.say.bind(obj); g()                 // 'a'
setTimeout(obj.say, 0)                           // undefined —— 回调被"裸调用"，this 丢了
[1, 2, 3].map(obj.say)                           // undefined ×3
const h = () => console.log(this.name); h()      // 箭头函数没有自己的 this，继承外层
```

### 在你项目里会碰到

```js
// 错：把页面方法当回调传出去，this 丢了
wx.request({ url, success: this.setList })

// 对：包一层箭头函数，箭头函数不绑定 this，用的是外面的 this
wx.request({ url, success: (res) => this.setList(res.data) })
```

---

## 第 3 题 · map 传的不止一个参数

```js
[1, 2, 3].map(parseInt)      // [1, NaN, NaN]
```

### 为什么

`map` 调用回调时传**三个**参数：`(元素, 下标, 原数组)`。

`parseInt` 的签名是 `parseInt(字符串, 进制)`。两者一拼，就变成了：

```js
parseInt(1, 0)   // 进制 0 按 10 处理 → 1
parseInt(2, 1)   // 进制 1 不合法 → NaN
parseInt(3, 2)   // 二进制里没有 3 → NaN
```

### 举一反三

```js
['1','2','3'].map(parseInt)          // [1, NaN, NaN]
['10','10','10'].map(parseInt)       // [10, NaN, 2]   ← 进制0当10→10；进制1非法→NaN；进制2→2
['1','2','3'].map(n => parseInt(n, 10))  // [1, 2, 3] ← 正确写法
['1','2','3'].map(Number)            // [1, 2, 3]   ← 也行，Number 只用一个参数
[1,2,3].map(String)                  // ['1','2','3'] ← 安全，String 忽略多余参数
```

顺带记住 `parseInt` 和 `Number` 的区别：

```js
parseInt('12px', 10)   // 12      —— 遇到非数字就停
Number('12px')         // NaN     —— 整个字符串必须都是数字
```

### 在你项目里会碰到

用户输入克数，`e.detail.value` 是字符串：

```js
const grams = Number(e.detail.value)        // 推荐
const grams2 = parseInt(e.detail.value, 10) // 也行，一定要写第二个参数
```

---

## 第 4 题 · 事件循环：先同步，再微任务，再宏任务

```js
console.log('A')
setTimeout(() => console.log('B'))
Promise.resolve().then(() => console.log('C'))
console.log('D')
// A D C B
```

### 为什么

1. 先执行所有**同步代码**：`A`、`D`
2. 同步执行完，把**微任务队列**清空：`Promise.then` 的回调 → `C`
3. 微任务清空后，取一个**宏任务**：`setTimeout` → `B`

关键点：**微任务优先级高于宏任务，而且微任务会一次性全部清空**（清空过程中新产生的微任务也会被继续执行）。

### 举一反三

```js
// 变形 1：两个 then 连着，都在微任务阶段，按注册顺序执行
setTimeout(() => console.log(1))
Promise.resolve().then(() => console.log(2)).then(() => console.log(3))
console.log(4)
// 4 2 3 1

// 变形 2：await 后面的代码，等价于 then 里的代码
async function f() { console.log('a'); await 1; console.log('b') }
f(); console.log('c')
// a c b

// 变形 3：微任务里再产生微任务，仍然先于宏任务
Promise.resolve().then(() => {
  console.log('m1')
  Promise.resolve().then(() => console.log('m2'))
})
setTimeout(() => console.log('t'))
// m1 m2 t
```

### 在你项目里会碰到

```js
this.setData({ list: res.data })
console.log(this.data.list)   // 可能还是旧值 —— setData 是异步的
```

想读到渲染后的结果，用 `setData` 的回调：

```js
this.setData({ list: res.data }, () => {
  console.log(this.data.list)  // 这里是新值
})
```

---

## 一分钟自测

不看笔记，说出这四个结果：

```js
1. for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))
2. const o = { n: 1, f() { console.log(this.n) } }; const g = o.f; g()
3. ['10','10','10'].map(parseInt)
4. Promise.resolve().then(() => console.log('x')); console.log('y')
```

答案：`3 3 3` / `undefined` / `[10, NaN, 2]` / `y x`

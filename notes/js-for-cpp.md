# 给 C++ 程序员的 JS 入门（只为看懂那四道题）

## 一句话概括差异

| | C++ | JavaScript |
|---|---|---|
| 类型 | 静态，编译期确定 | 动态，运行时才看 |
| 执行 | 多线程，你自己管 | 单线程 + 事件循环 |
| 函数 | 不是值（指针/lambda 才是） | **函数就是值**，能赋给变量、能当参数 |
| this | 编译期绑定，永远指向当前对象 | **运行时决定**，看你怎么调用 |
| 内存 | 手动 / RAII | 垃圾回收，不用管 |

记住这五行，后面全是它们的推论。

---

## 1. 变量：没有类型，只有 let / const / var

```cpp
// C++
int i = 0;
const int N = 3;
std::string name = "a";
```

```js
// JS
let i = 0
const N = 3
let name = 'a'
```

差别：

- **不用写类型**。`let i = 0` 里 `i` 是数字，`let s = 'a'` 里 `s` 是字符串，运行时自己判断
- 数字只有一种 `Number`（双精度），没有 int / float / double 之分
- 字符串单双引号都行，`'a'` 和 `"a"` 一样

### var 是什么

`var` 是 ES6 之前的老写法，现在基本不用，但面试题最爱考它。三个区别：

| | 作用域 | 能否重复声明 |
|---|---|---|
| `var` | **函数作用域**（整个函数内都算同一个） | 可以，会覆盖 |
| `let` | **块级作用域**（`{}` 内有效，和 C++ 一样） | 不可以，报错 |
| `const` | 块级作用域 | 不可以，且不能重新赋值 |

```js
function f() {
  if (true) {
    var a = 1     // 这个 a 在整个 f 里都有效
    let b = 2     // 这个 b 只在这个 if 块里有效
  }
  console.log(a)  // 1
  console.log(b)  // 报错：b is not defined
}
```

**在第 1 题里**：`for (var i = 0; ...)` 的 `i` 是函数级的，整个循环只有**一个** `i`。换成 `let`，每轮循环的 `{}` 都是新的作用域，就有三个独立的 `j`。

---

## 2. 函数：在 JS 里，函数是"值"

C++ 的函数：

```cpp
int add(int a, int b) { return a + b; }
```

JS 的函数，**没有返回类型、没有参数类型**：

```js
function add(a, b) { return a + b }
```

### 三种写法，作用一样

```js
// 1. 函数声明
function add(a, b) { return a + b }

// 2. 函数表达式：把函数当成值，赋给一个变量
const add2 = function (a, b) { return a + b }

// 3. 箭头函数（最常用）
const add3 = (a, b) => a + b
```

第 2 种是关键：**函数可以像数字一样被赋值**。C++ 里你想这么干得用函数指针或 `std::function`：

```cpp
int (*p)(int, int) = add;              // C++ 函数指针
std::function<int(int,int)> f = add;   // C++ std::function
auto g = [](int a, int b){ return a + b; };  // C++ lambda
```

```js
const f = add        // JS：就这么简单，没有任何额外语法
```

箭头函数基本等于 C++ 的 lambda：

```cpp
auto g = [](int a, int b){ return a + b; };
```
```js
const g = (a, b) => a + b
```

### 因为函数是值，所以能当参数传

```js
function run(callback) {
  callback()          // 调用传进来的函数
}

run(() => console.log('hi'))   // 把一个函数当参数传进去
```

C++ 里对应 `void run(std::function<void()> cb)`。**回调（callback）就是这个东西**，没有更玄的含义。

### 第 2 题的代码逐行翻译

```js
const obj = { name: 'a', say() { console.log(this.name) } }
```
等于 C++：

```cpp
struct Obj {
  std::string name = "a";
  void say() { std::cout << this->name; }
};
```

```js
const f = obj.say     // 把成员函数"取出来"赋给一个变量
f()                   // 单独调用
```

**C++ 里这行根本编译不过**——成员函数必须通过对象调用。JS 能这么干，因为函数就是值，取出来之后它和 `obj` 就没关系了，`this` 自然也不是 `obj` 了。

---

## 3. 对象：其实就是个字典

```js
const obj = {
  name: 'a',
  age: 3,
  say() { console.log(this.name) }
}
```

- `say() { ... }` 是简写，完整写法是 `say: function () { ... }`
- 访问用 `obj.name` 或 `obj['name']`
- **可以随时加字段**：`obj.x = 1`，不需要提前声明（C++ 里不可能）

调用 `obj.say()` 时，`this` 就是 `obj`——**这是唯一和 C++ 一致的地方**。

---

## 4. this：C++ 里它是常量，JS 里它是变量

| | C++ | JS |
|---|---|---|
| 谁决定 | 编译器 | 运行时，看**调用方式** |
| 能否改变 | 不能 | 能（call / apply / bind） |

JS 的规则只有一条：**看点号前面是谁**。

```js
obj.say()      // 点号前面是 obj → this = obj
f()            // 前面什么都没有 → this = 全局对象（严格模式是 undefined）
new F()        // this = 新建的那个对象
f.call(x)      // this = x，你说了算
```

所以第 2 题 `f()` 打印 `undefined`：`this` 变成了全局对象，全局对象上没有 `name`。

**项目里的真实场景**：

```js
wx.request({ url, success: this.setList })   // 错：this 丢了
wx.request({ url, success: (res) => this.setList(res.data) })  // 对：箭头函数不绑定 this
```

---

## 5. 执行模型：单线程 + 事件循环（第 1、4 题的根）

C++ 里你写：

```cpp
std::this_thread::sleep_for(1s);   // 这一行把当前线程卡住 1 秒
std::cout << "after";
```

JS 里：

```js
setTimeout(() => console.log('after'), 1000)   // 不卡，立刻返回
console.log('next')                             // 这行会先执行
```

**`setTimeout` 不是开线程，它只是"把函数登记到 1 秒后的队列里"**。当前代码继续跑，跑完了才回头看队列里有没有到期的任务。

所以 JS 的执行顺序永远是：

1. 先跑完**所有同步代码**（执行栈清空）
2. 再清空**微任务队列**（Promise.then、await 后面的代码）
3. 再取**一个宏任务**（setTimeout、事件回调）
4. 重复 2、3

第 4 题 `A D C B` 就是这个顺序。

第 1 题 `3 3 3` 也是这个顺序：循环是同步的，先跑完（此时 `i` 已经是 3），回调才在队列里被执行，那时读到的都是 3。

---

## 6. C++ 程序员最容易踩的三个坑

1. **不检查参数个数**。`[1,2,3].map(parseInt)` 里 `map` 传了 3 个参数给 `parseInt`，`parseInt` 只用前两个，第三个丢了——不报错，只是结果错。C++ 里参数对不上编译器直接拒绝。
2. **不检查类型**。`'1' + 1` 是 `'11'`（字符串拼接），`1 - '1'` 是 `0`（自动转数字）。C++ 里得显式转。
3. **this 会丢**。只要函数被"单独拿出来"调用，`this` 就不是原来的对象了。

---

## 现在回头看四道题

| 题 | 考的是这一节 |
|---|---|
| 1. var / let 循环 | 第 1 节（作用域）+ 第 5 节（异步执行时机） |
| 2. this 丢失 | 第 2 节（函数是值）+ 第 4 节（this 运行时决定） |
| 3. map(parseInt) | 第 6 节第 1 条（不检查参数个数） |
| 4. A D C B | 第 5 节（单线程事件循环） |

四道题，其实就是这六节里的四条规则，套了个代码的壳。

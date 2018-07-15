# Decorator 装饰器模式

## 作用
1. Decorator是一个函数
2. 是用来修改行为的
3. 修改类的行为（在class或class的method上使用）

## 原理
利用Object.defineProperty实现

@readonly 具体做了什么呢？我们先来看一下 ES6 的 class 在转换为 ES5 代码之后是什么样的，即 Dog 这个 class 等价于：
````js
// 步骤 1
function Dog () {}

// 步骤 2
Object.defineProperty(Dog.prototype, 'bark', {
  value: function () { return 'wang!wang!' },
  enumerable: false,
  configurable: true,
  writable: true
})
````

对 bark 方法应用 @readonly 之后，JS 引擎就会在进行步骤二之前调用这个 decorator：
````js
let descriptor = {
  value: function () { return 'wang!wang!' },
  enumerable: false,
  configurable: true,
  writable: true
}

// decorator 接收的参数与 Object.defineProperty 一致
descriptor = readonly(Dog.prototype, 'bark', descriptor) || descriptor
// 重点！！覆盖原descriptor
Object.defineProperty(Dog.prototype, 'bark', descriptor)
````
参考 http://www.liuhaihua.cn/archives/115548.html

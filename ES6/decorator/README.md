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

## 其他
- 由于存在函数提升，使得修饰器不能用于函数。类是不会提升的，所以就没有这方面的问题。

## 参考 
[ECMAScript 6 入门 - 修饰器](http://es6.ruanyifeng.com/#docs/decorator#%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BF%AE%E9%A5%B0%E5%99%A8%E4%B8%8D%E8%83%BD%E7%94%A8%E4%BA%8E%E5%87%BD%E6%95%B0%EF%BC%9F)
[Decorators in ES7](http://www.liuhaihua.cn/archives/115548.html)

## 执行上下文
1. 一段<script>
> 全局：变量定义、函数声明、this相当于window
![](https://ws2.sinaimg.cn/large/006tNc79gy1fn02nhzky5j30hs02sjrb.jpg)
2. 或者是一个函数
> 函数：变量定义、函数声明、this、arguments、window

## this的变化场景
- 作为构造函数执行
- 作为对象属性执行
- 作为普通函数执行
- call apply bind

## 作用域链与原型链的区别
- 作用域链:函数内部求值某个变量时起作用。
- 原型链:外部调用引用类型(数组，函数，对象)的属性时起作用。
- 详情见scope.html

## 如何理解作用域
1. 自由变量
2. 作用域链，即自由变量的查找
3. 闭包的两个场景

## 自由变量查找过程
执行函数在哪里定义在哪里开始查找，与this无关，比如sayHello是在fn1里面定义的，那么查找自由变量hello时是fn1->window，虽然sayHello
内打印this结果是window但并不会直接从外部开始查找hello,所以console.log('sayHello:',hello)结果是'inner hello'
````
   var hello = 'outer hello';
    var obj = {
        fn1: function () {
            var hello = 'inner hello';
            function sayHello() {
                console.log('sayHello:',hello);
                console.log('sayHello:',this);
            }

            console.log('obj.fn scope:',this);
            sayHello();
        },
        fn2:function () {
            console.log('fn2');
        }
    };

    obj.fn1();
````

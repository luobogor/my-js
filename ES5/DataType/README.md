##数据类型
- 引用类型：对象，数组，函数
- 基本类型(值类型)：string、number、boolean、undefined、null(虽然undefined、null表现怪异但规范说明这两个是基本类型)、symbol

### 注意
- 特殊的类型：undefined
- 引用类型可以直接用.赋值，而值类型不可以。例如funA.fieldA = 'abc',arrA.fieldA='abc'

## typeof 运算符
- 记住，一共有7种情况

````
//**********值类型
typeof undefined // "undefined"
typeof 'abc' // "string"
typeof 123 // "number"
typeof NaN // "number"
typeof true // "boolean"
typeof Symbol() // 'symbol'
//**********引用类型
typeof {} // "object"
typeof [] // "object"
typeof null // "object"
typeof console.log // "function"
````
- typeof 只能区分值类型，不能区分引用类型中的对象和数组，但是可以区分出function,这是因为function在js中是"头等公民""
- 特别注意 null instanceof Object => false

## 类型转换
### 显式类型转换
#### Number
![](https://ws2.sinaimg.cn/large/006tKfTcgy1foccf8m9xpj30s60bqaav.jpg)
valueOf -> toString -> 报错

![](https://ws1.sinaimg.cn/large/006tKfTcgy1foccfhbdtaj30dl05z0u3.jpg)

#### String
![](https://ws3.sinaimg.cn/large/006tKfTcgy1foccfu91maj30at05iq3e.jpg)

toString -> valueOf -> 报错

![](https://ws1.sinaimg.cn/large/006tKfTcgy1foccg2hhptj30dg05hab4.jpg)

#### Boolean
![](https://ws1.sinaimg.cn/large/006tKfTcgy1foccgo3ffej30ct05laad.jpg)


### 隐式类型转换
1. 四则运算

````
var a = 100 + 10;//10010
var b = 100 + '10';//'10010'
````

2. 判断语句

````
100 == '100'//true，因为js把第一个100转换成为'100'
0 == ''//true,因为js把0和''都转换成为false
null == undefined//true,因为js把null和undefined都转换成为false

//*******何时使用===和==
jquery源码中除了判断对象中某个属性是否存在时用==,其他所有地方都用===
obj.a == null  =>  obj.a === null || ojb.a === undefined
````

4. 逻辑运算符

````
!window.abc //true,因为!undefined => !false => true

//判断一个变量会被js当作true or false的方法
var a = 100;
console.log(!!a);
````


## 问题
1. JS中的内置构造函数(共9种)，Math，JSON是`内置对象`不是函数
   1. Object
   1. Array
   1. Boolean
   1. Number
   1. String
   1. Function
   1. Date
   1. RegExp
   1. Error
![](https://ws4.sinaimg.cn/large/006tNc79gy1fmzt40h3ysj30hr051gm0.jpg)


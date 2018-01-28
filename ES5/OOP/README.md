标准规范里定义了9种数据类型，但只有6种是在ECMAScript程序里可以直接访问的,它们是：Undefined、Null、Boolean、String、Number、Object。

另外3种类型只能在实现级别访问（ECMAScript对象是不能使用这些类型的）并用于规范来解释一些操作行为、保存中间值。这3种类型是：Reference、List和Completion。

- Reference是用来解释delete、typeof、this这样的操作符，并且包含一个基对象和一个属性名称(this那篇文章有说过)；
- List描述的是`参数列表`的行为（在new表达式和函数调用的时候）；
- Completion是用来解释行为break、continue、return和throw语句的。

### Object类型
接着，Object类型（不要和Object构造函数混淆了，现在只讨论抽象类型）是描述 ECMAScript对象的唯一一个数据类型。

Object is an unordered collection of key-value pairs.
对象是一个包含key-value对的无序集合

回头来看6中用于ECMAScript程序的数据类型，前5种是原始值类型，包括Undefined、Null、Boolean、String、Number、Object。
原始值类型例子：

````
var a = undefined;
var b = null;
var c = true;
var d = 'test';
var e = 10;
````
这些值是在底层上直接实现的，他们不是object，所以没有原型，没有构造函数。

````
尽管262-3的标准是定义null的类型是Null，因为某些说不清的原因，262-5已经将标准修改为null的类型是object了
在 JavaScript 最初的实现中，JavaScript 中的值是由一个表示类型的标签和实际数据值表示的。对象的类型标签是 0。由于 null 代表的是空指针（大多数平台下值为 0x00），因此，null的类型标签也成为了 0，typeof null就错误的返回了"object"。（reference）

ECMAScript提出了一个修复（通过opt-in），但被拒绝。这将导致typeof null === 'object'。

null instanceof Object //false
````

ES5规范规定，静态对象不能扩展新的属性，并且它的属性页不能删除或者修改。他们是所谓的冻结对象，可以通过应用Object.freeze(o)方法得到。

````
var foo = {x: 10};
 
// 冻结对象
Object.freeze(foo);
console.log(Object.isFrozen(foo)); // true
 
// 不能修改
foo.x = 100;
 
// 不能扩展
foo.y = 200;
 
// 不能删除
delete foo.x;
 
console.log(foo); // {x: 10}
````

在ES5规范里，也使用Object.preventExtensions(o)方法防止扩展，或者使用Object.defineProperty(o)方法来定义属性：

````
var foo = {x : 10};
 
Object.defineProperty(foo, "y", {
  value: 20,
  writable: false, // 只读
  configurable: false // 不可配置
});
 
// 不能修改
foo.y = 200;
 
// 不能删除
delete foo.y; // false
 
// 防治扩展
Object.preventExtensions(foo);
console.log(Object.isExtensible(foo)); // false
 
// 不能添加新属性
foo.z = 30;
 
console.log(foo); {x: 10, y: 20}
````


### 属性的特性
所有的属性（property） 都可以有很多特性（attributes）。

{ReadOnly}——忽略向属性赋值的写操作尝，但只读属性可以由宿主环境行为改变——也就是说不是“恒定值” ;
{DontEnum}——属性不能被for..in循环枚举
{DontDelete}——糊了delete操作符的行为被忽略（即删不掉）;
{Internal}——内部属性，没有名字（仅在实现层面使用），ECMAScript里无法访问这样的属性。
注意，在ES5里{ReadOnly}，{DontEnum}和{DontDelete}被重新命名为[[Writable]]，[[Enumerable]]和[[Configurable]]，可以手工通过Object.defineProperty或类似的方法来管理这些属性。

#### 内部属性和方法
对象也可以有内部属性（实现层面的一部分），并且ECMAScript程序无法直接访问（但是下面我们将看到，一些实现允许访问一些这样的属性）。 这些属性通过嵌套的中括号[[ ]]进行访问。我们来看其中的一些，这些属性的描述可以到规范里查阅到。

每个对象都应该实现如下内部属性和方法：

````
[[Prototype]]——对象的原型（将在下面详细介绍）
[[Class]]——字符串对象的一种表示（例如，Object Array ，Function Object，Function等）;用来区分对象
[[Get]]——获得属性值的方法
[[Put]]——设置属性值的方法
[[CanPut]]——检查属性是否可写
[[HasProperty]]——检查对象是否已经拥有该属性
[[Delete]]——从对象删除该属性
[[DefaultValue]]返回对象对于的原始值（调用valueOf方法，某些对象可能会抛出TypeError异常）。
````

这个功能通常是用来检查对象用的，但规范上说宿主对象的[[Class]]可以为任意值，包括内置对象的[[Class]]属性的值，所以理论上来看是不能100%来保证准确的。例如，document.childNodes.item(...)方法的[[Class]]属性，在IE里返回"String"，但其它实现里返回的确实"Function"。

````
// in IE - "String", in other - "Function"
alert(getClass.call(document.childNodes.item));
````

### Boolean，String和Number对象
另外，规范也定义了一些原生的特殊包装类，这些对象是：

布尔对象
字符串对象
数字对象
这些对象的创建，是通过相应的内置构造器创建，并且包含原生值作为其内部属性，这些对象可以转换省原始值，反之亦然。

````
var c = new Boolean(true);
var d = new String('test');
var e = new Number(10);
 
// 隐式"valueOf"调用,转换成原始值
// 使用不带new关键字的函数
с = Boolean(c);
d = String(d);
e = Number(e);

c = c.valueOf()// 显式调用
 
// 重新转换成对象
с = Object(c);
d = Object(d);
e = Object(e);
````

````
var a = new Number(1);
var b = new Number(2);
 
alert(a + b); // 3
 
// 甚至
 
var c = {
  x: 10,
  y: 20,
  valueOf: function () {
    return this.x + this.y;
  }
};
 
var d = {
  x: 30,
  y: 40,
  // 和c的valueOf功能一样
  valueOf: c.valueOf
};
 
alert(c + d); // 100
valueOf的默认值会根据根据对象的类型改变（如果不被覆盖的话），对某些对象，他返回的是this——例如：Object.prototype.valueOf()，还有计算型的值：Date.prototype.valueOf()返回的是日期时间：

var a = {};
alert(a.valueOf() === a); // true, "valueOf"返回this
 
var d = new Date();
alert(d.valueOf()); // time
alert(d.valueOf() === d.getTime()); // true
````

此外,对象还有一个更原始的代表性——字符串展示。 这个toString方法是可靠的，它在某些操作上是自动使用的：

````
var a = {
  valueOf: function () {
    return 100;
  },
  toString: function () {
    return '__test';
  }
};
 
// 这个操作里，toString方法自动调用
alert(a); // "__test"
 
// 但是这里，调用的却是valueOf()方法
alert(a + 10); // 110
 
// 但，一旦valueOf删除以后
// toString又可以自动调用了
delete a.valueOf;
alert(a + 10); // "_test10"
````

和转化成原始值（ToPrimitive）相比，将值转化成对象类型也有一个转化规范（ToObject）。

一个显式方法是使用内置的Object构造函数作为function来调用ToObject（有些类似通过new关键字也可以）：

````
var n = Object(1); // [object Number]
var s = Object('test'); // [object String]
 
// 一些类似，使用new操作符也可以
var b = new Object(true); // [object Boolean]
 
// 应用参数new Object的话创建的是简单对象
var o = new Object(); // [object Object]
 
// 如果参数是一个现有的对象
// 那创建的结果就是简单返回该对象
var a = [];
alert(a === new Object(a)); // true
alert(a === Object(a)); // true
````

关于调用内置构造函数，使用还是不适用new操作符没有通用规则，取决于构造函数。 例如Array或Function当使用new操作符的构造函数或者不使用new操作符的简单函数使用产生相同的结果的：

````
var a = Array(1, 2, 3); // [object Array]
var b = new Array(1, 2, 3); // [object Array]
var c = [1, 2, 3]; // [object Array]
 
var d = Function(''); // [object Function]
var e = new Function(''); // [object Function]
有些操作符使用的时候，也有一些显示和隐式转化：

var a = 1;
var b = 2;
 
// 隐式
var c = a + b; // 3, number
var d = a + b + '5' // "35", string
 
// 显式
var e = '10'; // "10", string
var f = +e; // 10, number
var g = parseInt(e, 10); // 10, number

//parseInt第二个参数表示进制，一个介于2和36之间的整数，
//以下例子均返回15:
//parseInt("0xF", 16);
//parseInt("15,123", 10);
//parseInt("1111", 2);
//注意
//parseInt("546", 2);   //返回NaN， 除了“0、1”外，其它数字都不是有效二进制数字
 
// 等等
````

### 内部属性

````
内部方法[[Construct]]是通过使用带new运算符的构造函数来激活的，正如我们所说的这个方法是负责内存分配和对象创建的。如果没有参数，调用构造函数的括号也可以省略：

function A(x) { // constructor А
  this.x = x || 10;
}
 
// 不传参数的话，括号也可以省略
var a = new A; // or new A();
alert(a.x); // 10
 
// 显式传入参数x
var b = new A(20);
alert(b.x); // 20
````

[[Call]]可以用来区分函数与对象

> Thus [[Call]] besides the [[Class]] property (which equals to "Function") is the main in respect of objects distinguishing. Therefore the objects having internal [[Call]] property are called as functions. The typeof operator for such objects returns "function" value. However, it mostly relates to native objects, in case of host callable objects, the typeof operator (no less than [[Class]] property) of some implementations can return other value: for example, window.console.log(...) in IE:

````
// in IE - "Object", "object", in other - "Function", "function"
console.log(Object.prototype.toString.call(window.console.log));
console.log(typeof window.console.log); // "Object"
````

### 对象创建的算法
内部方法[[Construct]] 的行为可以描述成如下：

(notice, `NativeObject` here and below is my pseudo-code naming convention for “native object” concept from ECMA-262-3, but not the built-in constructor)

````
F.[[Construct]](initialParameters):
 
O = new NativeObject();
 
// 属性[[Class]]被设置为"Object"
O.[[Class]] = "Object"
 
// 引用F.prototype的时候获取该对象g
var __objectPrototype = F.prototype;
 
// 如果__objectPrototype是对象，就:
O.[[Prototype]] = __objectPrototype
// 否则:
O.[[Prototype]] = Object.prototype;
// 这里O.[[Prototype]]是Object对象的原型
 
// 新创建对象初始化的时候应用了F.[[Call]]
// 将this设置为新创建的对象O
// 参数和F里的initialParameters是一样的
R = F.[[Call]](initialParameters); this === O;
// 这里R是[[Call]]的返回值
// 在JS里看，像这样:
// R = F.apply(O, initialParameters);
 
// 如果R是对象
return R
// 否则
return O
````

请注意两个主要特点：
1. 首先，新创建对象的原型是从当前时刻函数的prototype属性获取的（这意味着同一个构造函数创建的两个创建对象的原型可以不同是因为函数的prototype属性也可以不同）。
2. 其次，正如我们上面提到的，如果在对象初始化的时候，[[Call]]返回的是对象，这恰恰是用于整个new操作符的结果：
3. 我的补充，如果构造函数的prototype为null，生成对象的__proto__并不是prototype

注意虽然手动恢复了constructor属性，和原来丢失的原型相比，{DontEnum}特性没有了，也就是说A.prototype里的for..in循环语句不支持了，不过第5版规范里，通过[[Enumerable]] 特性提供了控制可枚举状态enumerable的能力。

````
var foo = {x: 10};
 
Object.defineProperty(foo, "y", {
  value: 20,
  enumerable: false // aka {DontEnum} = true
});
 
console.log(foo.x, foo.y); // 10, 20
 
for (var k in foo) {
  console.log(k); // only "x"
}
 
var xDesc = Object.getOwnPropertyDescriptor(foo, "x");
var yDesc = Object.getOwnPropertyDescriptor(foo, "y");
 
console.log(
  xDesc.enumerable, // true
  yDesc.enumerable  // false
);
````

注意，__proto__在ES6纳入标准，ES5提供了Object.getPrototypeOf(O)方法，该方法直接返回对象的[[Prototype]]属性——实例的初始原型。 然而，和__proto__相比，它只是getter，它不允许set值。

`````
var foo = {};
Object.getPrototypeOf(foo) == Object.prototype; // true
`````

### instanceof
instanceof不是用来检测对象foo是否是用Foo构造函数创建的，所有instanceof运算符只需要一个对象属性——foo.[[Prototype]]，在原型链中从Foo.prototype开始检查其是否存在。instanceof运算符是通过构造函数里的内部方法[[HasInstance]]来激活的。

让我们来看看这个例子：
````
function A() {}
A.prototype.x = 10;
 
var a = new A();
alert(a.x); // 10
 
alert(a instanceof A); // true
 
// 如果设置原型为null
A.prototype = null;
 
// ..."a"依然可以通过a.[[Prototype]]访问原型
alert(a.x); // 10
 
// 不过，instanceof操作符不能再正常使用了
// 因为它是从构造函数的prototype属性来实现的
alert(a instanceof A); // 错误，A.prototype不是对象
````

### [[Get]]方法
[[Get]]也会从原型链中查询属性，所以通过对象也可以访问原型中的属性。

````
O.[[Get]](P):
 
// 如果是自己的属性，就返回
if (O.hasOwnProperty(P)) {
  return O.P;
}
 
// 否则，继续分析原型
var __proto = O.[[Prototype]];
 
// 如果原型是null，返回undefined
// 这是可能的：最顶层Object.prototype.[[Prototype]]是null
if (__proto === null) {
  return undefined;
}
 
// 否则，对原型链递归调用[[Get]]，在各层的原型中查找属性
// 直到原型为null
return __proto.[[Get]](P)
````

注意：in操作符也可以负责查找属性（也会查找原型链）：

````
if ('someObject' in window) {
  ...
}
````

### [[Put]]方法
[[Put]]方法可以创建、更新对象自身的属性，并且掩盖原型里的同名属性。

````
O.[[Put]](P, V):
 
// 如果不能给属性写值，就退出
if (!O.[[CanPut]](P)) {
  return;
}
 
// 如果对象没有自身的属性，就创建它
// 所有的attributes特性都是false
if (!O.hasOwnProperty(P)) {
  createNewProperty(O, P, attributes: {
    ReadOnly: false,
    DontEnum: false,
    DontDelete: false,
    Internal: false
  });
}
 
// 如果属性存在就设置值，但不改变attributes特性
O.P = V
 
return;
````

例如：

````
Object.prototype.x = 100;
 
var foo = {};
console.log(foo.x); // 100, 继承属性
 
foo.x = 10; // [[Put]]
console.log(foo.x); // 10, 自身属性
 
delete foo.x;
console.log(foo.x); // 重新是100,继承属性
````

请注意，不能掩盖原型里的只读属性，赋值结果将忽略，这是由内部方法[[CanPut]]控制的。

````
// 例如，属性length是只读的，我们来掩盖一下length试试
 
function SuperString() {
  /* nothing */
}
 
SuperString.prototype = new String("abc");
 
var foo = new SuperString();
 
console.log(foo.length); // 3, "abc"的长度
 
// 尝试掩盖
foo.length = 5;
console.log(foo.length); // 依然是3
````

但在ES5的严格模式下，如果掩盖只读属性的话，会报TypeError错误。

1.toString(); // 语法错误！
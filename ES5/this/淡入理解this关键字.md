this与上下文的可执行代码类型有关，其值在进入上下文阶段就确定了，并且在执行代码阶段是不能改变的。以下讨论都是基于非严格模式下this的值，严格模块下this的值，文章最后会提到。

## 全局代码中this的值
浏览器中，全局环境下非函数体内，this一定全局对象

- 显式定义属性

	````
	// 显式定义全局对象的属性
	this.a = 10; // global.a = 10
	console.log(a); // 10
	````

- 隐式定义属性
  > Javascript全局变量是全局对象的属性，这是在ECMAScript规范中强制规定的。  —— <\<JavaScript权威指南>> 第6版 3.10.2 

  ````
	b = 20;
	console.log(this.b); // 20
	
	var c = 30;
	console.log(this.c); // 30
  ````
 
## 函数代码中的this的值
不考虑call、apply、bind, **影响调用上下文中的this的值的只有可能是调用表达式的形式**，this的调用方式可分下如下3大类:

- 通过标识符(identifier)调用
 	- 全局环境下通过标识符调用
	- 函数执行环境下通过标识符调用
- 通过属性访问(access)调用
- 以上调用方式以外的调用方式

````
function foo() {
  console.log(this);
}
 
foo(); // 打印结果：window, 调用方式：全局环境下通过标识符调用
 
console.log(foo === foo.prototype.constructor); // true
 
// 然而，同样的函数，以另外一种调用方式的话，this的值就不同了
foo.prototype.constructor(); // 打印结果：foo.prototype, 调用方式：通过属性访问调用


var foo1 = {
  bar1: function () {
    console.log(this);
    console.log(this === foo1);
  }
};
 
foo1.bar1(); // 打印结果：foo1, true，调用方式：通过属性访问调用
 
var exampleFunc = foo1.bar1;
 
console.log(exampleFunc === foo1.bar1); // true
 
// 同样地，相同的函数以不同的调用方式，this的值也就不同了 
exampleFunc(); //打印结果：global, false ，调用方式：全局环境下通过标识符调用
````

为什么要这样分类，请继续往下看。

## 引用类型
当代码中出现以下两种求值情况

1. 求值一个标识符的时候
2. 进行属性访问的时候

如果是第1种情况，解释器会在作用域中查找需要的标识符，然后返回一个**引用类型的值**，也就是返回一个保存着引用类型的内存地址的变量，而不是返回一个引用类型。用伪代码表示为一个拥有两个属性的对象。

````
var valueOfReferenceType = {
  base: <object>,//base对象是 标识符所在的变量对象/属性所在对象
  propertyName: <property name of base object> //propertyName为标识符/属性
};
````
如果是第2种情况也是返回引用类型的值，但是base对象是否需要到作用域链中查找，Dmitry A.Soshnikov的文章没有说明，但是理论上来说这种情况下base对象也应该要到作用域中查找的。下面我们来举个栗子看看VRT是具体长什么样子。(以下内容都用”VRT“代替”引用类型的值“)

````
//***************我是全局执行环境
//**********标识符
//声名
var foo = 10;
function bar() {}

//求值
console.log(foo);
console.log(bar);

//在求值过程可以得到对应的VRT
var fooReference = {
  base: global,
  propertyName: 'foo'
};
 
var barReference = {
  base: global,
  propertyName: 'bar'
};

//**********属性访问
foo.bar();
foo['bar']();
//中间过程中，得到如下的引用类型的值：
var fooBarReference = {
  base: foo,
  propertyName: 'bar'
};

GetValue(fooBarReference); // function object "bar"
````

这时候有一个问题，虽然我们得到了某个标识符/属性的VRT，但我们还是没有拿到这个标识符/属性的值。也说是说console.log(foo)，不可能打印出{base: global, propertyName: 'foo'}吧，我们要打印的是foo的值10。这时解释器会调用GetValue方法，该方法用于在VRT中提取propertyName的值，用伪代码可以描述成如下形式：

````
function GetValue(referenceValue) {//参数为一个VRT
  if (Type(referenceValue) != Reference) {
    return referenceValue;
  }
 
  var base = GetBase(referenceValue);//提取VRT中的base对象
 
  if (base === null) {
    throw new ReferenceError;
  }
 
 //GetPropertyName(referenceValue) 提取VRT中的propertyName
 //[[Get]]方法返回了对象属性实际的值，包括从原型链中继承的属性(也就是说如果该对象中找不到对应的属性在它的原型中查找)
  return base.[[Get]](GetPropertyName(referenceValue));
}
````

所以上面栗子求值结果是

````
GetValue(fooReference); // 10
GetValue(barReference); // function object "bar"
````

## this的值的规则及函数调用表达式的形式

决定函数上下文中this的值的规则如下：
> 函数上下文中this的值是函数调用者提供并且由当前调用表达式的形式而定的。 如果在调用括号()的左边，有引用类型的值，那么this的值就会设置为该引用类型值的base对象。 所有其他情况下（非引用类型），this的值总是null。然而，**由于null对于this来说没有任何意义，因此会隐式转换为全局对象**。

简化一下就是下以两条规则：

1. 如果调用括号()左边为VRT，那么this的值就会设置为该**VRT的base对象**
2. 如果调用括号()左边为非VRT，this的值先是null，然后**隐式转换为全局对象**

从上面this的值的规则可以总结出，在不考虑call、apply、bind的情况下, **影响调用上下文中的this的值的只有可能是函数调用表达式的形式**，理解并谨记这一点非常重要，this的调用方式可分下如下3大类:

1. 通过标识符()调用(与上面提到的this规则1呼应)
 	- 全局环境下通过标识符调用
	- 函数执行环境下通过标识符调用
2. 通过属性访问( access)调用(与上面提到的this规则1呼应)
3. 以上调用方式以外的调用方式(与上面提到的this规则2呼应)

下面将通过代码验证this取值规则

### 通过标识符调用函数

#### 全局环境下通过标识符调用
全局环境下通过标识符调用，this一定是全局对象，因为返回VRT的base对象一定是全局对象。(with语句内定义的函数除外)

````
function foo() {
  console.log(this);
}
 
foo(); // global
//作用域查找算法返回foo的VRT
var fooReference = {
  base: global,
  propertyName: 'foo'
};
````
在上面例子中，foo为标识符，所以应用取值规则1, foo的VRT的base对象是全局对象，所以this的值是全局对象

#### 函数执行环境下通过标识符调用

````
function foo() {
  function bar() {
    console.log(this); //global
  }
  bar(); // 和AO.bar()是一样的 => null.bar() => window.bar()
}

//VRT
var barReference = {
  base: fooContext.AO,
  propertyName: 'bar'
};

foo() -> AO.foo() -> null.foo() -> foo.call(globalObject).

//可以通过以下代码更加明显地检验
function a() {
    console.log(this);//global
}
a.call(null);

````
这种情况比较特殊，ES3规定，活跃对象总是会返回this值为——null（用伪代码来表示，AO.bar()就相当于null.bar()）。然后，如此前描述的，this的值最终会由null变为全局对象。

ES3 spec:
> When the call operation is applied to a Reference value whose base object is an activation object, null is used as the this value of the call

ES7+ spec.
> The caller provides the this value. If the this value provided by the caller is not an object (including the case where it is null), then the this value is the global object.


### 通过属性访问调用
````
var foo1 = {
  bar1: function () {
    console.log(this);
    console.log(this === foo1);
  }
};
 
foo1.bar1(); // 打印结果：foo1, true，调用方式：通过属性访问调用

//因为VRT的base对象为foo1
var bar1Reference = {
  base: foo1,
  propertyName: 'bar1'
};
````
以上例子使用调用方式2，取值规则1。再来看看更复杂的例子


````
//************************case1*********************************
function foo() {
  console.log(this);
}
 
foo(); // 打印结果：window, 调用方式1：全局环境下通过标识符调用，取值规则1
 
console.log(foo === foo.prototype.constructor); // true
 
// 然而，同样的函数，以另外一种调用方式的话，this的值就不同了
foo.prototype.constructor(); // 打印结果：foo.prototype, 调用方式2：通过属性访问调用，取值规则1

//因为VRT的base对象为foo.prototype
var bar1Reference = {
  base: foo.prototype,
  propertyName: 'constructor'
};

//************************case2*********************************
var foo1 = {
  bar1: function () {
    console.log(this);
    console.log(this === foo1);
  }
};
 
foo1.bar1(); // 打印结果：foo1, true，调用方式：通过属性访问调用
 
var exampleFunc = foo1.bar1;
 
console.log(exampleFunc === foo1.bar1); // true
 
// 同样地，相同的函数以不同的调用方式，this的值也就不同了 
exampleFunc(); //打印结果：global, false ，调用方式：全局环境下通过标识符调用
````

### 以上调用方式以外的调用方式
- 立即执行函数

````
//调用方式：3 ，取值规则2
(function () {
  console.log(this); //global
})();
````
上述例子属性第3种调用方式，有函数对象，但非引用类型对象（因为它不既不是标识符也不属于属性访问），因此，在调用时函数，本来应该传递给this的值是null，此时应用取值规则2，null变为全局对象再作为参数传递给函数，所以最后this的值是global。

## new运算符与this的值
````
function A() {
  console.log(this); // newly created object, below - "a" object
  this.x = 10;
}
 
var a = new A();
console.log(a.x); // 10
````
这种调用方式与上述的调用方式有些差别，new操作符会调用“A”函数的内部[[Construct]]。 
在对象创建之后，会调用内部的[[Call]]函数，然后所有“A”函数中this设置成新创建的对象。


## 严格模式下的this
严格模式下的this，只要不显式地写出base对象，那么this为null。

````
'use strict';
function fn() {
    console.log('fn',this);
}

fn();//开启严格模式后，this为null，非严格模式下this为global
window.fn();//开启严格模式后，this为global，非严格模式下this为global
````
基于这一点我们探讨以下一些让人疑惑的调用方式


- setTimeout回调
- DOM事件回调(参考事件文章)


````
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<input type="button" id="test" value="click">
</body>
<script>
    'use strict';
    document.getElementById('test').addEventListener('click',function () {
        console.log('click',this);//DOM节点
        //可以推断出回调函数是DOM节点的一个属性，然后这样进行显式回调 DOM('test').xxx()
    });

    setTimeout(function () {
        console.log('setTimeout',this);//global
        //可以推断出在声名回调函数的时候，回调函数的引用值保存在window对象里。
        //然后这样进行显式回调 window.xxx = 我们写的回调方法，base对象为window
    });
</script>
</html>
````
## this与作用域链
this是在运行时确定的，作用域链是在函数声明时确定的。

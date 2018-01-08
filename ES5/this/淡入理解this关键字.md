This与上下文的可执行代码类型有关，其值在进入上下文阶段就确定了，并且在执行代码阶段是不能改变的。

### 全局代码中This的值
- 显式定义属性

	````
	// 显式定义全局对象的属性
	this.a = 10; // global.a = 10
	alert(a); // 10
	````

- 隐匿定义属性

  ````
  // 通过赋值给不受限的标识符来进行隐式定义
	b = 20;
	alert(this.b); // 20
 
	// 通过变量声明来进行隐式定义
	// 因为全局上下文中的变量对象就是全局对象本身
	var c = 30;
	alert(this.c); // 30
  ````
 
### 函数代码中的This的值


在一般的函数调用中，this的值是由激活上下文代码的调用者决定的，
this的值是由调用表达式的形式决定的

影响调用上下文中的this的值的只有可能是调用表达式的形式，也就是调用函数的方式。

````
function foo() {
  alert(this);
}
 
foo(); // global
 
alert(foo === foo.prototype.constructor); // true
 
// 然而，同样的函数，以另外一种调用方式的话，this的值就不同了
 
foo.prototype.constructor(); // foo.prototype 
````

````
var foo = {
  bar: function () {
    alert(this);
    alert(this === foo);
  }
};
 
foo.bar(); // foo, true
 
var exampleFunc = foo.bar;
 
alert(exampleFunc === foo.bar); // true
 
// 同样地，相同的函数以不同的调用方式，this的值也就不同了
 
exampleFunc(); // global, false
````

## 引用类型
引用类型的值可以用伪代码表示为一个拥有两个属性的对象
````
var valueOfReferenceType = {
  base: <base object>,
  propertyName: <property name of base object> 
};
````
以下两种情况：
- 取值标识符
- 进行属性访问的时候
都会返回一个引用类型





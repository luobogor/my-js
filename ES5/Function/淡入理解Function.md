## 函数声名与函数表达式
 | 函数声名（Funtion Declaration 简称FD） | 函数表达式（Functino Expression 简称：FE）
---|---|--- 
函数名 | 有函数名 | 函数名可有可无
代码位置| 全局环境或者在函数的函数体（FunctionBody）中 | 必须要在表达式的位置
创建时期 | 预编译阶段创建 | 代码执行阶段创建
是否会添加到变量对象 | 会添加到变量对象 | 不会添加到变量对象
代码形式 | | 

前方高能，建议翻开你的 <\<JavaScript语言精粹>> 一边查看语法图，一边阅读下面内容

- FD代码形式如下

````
    'function' name '('[args]')' '{'FunctionBody'}'
    
    // 函数声明可以直接在程序级别的全局上下文中
    function globalFD() {
      // 或者直接在另外一个函数的函数体中
      function innerFD() {}
    }
````

## FE代码形式

### 常见FE形式
- 把函数写在括号里

````
/* 
 	
 	因为 expression 可以是 (expression)
 	所以 expression => (expression)
	 因为 expression 可以是 literal
    所以 (expression) => (literal)
    因为 literal 可以是 function literal
    所以 (literal) => (funciton literal)
    
    结果表明只要将在'()'里的声明一个函数，解释器会按表达式来解释该声明，
    也就是上面表格写的FE代码必须要在表达式的位置
    expression => (function literal)    
*/

    //所以这声明函数是合法是
    (function foo(){})
````

- 赋值函数给变量

````
/*
	*号表示0个或0个以上
	'var' name '=' expression[,expression]* [;]
	
	有了前面expression => (function literal)的证明，我们很容易得出，赋值函数给变量这种写法也是合法的
	
	常见写法如下
*/
    var foo = function () {
      //todo
    };
    
    var foo = function _foo() {
      //todo
    };
````

### 调用FE

FE后面可以用'()'进行调用，也是有语法有查的

````
/*
	expression => expression + invocation
	
	invocation定义如下
	'(' expression[,expression]* ')'
	
	所以最后有
	expression => 函数声名写在某些特定的位置使其自身转化为函数表达式 + invocation
*/
````

可以从以上调用语法得知，只要函数写在某些特定的位置使其自身转化为函数表达式，就可以直接对其进行调用，例如上面提到的(function(){})，该函数写在括号内，使其处于一个expression的位置，所以它才被称为FE。

````
/*
	object的定义大概如下
	'{' name | string ':' expression '}'
*/
	 var obj = {
        fn: function () {
            return 'hello';
        }()
    };

    console.log(obj.fn);//hello

````

上面例子中，因为在 " : " 后面声明一个函数，它就会是FE，即使函数不是写在括号内，调用也是合法的。因此，对“括号有关”问题的完整的回答则如下所示：

- 如果要在函数创建后立马进行函数调用，并且函数不在表达式的位置时，括号就是必须的。这种情况下，其实是手动的将其转换成了FE
- 而当解释器直接将其以FE的方式处理的时候，说明FE本身就在函数表达式的位置，这个时候括号就不是必须的了

下面我们通过代码查看更多FE的形式

````   	
	 //array literal
    '[' ']'  或者  '['expression[','expression]*']'
    //在数组初始化中，同样也只能是表达式
    [function bar() {}];
    
    // 逗号,非操作符也只能跟表达式
    1, function baz() {};
    
    !function () {
      alert('ECMAScript');
    };
    
    //?:运算符也是如此 expressinon ? experssion : expressinon
    var foo = 10;
     
    var bar = (foo % 2 == 0
      ? function () { alert(0); }
      : function () { alert(1); }
    );
     
    bar(); // 0
````
### 不正确的调用方式

````
// "foo" 是函数声明
// 并且是在进入上下文的时候创建的
 
alert(foo); // function
 
function foo(x) {
  alert(x);
}(1); // 这里只是组操作符，并非调用!
 
foo(10); // 这里就是调用了, 10
````
上述代码其实就是如下代码：

````
// function declaration
function foo(x) {
  alert(x);
}
 
// 含表达式的组操作符
(1);
 
// 另外一个组操作符
// 包含一个函数表达式
(function () {});
 
// 这里面也是表达式
("foo");
 
// etc
````

## NFE
NFE即带函数名的函数表达式，在NFE前后是不能通过NFE的名字来调用NFR的，NFE的好处是可以通过名字自递归又不影响VO(文章开头有提及FE不会影响VO)

````
(function foo(bar) {
 
  if (bar) {
    return;
  }
 
  foo(true); // "foo" name is available
})();
````
### NFE的储存位置
以上面的例子的foo函数为例，分析NFE创建过程

1. 当解释器在执行代码阶段检测到NFE，它会在创建FE之前，创建一个辅助型的特殊对象，并把它添加到当前的作用域链(Scope)最前端，然后再创建FE

	````
	specialObject = {};
	currentFunctionContext.Scope = specialObject + currentFunctionContext.Scope;
	````
2. 在这个时候FE有了[[Scope]]属性，也就是当FE的外部函数所在上下文的作用域链(Scope)，也就是说FE.[[Scope]]有了那个特殊对象

	````
	foo = FunctionExpression;
	foo.[[Scope]] = currentFunctionContext.Scope;
	````
3. 之后，FE的名字添加到了特殊对象中，FE的名字是特殊对象的唯一属性，其值就是对FE的引用

	````
	specialObject.foo = foo; // {DontDelete}, {ReadOnly}
	````

3. 在最后，当前NFE上下文退出的时候，就会把该特殊对象移除
 
	````
	delete Scope[0]; // 从作用域链的最前面移除specialObject
	````

以上过程用伪代码来描述此算法就如下所示：

````
specialObject = {};
 
currentFunctionContext.Scope = specialObject + currentFunctionContext.Scope;
 
foo = FunctionExpression;
foo.[[Scope]] = Scope;
specialObject.foo = foo; // {DontDelete}, {ReadOnly}
 
delete Scope[0]; // 从作用域链的最前面移除specialObject
````


## 函数创建的算法
注意下面F指是js里一个普通函数，不是Function构造方法

````
//********************************** I am 解释过程伪代码
F = new NativeObject();
 
// 属性 [[Class]] is "Function",看不懂？？
F.[[Class]] = "Function"
 
// 函数对象的原型
F.[[Prototype]] = Function.prototype
 
// 对函数自身引用
// [[Call]] 在函数调用时F()激活
// 同时创建一个新的执行上下文
F.[[Call]] = <reference to function>
 
// 内置的构造器
// [[Construct]] 会在使用“new”关键字的时候激活。事实上，它会为新对象申请内存
// 然后调用 F.[[Call]]来初始化创建的对象，将this值设置为新创建的对象
F.[[Construct]] = internalConstructor
 
// 当前上下文（创建函数F的上下文）的作用域名链
F.[[Scope]] = activeContext.Scope
// 如果是通过new Function(...)来创建的，则
F.[[Scope]] = globalContext.Scope
 
// 形参的个数
F.length = countParameters
 
// 通过F创建出来的对象的原型
__objectPrototype = new Object();
__objectPrototype.constructor = F // {DontEnum}, 在遍历中不能枚举
F.prototype = __objectPrototype
 
return F
````
以下是一个例子

````

//************************************I am JS code
HellWorld(p1,p2){}

HellWorld.length === 2 //true

Object.prototype.toString.call(HellWorld)//打印"[object Function]",对应F.[[Class]] = "Function"

HellWorld();//触发HellWorld.[[Call]]

var hellWorldIns = new HellWorld();//先触发HellWorld.[[Construct]] 接着触发 HellWorld.[[Call]]

hellWorldIns.__proto__ instanceof Object;//__objectPrototype = new Object();

hellWorldIns.__proto__.consturctor === HellWorld //true,对应__objectPrototype.constructor = F

HellWorld.__proto__  === Function.prototype //true,对应 F.[[Prototype]] = Function.prototype

//https://www.ecma-international.org/ecma-262/5.1/#sec-15.3.4.4
//[[call]]与[[constructor]]
````


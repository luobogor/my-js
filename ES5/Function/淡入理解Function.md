- 函数声名

函数声明（简称FD）是指这样的函数
* 有函数名
* 代码位置：全局环境或者在函数的函数体（FunctionBody）中
* 在进入函数上下文第一次扫描时创建
* 会影响变量对象
* 是以如下形式声明的
````
    'function' identifiter (identifiter,...) {body}
    
    // 函数声明可以直接在程序级别的全局上下文中
    function globalFD() {
      // 或者直接在另外一个函数的函数体中
      function innerFD() {}
    }
````

- 函数表达式
函数表达式（简称：FE）是指这样的函数：
* 代码位置必须要在表达式的位置
* 名字可有可无
* 不会影响变量对象
* 在执行代码阶段创建出来
````
    expression 可以是 literal
    (expression) => (literal)
    literal 可以是 function literal
    (literal) => (funciton literal)
    所以
    (expression) => (function literal)
    
    // 在括号中(grouping operator)只可能是表达式
    (expression) 
    
    
    var foo = function () {
      ...
    };
    
    var foo = function _foo() {
      ...
    };
    这里要注意的是，在FE的外部可以通过变量“foo”——foo()来访问，而在函数内部（比如递归调用），
    还可以用“_foo”（译者注：但在外部是无法使用“_foo”的，因为VO中保存的是foo,当访问_foo时在VO中查找无结果）。
      function _foo() {
            console.log('outer');
        }
    
        function a() {
            var b = function _foo() {
                console.log('inner');
            };
    
            _foo();
        }
        a();//hello
        
        
    
    
    // 在数组初始化中 —— 同样也只能是表达式
    [function bar() {}];
    
    //array literal
    [expression,expression,....]
    
    // 逗号,非，各种操作符也只能跟表达式??
    // prefix operator - expression 
    1, function baz() {};
    
    !function () {
      alert('ECMAScript');
    };
    
    //expressinon ? experssion : expressinon
    var foo = 10;
     
    var bar = (foo % 2 == 0
      ? function () { alert(0); }
      : function () { alert(1); }
    );
     
    bar(); // 0
    
    //object
    // : expression
    
    //因此，对“括号有关”问题的完整的回答则如下所示：
    //如果要在函数创建后立马进行函数调用，并且函数不在表达式的位置时，括号就是必须的 —— 这样情况下，其实是手动的将其转换成了FE。 
    
   // 而当解释器直接将其以FE的方式处理的时候，说明FE本身就在函数表达式的位置 —— 这个时候括号就不是必须的了。 exprssion - invocation
````


NFE,可以通过名字自递归又不影响VO
````
  var foo = function _foo() {
      ...
    };
    
      (function _foo() {
          ...
       };)
````

当解释器在执行代码阶段看到了有名字的FE之后，它会在创建FE之前，创建一个辅助型的特殊对象，
并把它添加到当前的作用域链中。 然后，再创建FE，在这个时候（根据第四章-作用域链描述的），
函数拥有了[[Scope]]属性 —— 创建函数所在上下文的作用域链（这个时候，在[[Scope]]就有了那个特殊对象）。 之后，特殊对象中唯一的属性 —— FE的名字添加到了该对象中；其值就是对FE的引用。在最后，当前上下文退出的时候，就会把该特殊对象移除。 用伪代码来描述此算法就如下所示：
````
specialObject = {};
 
Scope = specialObject + Scope;
 
foo = FunctionExpression;
foo.[[Scope]] = Scope;
specialObject.foo = foo; // {DontDelete}, {ReadOnly}
 
delete Scope[0]; // 从作用域链的最前面移除specialObject
````


## 函数创建的算法
注意下面F指是js里一个普通函数，不是Function构造方法
````
//******************I am JS code
HellWorld(p1,p2){}
//helloWorld创建过程如下
//******************I am 解释器伪代码
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

//******************创建结束
HellWorld.length === 2 //true

Object.prototype.toString.call(HellWorld)//打印"[object Function]",对应F.[[Class]] = "Function"

HellWorld();//触发HellWorld.[[Call]]

var hellWorldIns = new HellWorld();//先触发HellWorld.[[Construct]] 接着触发 HellWorld.[[Call]]

hellWorldIns.__proto__ instanceof Object;//__objectPrototype = new Object();

hellWorldIns.__proto__.consturctor === HellWorld //true,对应__objectPrototype.constructor = F

HellWorld.__proto__  === Function.prototype //true,对应 F.[[Prototype]] = Function.prototype
````


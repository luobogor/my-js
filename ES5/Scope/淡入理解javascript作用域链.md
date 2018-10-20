## 重要概念
### 执行环境(execution context)
定义了变量或函数有权访问的其他数据，决定了它们各自的行为。更准确地说执行环境只是一个抽象概念，函数执行时所用到的内存片段(计算栈，参数栈.....),其实执行环境就是"函数帧"。

#### VO(variable object)
每个执行环境都有一个与之关联的变量对象(variable object,简写VO)，环境中定义的所有变量和函数都保存在这个VO。在代码中无法访问到VO，但解析器在处理数据时会在后台使用它。

## 全局执行环境
- 全局执行环境是最外围的一个执行环境
- web浏览器中，window对象是全局执行环境对应的VO
- 全局变量和函数都作为window对象的属性和方法创建

	````
	var a = 'abc';//等价于 window.a = 'abc' 或者 this.a = 'abc'
	
	````
- 全局执行环境直到应用程序退出——例如关闭网页或浏览器时才会被销毁。

## 函数的生命周期
### 创建 
  - 创建一个预先包含全局变量对象的作用域链，这个作用域链被保存在函数的[[scope]]属性中。
  
### 执行
  - 当程序执行到某个函数时，会创建该函数的执行环境，然后将该环境推入一个环境栈中
  - 一旦进入执行上下文（在执行代码之前），VO(即当前函数AO)就会被一些属性填充：
      - arguments对象<br>
      —— 变量对象的一个属性，其属性名是arguments，其值就是实参的值构成的对象；对于没有传递的参数，其值为undefined
      - 函数的形参<br>
      —— 变量对象的一个属性，其属性名就是形参的名字，其值就是实参的值；对于没有传递的参数，其值为undefined
	  - 函数声明（FunctionDeclaration, FD）<br>
	  —— 变量对象的一个属性，其属性名和值都是函数对象创建出来的；如果变量对象已经包含了相同名字的属性，则替换它的值
	  - 变量声明（var，VariableDeclaration） <br>
	  —— 变量对象的一个属性，其属性名即为变量名，其值为undefined;如果变量名和已经声明的函数名或者函数的参数名相同，则不会影响已经存在的属性。
	  
  - 然后通过复制函数的[[scope]]属性中的对象+函数的AO，构建起函数执行环境的作用域链即Scope属性。要注意的是AO是Scope数组的第一个元素，在作用域链的最前面
  
  ````
  activeExecutionContext = {
      VO: {...}, // 或者 AO
      this: thisValue,
      Scope: [ // 作用域链
        // 所有变量对象的列表
        // 用于标识符查询
      ]
  };
  ````
  - 如果在该函数在内部定义了函数，并且内部函数引用了外部函数的变量或函数，则 innerFn.[[scope]] = outerFnContext.AO + outerFn.\[[scope]] (闭包的实现原理)。
  内部函数引用了外部函数的变量或函数，则innerFn.[[scope]] = globalContext.VO
  如果是多层嵌套，则只会将引用的层的活跃对象加入到内部函数的[[scope]]中(Chrome是这样实现，FireFox则是所有层都加进[[scope]])
  
  ````
  var x = 10;
   
  function foo() {
   
      var y = 20;
   
      function bar() {
        var z = 30;
        alert(x +  y + z);
      }
   
      bar();
  }
   
  foo(); // 60
  //*********************我是JS解析器**********************************
  //全局上下文的变量对象如下
  globalContext.VO === Global = {
	    x: 10
	    foo: 
  };
  //在“foo”函数创建的时候，其[[Scope]]属性如下所示：
  foo.[[Scope]] = [
    	globalContext.VO
  ];
  //“foo”函数上下文的作用域链如下
  fooContext.Scope = fooContext.AO + foo.[[Scope]]
   
  fooContext.Scope = [
    	fooContext.AO,
    	globalContext.VO
  ];
  
  bar.[[Scope]] = [
   		fooContext.AO,
   		globalContext.VO
  ];
  
  //在“bar”函数激活的时候，其对应的活跃对象如下所示：
  barContext.AO = {
    	z: 30
  };
  ````
 
####new Function()作用链特例
  特殊情况，如果函数通过Function构造器来创建的时候，其[[Scope]]属性永远都只包含全局对象。
  
  ````
  var x = 10;
   
  function foo() {
   
    var y = 20;
   
    function barFD() { // FunctionDeclaration
      alert(x);
      alert(y);
    }
   
    var barFE = function () { // FunctionExpression
      alert(x);
      alert(y);
    };
   
    var barFn = Function('alert(x); alert(y);');
   
    barFD(); // 10, 20
    barFE(); // 10, 20
    barFn(); // 10, "y" is not defined
   
  }
   
  foo();
  ````
### 销毁
 - 函数执行完毕，该函数的执行环境的的作用域链会被销毁
 - 如果当前执行函数返回的是一个函数,又或者当前执行环境内定义回调函数，那么它的活动对象由于被返回函数/回调函数的作用域引用，会保留在内存中。直到返回函数/回调函数被销毁后，外部函数的活动对象才会被销毁。
 - 函数执行之后，栈将其环境弹出，把控制权返回给之前的执行环境。

#### 销毁总结
- 函数执行环境的作用域链Scope一定会被销毁
- 函数的活动对象可能会被销毁
- 函数的作用域链[[scope]]一定不会被销毁(除非执行完当前函数后程序结束)

### [[Scope]]与Scope
- [[Scope]]是函数的属性
- Scope是执行上下文的属性

## 闭包
正如在前面提到的因为在另一个函数内部定义的函数，会有 innerFn.[[scope]] = outerFnContext.AO + outerFn.\[[scope]]，
那么当该内部函数被调用时，因为该内部函数的执行环境的Scope中存有outerFnContext.AO ，那么只有沿着Scope向上搜索就会访问到外部函数的变量和函数了。
### 类型 
引用了外部函数变量或函数的回调函数和返回函数


## 作用域向上寻找变量,不会寻找AO/VO的原型变量
## 延长作用域链
- with
- try/catch

    ````
    Scope = withObject|catchObject + AO|VO + [[Scope]]
    
    try {
      ...
    } catch (ex) {
      alert(ex);
    }
    
    //作用域链修改为如下所示：
    
    var catchObject = {
      ex: 
    };
     
    Scope = catchObject + AO|VO + [[Scope]]
    ````
    
## 作用域链总结
- 作用：保证对执行环境有权访问的所有变量和函数的有序访问
- 本质：一个指向变量对象的指针列表

## 其他 
console.dir(fn)


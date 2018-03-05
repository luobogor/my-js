- 进入执行环境，获取解析器分配的内存
- 第一次遍历收集var声名的变量与函数定义，变量值为undefined，
将函数代码放到一个内存[[FunctionLocation]]属性,将所有变量与函数定义存在变量对象中。存储函数代码后，存储方法返回函数的[[scope]]
即使是return语句后的变量定义和函数定义都是有效的。
![](https://ws1.sinaimg.cn/large/006tNc79gy1fn9ldtmnlpj30hh0ajacz.jpg)


Arindam Paul - JavaScript VM internals, EventLoop, Async and ScopeChains

https://www.youtube.com/watch?v=QyUFheng6J0

- 第二次遍历填充变量对象的值，如果找不到定义则将变量添加到对象变量末端。（不声名变量宽容）
- [[]]表示内部属性，如[[scopes]],[[class]]

````
    var foo = {n: 1};
    (function (foo) {
// 变量声明（var，VariableDeclaration） —— 变量对象的一个属性，其属性名即为变量名，其值为undefined;
// 如果变量名和已经声明的函数名或者函数的参数名相同，则不会影响已经存在的属性。

//    AO = {
//        foo: {n:1},
//    };
//也就是说foo一直是参数，而不是局部变量
        var foo
        console.log(foo.n);
        foo.n = 3;
        foo = {n: 2};//参数地址改变
        console.log(foo.n);
    })(foo);
    console.log(foo.n);
    //输出1,2,3
    
    
    
    
    
    Dmitry Soshnikov  in ECMAScript	| 2010-03-15
    ECMA-262-3 in detail. Chapter 2. Variable object.
    Read this article in: Russian, Chinese (version1, version2, version 3), Korean, German, French.
    
    Introduction
    Data declaration
    Variable object in different execution contexts
    Variable object in global context
    Variable object in function context
    Phases of processing the context code
    Entering the execution context
    Code execution
    About variables
    Feature of implementations: property __parent__
    Conclusion
    Additional literature
    Introduction
    Always in programs we declare functions and variables which then successfully use building our systems. But how and where the interpreter finds our data (functions, variable)? What occurs, when we reference to needed objects?
    
    Many ECMAScript programmers know that variables are closely related with the execution context:
    
    1
    2
    3
    4
    5
    6
    7
    8
    var a = 10; // variable of the global context
     
    (function () {
      var b = 20; // local variable of the function context
    })();
      
    alert(a); // 10
    alert(b); // "b" is not defined
    Also, many programmers know that the isolated scope in the current version of specification is created only by execution contexts with “function” code type. I.e., in contrast with C/C++, for example the block of for loop in ECMAScript does not create a local context:
    
    1
    2
    3
    4
    5
    for (var k in {a: 1, b: 2}) {
      alert(k);
    }
      
    alert(k); // variable "k" still in scope even the loop is finished
    Let’s see in more details what occurs when we declare our data.
    
    Data declaration
    If variables are related with the execution context, it should know where its data are stored and how to get them. This mechanism is called a variable object.
    
    A variable object (in abbreviated form — VO) is a special object related with an execution context and which stores:
    
    variables (var, VariableDeclaration);
    function declarations (FunctionDeclaration, in abbreviated form FD);
    and function formal parameters
    declared in the context.
    
    Notice, in ES5 the concept of variable object is replaced with lexical environments model, which detailed description can be found in the appropriate chapter.
    
    Schematically and for examples, it is possible to present variable object as a normal ECMAScript object:
    
    1
    VO = {};
    And as we said, VO is a property of an execution context:
    
    1
    2
    3
    4
    5
    activeExecutionContext = {
      VO: {
        // context data (var, FD, function arguments)
      }
    };
    Indirect referencing to variables (via property names of VO) allows only variable object of the global context (where the global object is itself the variable object). For other contexts directly to reference the VO is not possible, it is purely mechanism of implementation.
    
    When we declare a variable or a function, there is nothing else as creation of the new property of the VO with the name and value of our variable.
    
    Example:
    
    1
    2
    3
    4
    5
    6
    7
    var a = 10;
     
    function test(x) {
      var b = 20;
    };
     
    test(30);
    And corresponding variable objects are:
    
    1
    2
    3
    4
    5
    6
    7
    8
    9
    10
    11
    // Variable object of the global context
    VO(globalContext) = {
      a: 10,
      test: <reference to function>
    };
      
    // Variable object of the "test" function context
    VO(test functionContext) = {
      x: 30,
      b: 20
    };
    But at implementation level (and specification) the variable object is an abstract essence. Physically, in concrete execution contexts, VO is named differently and has different initial structure.
    
    Variable object in different execution contexts
    Some operations (e.g. variable instantiation) and behavior of the variable object are common for all execution context types. From this viewpoint it is convenient to present the variable object as an abstract base thing. Function context can also define additional details related with the variable object.
    
    1
    2
    3
    4
    5
    6
    7
    8
    AbstractVO (generic behavior of the variable instantiation process)
     
      ║
      ╠══> GlobalContextVO
      ║        (VO === this === global)
      ║
      ╚══> FunctionContextVO
               (VO === AO, <arguments> object and <formal parameters> are added)
    Let’s consider it in detail.
    
    Variable object in global context
    Here, first it is necessary to give definition of the Global object.
    
    Global object is the object which is created before entering any execution context; this object exists in the single copy, its properties are accessible from any place of the program, the life cycle of the global object ends with program end.
    
    At creation the global object is initialized with such properties as Math, String, Date, parseInt etc., and also by additional objects among which can be the reference to the global object itself — for example, in BOM, window property of the global object refers to global object (however, not in all implementations):
    
    1
    2
    3
    4
    5
    6
    7
    global = {
      Math: <...>,
      String: <...>
      ...
      ...
      window: global
    };
    When referencing to properties of global object the prefix is usually omitted, because global object is not accessible directly by name. However, to get access to it is possible via this value in the global context, and also through recursive references to itself, for example window in BOM, therefore write simply:
    
    1
    2
    3
    4
    5
    String(10); // means global.String(10);
     
    // with prefixes
    window.a = 10; // === global.window.a = 10 === global.a = 10;
    this.b = 20; // global.b = 20;
    So, coming back to variable object of the global context — here variable object is the global object itself:
    
    1
    VO(globalContext) === global;
    It is necessary to understand accurately this fact since for this reason declaring a variable in the global context, we have ability to reference it indirectly via property of the global object (for example when the variable name is unknown in advance):
    
    1
    2
    3
    4
    5
    6
    7
    8
    9
    var a = new String('test');
     
    alert(a); // directly, is found in VO(globalContext): "test"
     
    alert(window['a']); // indirectly via global === VO(globalContext): "test"
    alert(a === this.a); // true
      
    var aKey = 'a';
    alert(window[aKey]); // indirectly, with dynamic property name: "test"
    Variable object in function context
    Regarding the execution context of functions — there VO is inaccessible directly, and its role plays so-called an activation object (in abbreviated form — AO).
    
    1
    VO(functionContext) === AO;
    An activation object is created on entering the context of a function and initialized by property arguments which value is the Arguments object:
    
    1
    2
    3
    AO = {
      arguments: <ArgO>
    };
    Arguments object is a property of the activation object. It contains the following properties:
    
    callee — the reference to the current function;
    length — quantity of real passed arguments;
    properties-indexes (integer, converted to string) which values are the values of function’s arguments (from left to right in the list of arguments). Quantity of these properties-indexes == arguments.length. Values of properties-indexes of the arguments object and present (really passed) formal parameters are shared.
    Example:
    
    1
    2
    3
    4
    5
    6
    7
    8
    9
    10
    11
    12
    13
    14
    15
    16
    17
    18
    19
    20
    21
    22
    23
    24
    25
    26
    27
    28
    29
    30
    31
    32
    33
    34
    35
    function foo(x, y, z) {
      
      // quantity of defined function arguments (x, y, z)
      alert(foo.length); // 3
     
      // quantity of really passed arguments (only x, y)
      alert(arguments.length); // 2
     
      // reference of a function to itself
      alert(arguments.callee === foo); // true
      
      // parameters sharing
     
      alert(x === arguments[0]); // true
      alert(x); // 10
      
      arguments[0] = 20;
      alert(x); // 20
      
      x = 30;
      alert(arguments[0]); // 30
      
      // however, for not passed argument z,
      // related index-property of the arguments
      // object is not shared
      
      z = 40;
      alert(arguments[2]); // undefined
      
      arguments[2] = 50;
      alert(z); // 40
      
    }
      
    foo(10, 20);
    Concerning the last case, in older versions of Google Chrome there was a bug — there parameter z and arguments[2] were also shared.
    
    In ES5 the concept of activation object is also replaced with common and single model of lexical environments.
    
    Phases of processing the context code
    Now we have reached the main point of this article. Processing of the execution context code is divided on two basic stages:
    
    Entering the execution context;
    Code execution.
    Modifications of the variable object are closely related with these two phases.
    
    Notice, that processing of these two stages are the general behavior and independent from the type of the context (i.e. it is fair for both: global and function contexts).
    
    Entering the execution context
    On entering the execution context (but before the code execution), VO is filled with the following properties (they have already been described at the beginning):
    
    for each formal parameter of a function (if we are in function execution context)
    — a property of the variable object with a name and value of formal parameter is created; for not passed parameters — property of VO with a name of formal parameter and value undefined is created;
    
    for each function declaration (FunctionDeclaration, FD)
    — a property of the variable object with a name and value of a function-object is created; if the variable object already contains a property with the same name, replace its value and attributes;
    
    for each variable declaration (var, VariableDeclaration)
    — a property of the variable object with a variable name and value undefined is created; if the variable name is the same as a name of already declared formal parameter or a function, the variable declaration does not disturb the existing property.
    
    Let’s see on the example:
    
    1
    2
    3
    4
    5
    6
    7
    8
    function test(a, b) {
      var c = 10;
      function d() {}
      var e = function _e() {};
      (function x() {});
    }
      
    test(10); // call
    On entering the test function context with the passed parameter 10, AO is the following:
    
    1
    2
    3
    4
    5
    6
    7
    AO(test) = {
      a: 10,
      b: undefined,
      c: undefined,
      d: <reference to FunctionDeclaration "d">
      e: undefined
    };
    Notice, that AO does not contain function x. This is because x is not a function declaration but the function-expression (FunctionExpression, in abbreviated form FE) which does not affect on VO.
    
    However, function _e is also a function-expression, but as we will see below, because of assigning it to the variable e, it becomes accessible via the e name. The difference of a FunctionDeclaration from the FunctionExpression is in detail discussed in Chapter 5. Functions.
    
    And after that there comes the second phase of processing of a context code — the code execution stage.
    
    Code execution
    By this moment, AO/VO is already filled by properties (though, not all of them have the real values passed by us, most of them yet still have initial value undefined).
    
    Considering all the same example, AO/VO during the code interpretation is modified as follows:
    
    1
    2
    AO['c'] = 10;
    AO['e'] = <reference to FunctionExpression "_e">;
    Once again I notice that function expression _e is still in memory only because it is saved to declared variable e. But the function expression x is not in the AO/VO. If we try to call x function before or even after definition, we get an error: "x" is not defined. Unsaved to a variable function expression can be called only with its definition (in place) or recursively.
    
    One more (classical) example:
    
    alert(x); // function
     
    var x = 10;
    alert(x); // 10
     
    x = 20;
     
    function x() {}
     
    alert(x); // 20
    
    Why in the first alert x is a function and moreover is accessible before the declaration? Why it’s not 10 or 20? Because, according to the rule — VO is filled with function declarations on entering the context. Also, at the same phase, on entering the context, there is a variable declaration x, but as we mentioned above, the step of variable declarations semantically goes after function and formal parameters declarations and on this phase do not disturb the value of the already declared function or formal parameter with the same name. Therefore, on entering the context VO is filled as follows:
    

    VO = {};
      
    VO['x'] = <reference to FunctionDeclaration "x">
      
    // found var x = 10;
    // if function "x" would not be already defined 
    // then "x" be undefined, but in our case
    // variable declaration does not disturb
    // the value of the function with the same name
      
    VO['x'] = <the value is not disturbed, still function>
    And then at code execution phase, VO is modified as follows:
    
    VO['x'] = 10;
    VO['x'] = 20;
````
## 不影响VO的
- 函数表达式
- 一个block内的变量或函数

第一个阶段编译
第二个阶段执行
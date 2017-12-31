## 构造函数
- var a = {},是var a = new Object()的语法糖
- var a = [],是var a = new Array()的语法糖
- function Foo(){},是var Foo = new Function(..)的语法糖
- instanceof判断一个函数是否是一个变量的构造函数

## 原型5个原则
1. 所有引用类型(数组，对象，函数)，都具有对象特性，即可以自由扩展属性(null除外),比如obj.a = xx
2. 所有引用类型(数组，对象，函数)，都具有一个__proto__属性，属性值是一个普通的**对象**
3. 所有函数，都具有一个prototype属性，属性值是一个普通的**对象**
4. 所有引用类型(数组，对象，函数)，的__proto__属性值指向它的构造函数的prototype属性值
5. 当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去它的__proto__中寻找。
6. prototype对象的constructor属性指向构造函数

### 补充
1. 原型链上的方法的this指向的是当前调用它的对象。
  
   ````
    function Foo(name) {
        this.name = name;
    }

    Foo.prototype.consoleName = function () {
        console.log(this);
        console.log(this.name);//hello git
    };

    var f = new Foo('hello git');

    f.consoleName();
   ````
2. for ...in...可以获取原型属性，hasOwnProperty不可以。
3. 利用Object构造函数生成的对象的原型的__proto__对象为null
	
	![](https://ws1.sinaimg.cn/large/006tNc79gy1fn00ogx9bgj30hv03v74f.jpg)

## instanceof
![](https://ws1.sinaimg.cn/large/006tNc79gy1fn00xsjdcbj30rq0f676g.jpg)
>f instanceof Foo的判断逻辑是: f的__proto__一层一层往上，能否对应到Foo.prototype

	````
	  function Foo(name) {
        this.name = name;
    }

    Foo.prototype.consoleName = function () {
        console.log(this.name);
    };

    var f = new Foo('hello git');
    f.consoleName();
    console.log(f instanceof Foo);//true
    console.log(f instanceof Object);//true
    
      //路径 f.__proto__找到Foo.prototype，所以(f instanceof Foo)为true
      //Foo.prototype是一个对象，所以Foo.prototype.__proto__指向Object.prototype,所以（f instanceof Object)为true

	````
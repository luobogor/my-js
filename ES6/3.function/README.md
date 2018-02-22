## 默认参数

### 默认参数对arguments对象的影响
- ES5非严格模式下，命名参数的变化会同步更新到arguments对象
- ES5严格模式下，取消了arguments的这个令人感到困惑的行为，无论参数如何变化，arguemnts对象不再随之改变
- ES6中，如果一个函数使用了默认参数值，则无论是否显式定义了严格模式，arguments对象的行为都将与ES5严格模式下保持一致

### 默认参数的临时死区
当执行函数时，参数会被添加到一个专属于函数参数的临时死区（行为与let类似）

````
{
    let x = 'hi';
    //参数声明等价于
    //let x;
    //let y = x;
    // y取到的是形参x，而不是上面值为'hi'的x
    function test(x, y = x) {
        console.log(x, y);//hello hello
    }

    test('hello ');
}

{
    let x = 'hi';
    //注意y取到的是形参x，而不是上面的,即使形参是undefined
    function test(x, y = x) {
        console.log(x, y);//undefined undefined
    }

    test();
}

{
    let x = 'hi';
    //等价于
    //let x = y
    //let y
    //所以报错
    function test(x = y, y) {
        console.log(x, y);
    }

    test();
}
````
> NOTE: 函数参数有自己的作用域和临时死区，其与函数体的作用域是各自独立的，也就是说参数的默认值不可访问函数体内声明的变量。

## 箭头函数
- 没有this、super、arguments和new.target绑定

	这4个值由外围最后一层非箭头函数决定，正是这个原因，箭头函数不能通过call()、apply()、bind()来改变this的值。如果箭头函数不是被非箭头包含，则this的值会被设置为全局对象。

- 不能通过new关键字调用
  
  箭头函数没有[[Constructor]]方法，所以不能被用作构造函数，如果通过new关键字调用函数，程序会抛出错误
 
- 没有原型
 
  由于不可以通过new关键字调用箭头函数，因而没有构建原型的需求，所以箭头函数不存在prototype这个属性 
  ![](https://ws3.sinaimg.cn/large/006tNbRwgy1fop8hp6po7j307d0593yq.jpg)


## 其他
### 尾递归优化
ES6在严格模式下可以进行尾递归优化，非严格模式下不受影响

### 块级函数
ES6中，可以在一个块里声明函数，在非严格模式下是全局有效，严格模式下只在当前块有效，而ES5是不能在块里声明函数的。

### new.target
新增的元属性new.target可以用来检测函数是通过普通调用还是new调用
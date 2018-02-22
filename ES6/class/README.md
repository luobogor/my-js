### 类声名

- 建议在构造函数中创建所有自有属性
- typeof \[ClassName] === "function"
- 类中的方法实际上是\[ClassName].prototype上的一个方法
- 与函数不同的是，类属性不可被赋予新值，也就是说\[ClassName].prototype是一个只读属性

### Why to Use the Class Syntax

Despite the similarities between classes and custom types, there are some important differences to keep in mind:

1. Class declarations, unlike function declarations, are not hoisted. Class declarations act like `let` declarations and so exist in the temporal dead zone until execution reaches the declaration.
2. All code inside of class declarations runs in strict mode automatically. There's no way to opt-out of strict mode inside of classes.
3. All methods are non-enumerable. This is a significant change from custom types, where you need to use `Object.defineProperty()` to make a method non-enumerable.
4. All methods lack an internal `[[Construct]]` method and will throw an error if you try to call them with `new`.
5. Calling the class constructor without `new` throws an error.
6. Attempting to overwrite the class name within a class method throws an error.

### static
static关键字可以声明静态方法，但不可以声明静态变量。可能通过在类名上绑定变量的方法达到静态变量的效果。

### extends&super
使用extends关键字可以指定继承的函数。原型会自动调整，通过调用super()方法即可访问基类的构造函数。

如果在派生类中指定了构造函数则必须要调用super()，如果不这样做程序就会报错。如果选择不使用函数，则当创建新的类实例时会自动调用super()并传入所有参数。

````
class Rectangle {
    constructor(length, width) {
        this.length = length;
        this.width = width;
    }

    getArea() {
        return this.width * this.length;
    }
}

class Square extends Rectangle {
    constructor(length) {
        //必须显式调用super，js不会像java那样自动调用super
        super(length, length);//等价于Rectangle.call(this, length , length)
    }

    //如果不显式写出constructor，则js引擎默认constructor如下
    // constructor(...args){
    //     super(...args)
    // }
}

var square = new Square(3);

console.log(square.getArea());//9
console.log(square instanceof Square);//true
console.log(square instanceof Rectangle);//true
````
- 只能在派生类的构造函数中调用super()
- 在构造函数中访问this之前一定要调用super()，它负责初始化this，否则报错
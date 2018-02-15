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
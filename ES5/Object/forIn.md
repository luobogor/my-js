# for～in
- 遍历所有可枚举的属性，包括继承的属性
- 但是不遍历对象继承的内置方法
- 但是如果开发者重写了内置方法是可以被遍历到的
    
    ````js
    //例如
    var obj = {toString:function () {
          console.log('hello');
    }}
    //除了IE8及更早的版本存在bug，其他浏览器都可以遍历到obj里的被重写的toString方法
    ````
- in 运算符会一直向原型链上查找，包括内置属性也查找
- string就是是不可变的(Immutable) - 它们不能被修改，我们能做的就是基于原string操作后得到一个新string。number对象也是不可变的
````
//比如进行slice操作后statement还是statement，字符串没有被改变
var statement = 'I am an immutable value';
var otherStr = statement.slice(8, 17);
````
> 参考[JavaScript中的不可变性(Immutability)](https://segmentfault.com/a/1190000004906518)
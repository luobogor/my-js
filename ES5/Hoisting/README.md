- 注意变量提升与函数提升
- 注意函数声明与函数表达式的在函数提升区别
````
//函数表达式
var fn1 = function(){
}
//函数声明
function fn2(){}
````

- index.html在函数内不定义变量可直接使用,会被当成全局变量

````
    var foo = {n: 1};
    (function (foo) {
        console.log(foo)
        console.log(foo.n);//如果当前作用域找不到foo，作用域上层继续找
        foo.n = 3;
        var foo = {n: 2};
        console.log(foo.n);
    })(foo);
    console.log(foo.n);
    //输出1,2,3
````

#### Promise.resolve
1. 将传递给它的参数填充（Fulfilled）到promise对象后并返回这个promise对象
````
    Promise.resolve(42).then(function (value) {
        console.log(value);//42
    });
````
2. 将 thenable 对象转换为promise对象
````
    var promise = Promise.resolve($.ajax('/json/comment.json'));// => promise对象
    promise.then(function(value){
       console.log(value);
    });

````
3. Promise.reject与Promise.resolve类似
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

-  Promise#then 不仅仅是注册一个回调函数那么简单，它还会将回调函数的返回值进行变换，创建并返回一个promise对象。
- 实际上 Promise#catch 只是 promise.then(undefined, onRejected); 方法的一个别名而已。 也就是说，这个方法用来注册当promise对象状态变为Rejected时的回调函数。
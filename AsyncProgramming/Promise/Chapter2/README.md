## 淡谈Promise
### Promise.resolve的作用
1. 将传递给它的参数填充（Fulfilled）到promise对象后并返回这个promise对象
````
    Promise.resolve(42).then(function (value) {
        console.log(value);//42
    });
````
2. 将 thenable 对象转换为promise对象
````
    //$.ajax('/json/comment.json')返回的是一个thenable对象
    var promise = Promise.resolve($.ajax('/json/comment.json'));// => promise对象
    promise.then(function(value){
       console.log(value);
    });

````

#### 什么时候该使用Thenable？
许多库都使用了Thenable对象，所以如果要向后兼容之前的已有的库，则将Thenable对象转换为正式Promise的能力显得至关重要了。


### Promise.reject的作用
- Promise.reject与Promise.resolve类似
- 实际上 Promise#catch 只是 promise.then(undefined, onRejected); 方法的一个别名而已。

### Promise#then的作用 
1. 注册一个回调函数
2. 将回调函数的返回值进行变换，创建并返回一个promise对象。

###静态方法
- Promise.resolve
- Promise.reject
- Promise.all
- Promise.race


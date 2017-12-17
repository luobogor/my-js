## 什么时候该使用Thenable？
那么，又是在什么情况下应该使用Thenable呢？
恐怕最可能被使用的是在 Promise类库 之间进行相互转换了。
比如，类库Q的Promise实例为Q promise对象，提供了 ES6 Promises 的promise对象不具备的方法。Q promise对象提供了 promise.finally(callback) 和 promise.nodeify(callback) 等方法。
如果你想将ES6 Promises的promise对象转换为Q promise的对象，轮到Thenable大显身手的时候就到了。


##使用reject而不是throw
Promise的构造函数，以及被 then 调用执行的函数基本上都可以认为是在 try...catch 代码块中执行的，所以在这些代码中即使使用 throw ，程序本身也不会因为异常而终止。
如果在Promise中使用 throw 语句的话，会被 try...catch 住，最终promise对象也变为Rejected状态。
throw与reject使用效果一样，但是如果想把 promise对象状态 设置为Rejected状态的话，使用 reject 方法则更显得合理。
````
var promise = new Promise(function(resolve, reject){
    throw new Error("message");
});

var promise = new Promise(function(resolve, reject){
    reject(new Error("message"));
});
````
#### 使用reject有什么优点
在Chrome开启调试时throw会自动触发调试器的break行为，而reject不会。

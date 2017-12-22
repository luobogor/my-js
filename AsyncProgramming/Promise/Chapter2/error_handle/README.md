## Promise中抛出异常的两种方式
1. throw new Error('message')
  - 原理：在Promise中使用 throw 语句的话，会被 try...catch 住，最终promise对象也变为Rejected状态。
2. reject
````
        var retPromise = new Promise(function (resolve, reject) {
            reject();  
        });
        return retPromise;
````
## 两种方式使用注意事项
- throw会触发浏览器break行为，reject不会。
- 推荐使用reject处理错误
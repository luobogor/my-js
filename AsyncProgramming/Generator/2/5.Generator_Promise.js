let fs = require("fs");
// async、await实现原理
// Define a function to use with the task runner

function readFilePromise(filename) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, 'utf8', function (err, contents) {
            if (err) {
                reject(err);
            } else {
                resolve(contents);
            }
        });
    });
}

function run(taskDef) {

    // create the iterator
    let task = taskDef();

    // start the task, execute readFilePromise
    // result {value:promiseObject, done:false}
    let result = task.next();

    // 以Promise作为通用接口,每个异步操作都返回Promise
    // 递归执行step
    return (function step() {
        //调用Promise.resolve()是为了防止函数不返回Promise
        let promise = Promise.resolve(result.value);

        if (!result.done) {
            return promise.then(function (value) {
                result = task.next(value);
                return step();
            }).catch(function (error) {
                result = task.throw(error);
                return step();
            });
        } else {
            return promise;
        }
    }());
}

// Run a task
// 这个run()函数可以运行所有使用yield实现异步的生成器，而且不会将Promise或返回函数暴露给开发者。
// 事实上由于函数调用的返回值总会被转换成一个Promise，因此可以返回一些非Promise的值，用yield调用同步或异步方法都可以正常运行。
run(function* () {
    const f1 = yield readFilePromise('./TestFile/json1.json');
    const f2 = yield readFilePromise('./TestFile/json2.json');
    console.log('json1.json', f1);
    console.log('json2.json', f2);
    return 'done';
}).then((result)=>{
    console.log("It's done ",result);//"done"
});
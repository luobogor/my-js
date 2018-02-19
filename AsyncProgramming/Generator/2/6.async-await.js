const fs = require('fs');
require("babel-core/register");

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

//async await实现基本上与5.Generator_Promise.js run()方法一致
(async function () {
    //await关键字表示执行的语句应该返回一个Promise，否则，响应应该被包裹在Promise中
    const f1 = await readFilePromise('./TestFile/json1.json');
    //998 在内部被转换成 Promise.resolve(998)
    const promiseTest = await 998;
    console.log('promiseTest:', promiseTest);
    const f2 = await readFilePromise('./TestFile/json2.json');
    console.log('json1.json', f1);
    console.log('json2.json', f2);
    return 'done';
}()).then(result=>{
    console.log("It's done ",result);//"done"
});


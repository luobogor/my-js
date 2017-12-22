var readFilePromise = require('./readFile');
var co = require('co');
//定义Generator时，需要使用function*
// function* Hello() {
//     yield 100;
//     yield  (function () {
//         return 200;
//     });
//
//     return 300;
// }
//
// var h = Hello();
//
// console.log("Generator is", typeof h);
// console.log(h.next());
// console.log(h.next());
// console.log(h.next());
// console.log(h.next());

co(function* () {
    const r1 = yield readFilePromise('../TestFile/json1.json');
    console.log(r1);
    const r2 = yield readFilePromise('../TestFile/json2.json');
    console.log(r2);
    const r3 = yield readFilePromise('../TestFile/json3.json');
    console.log(r3);
});
var fs = require('fs');
var co = require('co');

// {
//     console.log("******************************part1");
//     const thunk = function (fileName, codeType) {
//         return function (callback) {
//             fs.readFile(fileName, codeType, callback);
//         };
//     };
//
//
//     const gen = function* () {
//         const r1 = yield thunk('./TestFile/json1.json');
//         console.log('inner r1:', r1);
//         const r2 = yield thunk('./TestFile/json2.json');
//         console.log('inner r2:', r2);
//     };
//
//     const c = co(gen);
//     c.then(data => {
//         console.log('结束');
//     });
// }


{
    console.log("******************************part2");
    const readFilePromise = function (fileName) {
        return new Promise((resolve, reject) => {
            fs.readFile(fileName, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data.toString())
                }
            })
        })
    };
    const gen = function* () {
        const r1 = yield readFilePromise('./TestFile/json1.json');//co库会自动执行promise.then
        console.log(r1);
        const r2 = yield readFilePromise('./TestFile/json2.json');
        console.log(r2);
    };
    co(gen);
    // console.log(readFilePromise('./TestFile/json1.json').then(function (data) {
    //     console.log(data);
    // }));
}
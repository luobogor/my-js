var fs = require('fs');

const thunk = function (fileName, codeType) {
    return function (callback) {
        fs.readFile(fileName, codeType, callback);
    };
};


const gen = function* () {
    const r1 = yield thunk('../TestFile/json1.json');
    console.log('inner r1:', r1);
    const r2 = yield thunk('../TestFile/json2.json');
    console.log('inner r2:', r2);
};

const g = gen();
// console.log('outer r1:',g.next());
// console.log('outer r2:',g.next());
// console.log('outer r3:',g.next());
g.next().value((err, data1) => {
    //data1是第一个文件的内容，作为参数r1传递过去
    g.next(data1).value((err, data2) => {
        //data2是第一个文件的内容，作为参数r2传递过去
        g.next(data2);
    });
});
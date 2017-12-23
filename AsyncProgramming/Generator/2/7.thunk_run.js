//********************对上一节的next过程封闭到run函数
var fs = require('fs');

const thunk = function (fileName, codeType) {
    return function (callback) {
        fs.readFile(fileName, codeType, callback);
    };
};


const gen = function* () {
    const r1 = yield thunk('./TestFile/json1.json');
    console.log('inner r1:', r1);
    const r2 = yield thunk('./TestFile/json2.json');
    console.log('inner r2:', r2);
};

//自动流程管理的函数
function run(generator) {
    const g = generator();
    function next(err,data) {
        //data相当于r1,r2传递
        const result = g.next(data);
        // result{value:func,done:false/true}
        if(result.done){
            return;
        }
        // result.value 是一个 thunk 函数，需要一个 callback 函数作为参数，而 next 就是一个 callback 形式的函数
        result.value(next);
    }
    // 手动执行以启动第一次 next
    next();
}

run(gen);
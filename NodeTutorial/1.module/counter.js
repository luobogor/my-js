function counter() {
    console.log("I am counter");
}

function adder(a, b) {
    console.log(`The sum is ${a + b}`);
}

//module.exports是一个对象,

// 只导出一个变量时
// module.exports = counter;
//接收
// var counter = require('./counter');

//导出多个变量
module.exports = {
    counter,
    adder
};

// 也可以这样写
// module.exports.counter = function () {
//     console.log("I am counter");
// };
// module.exports.adder = function (a, b) {
//     console.log(`The sum is ${a + b}`);
// };

//接收
//var  stuff = require('./counter');
// stuff.counter();
// stuff.adder(1,5);
//***************总之要认清module.exports是一个对象
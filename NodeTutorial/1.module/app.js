var  stuff = require('./counter');

console.log(__dirname);//当前文件路径
console.log(__filename);//当前文件名
stuff.counter();
stuff.adder(1,5);
// console.log("hello world");
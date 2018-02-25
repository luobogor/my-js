//使用同步方法读写文件
var fs = require('fs');

//(路径，解码方式 二进制->utf8)
// var text =  fs.readFileSync('test.txt', 'utf8');
// console.log(text);
// fs.writeFileSync('writeTest.txt',text);


//删除文件,如果找到不文件有报错
//这是一个异步方法
fs.unlink('writeTest2.txt',function () {
    //do something
});

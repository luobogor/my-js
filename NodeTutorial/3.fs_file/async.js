//使用异步方法读写文件
var fs = require('fs');
//(路径，解码方式 二进制->utf8)
fs.readFile('test.txt', 'utf8',function (error, data) {
    console.log(data);
    fs.writeFile('writeTest2.txt',data);
});

console.log('print me first');
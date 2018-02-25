var fs = require('fs');

var myReadStream = fs.createReadStream(__dirname + '/readme.txt','utf8');
var myWriteStream = fs.createWriteStream(__dirname + '/writeme.txt');
var myWriteStream2 = fs.createWriteStream(__dirname + '/writeme2.txt');


//流->chunk
//监听事件回调
//一个文件分很多小块读取
myReadStream.on('data', function (chunk) {
    console.log('new chunk received:');
    console.log('********************************************');
    console.log(chunk);
    console.log('********************************************');
    myWriteStream.write(chunk);
});

//利用管道同样可以读写
myReadStream.pipe(myWriteStream2);

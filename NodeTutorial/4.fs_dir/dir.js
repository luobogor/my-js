var fs = require('fs');

//************创建目录
//同步方法fs.mkdirSync('stuff');
fs.mkdir('stuff',function () {
    fs.readFile('test.txt', 'utf8', function (error,data) {
        fs.writeFile('./stuff/stuffTest.txt',data);
    });
});

//************删除目录
//删除文件夹前，要先删除所有子文件和子文件夹，删除文件夹方法本身是不能递归删除的。
// fs.unlink('./stuff/stuffTest.txt',function () {
//     fs.rmdir('stuff');
// });
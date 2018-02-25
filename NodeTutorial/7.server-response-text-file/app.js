var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    console.log('request was made:', req.url);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var myReadStream = fs.createReadStream(__dirname + '/readme.txt','utf8');
    //res是一个输出流。
    myReadStream.pipe(res);
});

server.listen(8081, '127.0.0.1');
console.log('I am listening to port 8081.......');

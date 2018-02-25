var http = require('http');

var server = http.createServer(function (req, res) {
    console.log('request was made:', req.url);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hey git');
});

server.listen(8081, '127.0.0.1');
console.log('I am listening to port 8081.......');

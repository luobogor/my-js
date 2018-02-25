var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    console.log('request was made:', req.url);
    switch (req.url) {
        case '/home':
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'});
            var myReadStream = fs.createReadStream(__dirname + '/index.html', 'utf8');
            myReadStream.pipe(res);
            break;
        case '/contact':
            res.writeHead(200, {'Content-Type': 'text/html'});
            var myReadStream = fs.createReadStream(__dirname + '/contact.html', 'utf8');
            myReadStream.pipe(res);
            break;
        case '/api/hello_git':
            res.writeHead(200, {'Content-Type': 'application/json'});
            var data = {
                name: 'helloGit',
                age: '998',
                favorite: 'basketball'
            };
            res.end(JSON.stringify(data));
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/html'});
            var myReadStream = fs.createReadStream(__dirname + '/404.html', 'utf8');
            myReadStream.pipe(res);
            break;
            break;
    }
});

server.listen(8081, '127.0.0.1');
console.log('I am listening to port 8081.......');

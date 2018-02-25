var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    console.log('request was made:', req.url);
    res.writeHead(200, {'Content-Type': 'application/json'});
    var data = {
        name:'helloGit',
        age:'998',
        favorite:'basketball'
    };
    res.end(JSON.stringify(data));
});

server.listen(8081, '127.0.0.1');
console.log('I am listening to port 8081.......');

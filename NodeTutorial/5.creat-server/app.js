const http = require('http');

const server = http.createServer(function (req, res) {
  console.log('request was made:', req.url);

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');

  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });

  // writeHead 优先级更高 header 最终返回
  // Content-Type: text/plain
  // X-Foo: bar

  res.end('Hey git');
});

server.listen(8081, '127.0.0.1');
console.log('I am listening to port 8081.......');

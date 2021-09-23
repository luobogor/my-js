const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  //
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork(); //
  }
} else { //
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`hello world from ${process.pid}\n`);
  }).listen(8000);
  console.log(`Worker ${process.pid} started`);
}

// Node.js 事件循环与多进程
// https://www.bilibili.com/video/BV11q4y1f7jv?p=6

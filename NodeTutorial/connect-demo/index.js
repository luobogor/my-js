const createLogger = require('./logger');
const errorHandler = require('./errorHandler');
const connect = require('connect');

function hello(req, res,next) {
  res.setHeader('Content-Type', 'text/plain');
  // foo(); 触发错误实验
  res.end('Hello World!');
}

connect()
  .use(createLogger(':method :url'))
  .use(hello)
  .use(errorHandler)
  .listen(3008);

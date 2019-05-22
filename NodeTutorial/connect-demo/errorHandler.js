const env = process.env.NODE_ENV || 'development';

// TODO 疑问 connect 怎么知道这是一个错误处理中间件
function errorHandler(err, req, res, next) {
  res.statusCode = 500;
  switch (env) {
    case 'development':
      console.error('Error');
      console.error(err);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(err));
      break;
    default:
      res.end('Server error');
  }
}

module.exports = errorHandler;

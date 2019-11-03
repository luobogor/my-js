const http = require('http')

http.createServer(()=> {
  throw new Error('模拟异常')
}).listen(3000)


// 如果不加以下代码，错误不会被捕获，程序会崩溃
// Node 之所以这样处理是因为，在发生未知错误时，进程的状态就不确定了。之后就可能无法正常工作了，并且如果错误
// 始终不处理的话，就会一直抛出意料这外的错误，这样的很难调试。
process.on('uncaughtException',(err)=> {
  console.log('捕获到错误啦')
  console.error(err)
  // process.exit(1) // 手动退出
})

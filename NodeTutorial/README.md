适用场景：高并发、I/O密集，如请求一个 web 页面。CPU 运算密集场景不适用，如加解密。

有几个 CPU 就可以开几个进程，Node 一个进程只开一个线程

porcess.stdout 控制台

## 全局对象
node 中有两个全局对象

- global 与 window 相似
- process：所有全局执行上下文的内容都在 process 对象中，进程的名字是 process.title

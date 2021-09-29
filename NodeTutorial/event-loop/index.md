## 事件
同步任务 -> nextTTick -> 微任务 -> 宏任务


- timers：执行 setTimeout、setInterval
- I/O callbacks：执行除了 close 事件、定时器、setImmediate 外所有回调，比如 readFileAsync
- idle, prepare: 内部使用？
- poll 等待新的 I/O 事件
- check: 执行 setImmediate 回调
- close：执行 socket.on('close') 这件事件回调


## 资料
- [Node.js 事件循环，定时器和 process.nextTick()](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/)
- [NodeJs 事件循环-比官方翻译更全面](https://cloud.tencent.com/developer/article/1558961)
- [15 尚硅谷 前端面试题 nodejs事件轮询机制](https://www.youtube.com/watch?v=yHnlOAKYxQU&t=2s)

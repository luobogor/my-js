> promise对象的状态，从Pending转换为Fulfilled或Rejected之后， 这个promise对象的状态就不会再发生任何变化。
也就是说，Promise与Event等不同，在.then 后执行的函数可以肯定地说只会被调用一次。
另外，Fulfilled和Rejected这两个中的任一状态都可以表示为Settled(不变的)。


### 任务
- xhr.onerror什么时候触发
- Error对象
- xhr.statusText
- deffered不懂
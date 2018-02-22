## DIY Promise

### resolve

Promise类里的resolve方法之所以要把promise任务队列异步执行，是因为这样可以确保then方法能先完成注册回调到promise任务队列里

### then
promise.then()把回调函数放到promise回调函数队列


### 回调内部handle
- new Promise时
- 内部调用新Promise.then()时

### 队列
- 浏览器异步队列
- 回调队列

### 串联Promise
靠内部调用新Promise的.then进行衔接
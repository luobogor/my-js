# DIY Promise

- Promise类里的resolve方法之所以要把promise任务队列异步执行，是因为这样可以确保then方法能先完成注册回调到promise任务队列里

- 执行Promise构造方法，构造过程中会调用**参数方法**，**参数方法**可以调用resolve。

- promise.then把回调函数放在promise任务队列里。


## 内部new Promise
- 把一个对象压入到任务队列{回调方法，resolve方法}

- bridge promise会帮助原promise对象调用原promise对象的构造参数方法


new Promise回调
then()回调

浏览器异步队列
回调队列
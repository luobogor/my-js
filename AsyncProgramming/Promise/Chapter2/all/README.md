## 对比多个then与Promise.all
>多个then是串行处理而Promise.all是并行处理

##Promise.all与Promise.race
>Promise.all 在接收到的所有的对象promise都变为 FulFilled 或者 Rejected 状态之后才会继续进行后面的处理， 与之相对的是
 
>Promise.race 只要有一个promise对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理。
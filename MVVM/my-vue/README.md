defineProperty

Observer，正如它的名字，Observer就是观察者模式的实现，它用来观察数据的变化，触发消息。


观察者模式

Observer: data.set -> dep.notify -> sub.update -> get

{{name}} 提取 name ，

compileText 将name 与 data.name 关联

new Watcher() 将有name的watcher对象加入监听队列，watcher对象的回调就是用来更新name的view

data里的每个属性都有一个监听队列

数据最终存储在哪里？
Watcher.value
Observer.prototype.defineReactive.val(私有属性)

## 总结

Observer利用Object.defienProperty方法对data进行监听，当data发生变化时，触发set方法。set方法通知观察者列表里面的观察者回调update方法进行视图更新，watcher负责把观察者加入到观察者列表。

![](https://ws3.sinaimg.cn/large/006tNc79gy1fp7slv97x6j30ez06m0tx.jpg)
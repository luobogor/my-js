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
响应式原理共有四个部分，observe、Dep、watcher、Directive

observer可以监听数据的变化

Dep 可以知道数据变化后通知给谁

Watcher 可以做到接收到通知后将执行指令的update操作

Directive 可以把 Watcher 和 指令 连在一起

不同的指令都会有update方法来使用自己的方式更新dom

必须使用watcher触发getter，Dep才会收集依赖

执行流：

当数据触发 setter 时，会发消息给所有watcher，watcher会跟执行指令的update方法来更新视图

当指令在页面上修改了数据会触发watcher的set方法来修改数据

![](https://camo.githubusercontent.com/02bbf419db713e3f7ff66045d95c062d86206ba7/687474703a2f2f70342e7168696d672e636f6d2f743031393762633739666463396663303465662e706e67)
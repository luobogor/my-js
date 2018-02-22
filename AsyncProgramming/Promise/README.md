### 状态
promise对象的状态，从Pending转换为Fulfilled或Rejected之后， 这个promise对象的状态就不会再发生任何变化。
也就是说，Promise与Event等不同，在.then 后执行的函数可以肯定地说只会被调用一次。另外，Fulfilled和Rejected这两个中的任一状态都可以表示为Settled(不变的)。

- Pending

	既不是resolve也不是reject的状态。也就是promise对象刚被创建后的初始化状态等

- Fulfilled

	promise对象被 resolve 时的处理(onFulfilled)

- Rejected

	promise对象被 reject 时的处理(onRejected)

- Done

	Promise标准没有定义Done状态,只定义Pending、Fulfilled、Rejected这三种状态。

### 优劣
#### 优点
- promise的功能是可以将复杂的异步处理轻松地进行模式化， 这也可以说得上是使用promise的理由之一

### PromiseState
内部属性\[[PromiseState]]被用来表示Promise的3种状态。这个属性不暴露在Promise对象上，所以不能以编程的方式检测Promise状态，只有当Promise的状态改变时，通过then()方法来采取特定的行动。

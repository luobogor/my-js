## 什么时候该使用Thenable？
那么，又是在什么情况下应该使用Thenable呢？
恐怕最可能被使用的是在 Promise类库 之间进行相互转换了。
比如，类库Q的Promise实例为Q promise对象，提供了 ES6 Promises 的promise对象不具备的方法。Q promise对象提供了 promise.finally(callback) 和 promise.nodeify(callback) 等方法。
如果你想将ES6 Promises的promise对象转换为Q promise的对象，轮到Thenable大显身手的时候就到了。

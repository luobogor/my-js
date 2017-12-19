- Promise虽然具备了强大的错误处理机制，但是（调试工具不能顺利运行的时候）这个功能会导致人为错误（human error）更加复杂，这也是它的一个缺点。
- 由于Promise的try-catch机制，这个问题可能会被内部消化掉。 如果在调用的时候每次都无遗漏的进行 catch 处理的话当然最好了，但是如果在实现的过程中出现了这个例子中的错误的话，那么进行错误排除的工作也会变得困难。

  
- done 并不返回promise对象(终结 Promise chain)
  - 也就是说，在done之后不能使用 catch 等方法组成方法链
- done 中发生的异常会被直接抛给外面
  - 也就是说，不会进行Promise的错误处理（Error Handling）
  
- 仔细看一下 Promise.prototype.done的代码，我们会发现这个函数什么也没 return 。 也就是说， done按照「Promise chain在这里将会中断，如果出现了异常，直接抛到promise外面即可」的原则进行了处理。
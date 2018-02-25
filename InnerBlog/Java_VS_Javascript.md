## JavaScript VS Java in this

## Java
- 面向堆栈
- 动态作用域
- new：先进入构造函数内部，再分配一块内存，返回内存块的首地址存储在this中
 

##Javascript
- 静态(词法作用域)
- new：调用[[Consturctor]]方法分配好内存后再调用[[call]]将this传到构造函数

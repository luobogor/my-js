### let
  - 块级作用域
  - 不可重复声名
  - 不会被转换成全局属性
  - let声明的函数不会提升（var声明的函数提升为undefined）
  
#### 循环中的let声明
for循环中使用let声明，每次迭代循环都会创建一个新变量，并以之前迭代中同名变量的值将其初始化。循环体是一个子作用域，每次循环都是一个新的子作用域。

````
var funcs = []
//每次循环的时候let声明都会创建一个新变量i，并将其初始化为i的当前值，所以循环内部创建的每个函数都能得到属于它们自己的i的副本
for(let i = 0; i < 10; i++){
    funcs.push(function () {
        console.log(i)
    })
}

console.log('letFor')
funcs.forEach(function (func) {
    func()//输出0到9，不会出现一直输出10的问题
})
````
for~in循环与for循环表现的行为一致。每次循环创建一个新的key绑定，因此每个函数都有一个变量key的副本，于是每个函数都输出不同的值。

> NOTE: let声明在循环内部的行为是标准中专门定义的，它不一定与let的不提升特性相关。

### const
  - 块级作用域
  - 不会被转换成全局属性 
  - 声明时一定要初始化值
  - 初始化后不能更改值

#### 循环中的const声明
ES6中没有明确指明不允许在循环中使用const声明，然而，对于不同类型的循环const会表现出不同的行为。对于普通的for循环来说，可以在初始化变量时使用const，但是因为后面 i++ 试图改变const变量的值，因此会抛出错误。

````
var funcs = []
for(const i = 0; i < 10; i++){//执行一次之后报错
    console.log('in', i)
    funcs.push(function () {
        console.log(i)
    })
}

console.log('constFor')
funcs.forEach(function (func) {
    func()//输出0到9，不会出现一直输出10的问题
})
````

而在 for~in 和 for~of 循环中const与let表现一致，因为每次迭代不会修改已有绑定，而是会创建一个新绑定，因此不会抛出错误

### 临时死区(Temporal Dead Zone)
Javascript引擎在扫描代码发现变量声明时，要么将它们提升至作用域顶部(遇到var声明)，要么将声明放到TDZ中(遇到let和const声明)。访问TDZ上的变量会触发运行时错误。只有执行过变量声明语句后，变量才会从TDZ中移出，然后方可正常访问。

````
if(true) {
    console.log(typeof value)//访问TDZ,报错
    let value = "blue"
}
````

但在let声明的作用域外对该变量作用typeof则不会报错。因为typeof是在声明变量value的代码块外执行的，此时value并不在TDZ中。这也意味着不存在value这个绑定，typeof操作最终返回"undefined"。

````
console.log(typeof value)//"undefined"

if(true){
	let value = "blue"
}
````
 
### 共同点
let和const都有块级作用域，都有临时死区，都不会被转换成全局属性
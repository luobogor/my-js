- 事件处理
- 把条件分支语句提炼成函数

有助于增强代码可读性
````js
// 比如判断夏天时
if(data.getMonth() >=6 && date.getMonth() <= 9){}
// 替换成
if(isSummer()){}

// 如果判断函数时
if(typeof callback === 'function' && callback()){}
// 替换成
if(isFunction(callback) && callback()){}
````

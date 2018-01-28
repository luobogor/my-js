- 进入执行环境，获取解析器分配的内存
- 第一次遍历收集var声名的变量与函数定义，变量值为undefined，
将函数代码放到一个内存[[FunctionLocation]]属性,将所有变量与函数定义存在变量对象中。存储函数代码后，存储方法返回函数的[[scope]]
即使是return语句后的变量定义和函数定义都是有效的。
![](https://ws1.sinaimg.cn/large/006tNc79gy1fn9ldtmnlpj30hh0ajacz.jpg)
- 第二次遍历填充变量对象的值，如果找不到定义则将变量添加到对象变量末端。（不声名变量宽容）
- [[]]表示内部属性，如[[scopes]],[[class]]
## 不影响VO的
- 函数表达式
- 一个block内的变量或函数
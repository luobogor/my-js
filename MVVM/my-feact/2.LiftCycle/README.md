
##核心
javascript对象映射到真实dom节点

流程
1.createClass
2.将构造函数注入createElement
3.将createElement结果及dom窗口注入render执行

##FeactCompositeComponentWrapper与Component的区别
- FeactCompositeComponentWrapper 组件对Component进行解包装，最终产生FeactDOMComponent



FeactCompositeComponentWrapper -> FeactDOMComponent

FeactDOMComponent -> NativeDOM 
- DOM是哪种基本数据结构？树
tagName只有在元素节点上才会有值、nodeName 在所有类型节点上都有值
常用 nodeType 1 元素节点、3 文本节点、9 文档节点(document.nodeType === 9)

## children
标准，Node.childNodes 返回包含指定节点的子节点的集合
非标准，Node.children 返回元素类型节点集合
Node.firstChild / Node.lastChild 返回第一个 / 最后一个节点

详情查阅 《高程》 P288
firstElementChild 获取第一个子元素
lastElementChild 
previousElementSibling
nextElementSibling

## 插入 DOM
- ParentNode.appendChild() 方法将一个节点添加到指定父节点的子节点列表末尾。
- parentNode.insertBefore(sp1, sp2); 将 sp1 插到 sp2 前面
- DOM 只有两个操作插入的方法，insertAfter 结合 nextSibling、insertBefore 实现

## Location对象

![](https://ws1.sinaimg.cn/large/006tKfTcgy1fo8189lre2j30wh08m0ub.jpg)

## 位置

### window
- window.pageOffsetY与window.scrollY相同是整个页面滚动距离,
- innerWidth指的视口宽度，即当前浏览器窗口的宽度，拉伸浏览器窗口这个宽度会发生变化。outerWidth
- outer包括工具栏、滚动条，inner不包括工具栏、滚动条
	- http://www.runoob.com/try/try.php?filename=try_win_innerheight
	- http://www.runoob.com/try/try.php?filename=try_win_outerheight
- scrollX,scrollY
- pageOffsetX,pageOffsetY 整个页面向左/上滚动的距离
- innerWidth,innerHeight
- outerWidth,outerHeight

### screen跟操作系统桌面有关
- screenX返回浏览器左边界到操作系统桌面左边界的水平距离,screenY
- screenLeft,screenTop与screenX,screenY是一样的，应该不是标准，可以无视。

### documentElement: nodeType === 9
- documentElement.scrollTop/Left是**文档内容**超出视口的部分的滚动距离
- documentElement.scrollWidth/Height是指documentElement对象包括超出视口部分的总宽度

### Element: nodeType === 1
- element.scrollTop/Left是**当前元素内容**超出当前元素视口的部分的滚动距离
- element.scrollWidth/Height功能与document对象一样
- element.getBoundingClientRect()

### 共有属性
- clientWidth/Height(固定的，不会随滚动条变化)
- offsetWidth/Height(固定的，不会随滚动条变化)
offsetWidth = clientWidth + 滚动条width

> 以上window、document、element对象提到的属性除了getBoundingClientRect能获取小数，其他的都是四舍五入并返回整数

## 返回所有节点与返回Element节点
previousSibling属性返回元素节点之前的兄弟节点（包括文本节点、注释节点）；
previousElementSibling属性只返回元素节点之前的兄弟元素节点（不包括文本节点、注释节点）；
previousElementSibling属性为只读属性。

### children与childrenNodes的区别 
- children，只返回nodetype === 1的节点
- childrenNodes，返回nodetype === 1 || 2 || 3 的节点

//TODO  elem.DOCUMENT_NODE 也等于 9 （直接判断是不是9兼容性是最好的）


 
### defaultView
 
````
 defaultView属性返回当前 document 对象所关联的 window 对象，如果没有，会返回 null。
 
 console.log(hd.ownerDocument);
 console.log(hd.ownerDocument.defaultView);
 
 //contentDocument获取iframe里的document对象
 console.log(hd.contentDocument);
````
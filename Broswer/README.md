## Location对象

![](https://ws1.sinaimg.cn/large/006tKfTcgy1fo8189lre2j30wh08m0ub.jpg)

## 位置
### document
nodeType === 9

- documentElement.scrollTop/Left是`文档内容`超出视口的部分的滚动距离
- documentElement.scrollWidth/Height是指documentElement对象包括超出视口部分的总宽度

### element
nodeType === 1

- element.scrollTop/Left是`当前元素内容`超出当前元素视口的部分的滚动距离
- element.scrollWidth/Height功能与document对象一样
- `element.getBoundingClientRect()`

### window
- window.pageOffsetX/pageOffsetY与window.scrollX/scrollY是相同的都是整个页面向左/上的滚动距离
- innerWidth指的视口宽度，即当前浏览器窗口的宽度，拉伸浏览器窗口这个宽度会发生变化
- outerWidth包括工具栏、滚动条，inner不包括工具栏、滚动条
	- http://www.runoob.com/try/try.php?filename=try_win_innerheight
	- http://www.runoob.com/try/try.php?filename=try_win_outerheight

### screen
screen属性跟操作系统桌面有关，鼠标事件与window对象上都有这个属性

- screenX返回浏览器左边界到操作系统桌面左边界的水平距离,screenY同理
- screenLeft,screenTop与screenX,screenY是一样的，应该不是标准，可以无视。

### 共有属性
- clientWidth/Height(固定的，不会随滚动条变化)
- offsetWidth/Height(固定的，不会随滚动条变化)

	offsetWidth = clientWidth + 滚动条width

> 以上window、document、element对象提到的属性除了getBoundingClientRect能获取小数，其他的都是四舍五入并返回整数

## 其他

### 节点查询
#### previousSibling与previousElementSibling
- previousSibling属性返回元素节点之前的兄弟节点（包括文本节点、注释节点）
- previousElementSibling属性只返回元素节点之前的兄弟元素节点（不包括文本节点、注释节点）
- previousElementSibling属性为只读属性

#### children与childrenNodes的区别 
- children，只返回nodetype === 1的节点
- childrenNodes，返回nodetype === 1 || 2 || 3 的节点
 
### defaultView
defaultView属性返回当前 document 对象所关联的 window 对象，如果没有，会返回 null。

````
 console.log(hd.ownerDocument);
 console.log(hd.ownerDocument.defaultView);
 
 //contentDocument获取iframe里的document对象
 console.log(hd.contentDocument);
````

### textContent 与 innerText
innerText是IE的私有实现,但也被除FF之外的浏览器所实现,textContent 则是w3c的标准API,现在IE9也实现了。尽量使用textContent,Zepto都是这么做的

- textContent会获取所有元素的content，包括<script>和<style>元素
- innerText不会获取hidden元素的content，而textContent会
- innerText会触发reflow，而textContent不会
- innerText返回值会被格式化，而textContent不会

## HTMLElement.style
HTMLElement.style 属性返回一个 CSSStyleDeclaration 对象，表示元素的 内联style 属性（attribute）

>注意不能通过直接给style属性设置字符串（如：elt.style = "color: blue;"）来设置style，因为style应被当成是只读的（尽管Firefox(Gecko), Chrome 和 Opera允许修改它），这是因为通过style属性返回的CSSStyleDeclaration对象是只读的。

- 单个属性设置

````
elt.style.color = "blue";
````

- 多个属性设置

````
elt.style.cssText = "color: blue; border: 1px solid black";
//或者
elt.setAttribute("style", "color:red; border: 1px solid blue;"); 
````
 
### 移除内联属性
将HTMLElement.style设为null或者空字符串，可以移除内联属性，但是设为undefined并不影响这个属性 
 
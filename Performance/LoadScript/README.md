# 异步加载方式
1. 动态脚本加载
2. defer(按顺序加载)，有 defer 属性的脚本会阻止 DOMContentLoaded 事件，直到脚本被加载并且解析完成。
3. async(随机顺序加载)：动态插入一个脚本默认 async 为 true

# 区别
1. 如果标签同时有defer与async，浏览器会遵从async,忽略defer。

动态创建一个script默认是async

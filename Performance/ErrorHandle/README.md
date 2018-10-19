如何保证你的产品质量，嗯。。。错误监控/\--_--/

### 分类
- 即时运行（包括语法错误）错误处理方式
	1. try..catch
	1. 通过监听window的error事件在冒泡或捕获阶段都可以捕获错误事件

- 资源加载错误
	
	当一项资源（如\<img>或\<script>）加载失败，会该资源元素的error事件，并执行该元素上的onerror()处理函数，`这些error事件不会向上冒泡到window`

	1. object.onerror
	1. performance.getEntries().forEach(item => item.name)
	1. 通过监听window的error事件在捕获阶段捕获资源加载错误事件
	
### 参考
https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onerror

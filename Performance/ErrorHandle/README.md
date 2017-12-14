## 分类
> 即时运行错误
> 1.try..catch
> 2.window.onerror
- 资源加载错误


### 来自MDN的解释
- 当JavaScript运行时错误（包括语法错误）发生时，window会触发一个ErrorEvent接口的error事件，并执行window.onerror()。
- 当一项资源（如<img>或<script>）加载失败，加载资源的元素会触发一个Event接口的error事件，并执行该元素上的onerror()处理函数。这些error事件不会向上冒泡到window，不过（至少在Firefox中）能被单一的window.addEventListener捕获。
- 可自定义一个全局error事件把运行时错误与资源加载错误统一处理
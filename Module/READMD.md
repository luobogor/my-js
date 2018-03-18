## 模块化

- 解决的问题
	
	全局变量污染、函数命名冲突、js文件依赖关系不好管理

- AMD\CommomJS

-- | AMD | CommomJS
---|--- |---
使用环境 | 浏览器 | 服务器
加载方式 | 异步 | 同步
语法 | require加载模块，define定义模块。以path作为加载id，可以在config里定义别名 | require加载模块，export导出模块
加载原理 | 从main.js的依赖路径数组开始，动态插入script标签，向下建立依赖树，直到叶子节点加载完成后，向上回溯将加载好的依赖模块注入到当前模块的回调函数当中执行 | 先进行文件路径确认，再同步加载文件，将当前文件用函数块进行包裹，将当前模块的module对象，export属性以及require函数等其他全局变量，注入到当前模块当中。然后一直向下递归，执行同样的操作，直到叶子节点。回溯的时候`require返回模块的export属性。`

服务器端加载文件快，所以同步加载模块，浏览器为了保证用户体验，使用非阻塞异步加载。

- webpack打包原理

从入口文件开始建立依赖树，为每个模块分配一个ID,对每个模块文件里require参数置换成模块ID。
每个模块都用函数块进行包裹，同时将module,export,require等一些全局变量作为参数注入。
将所有模块函数打包成一个函数数组，这个数组作为参数注入到一个IIFE当中。将这个IIFE返回给客户端。

这个IIFE里面定义一个require函数，然后从数组第一个模块开始执行，就可以递归加载其他模块。
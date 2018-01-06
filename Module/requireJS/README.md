## 入口
- 在window.require或者window.define中注册modules

 ## 流程
 1. init:从<script>标签中获取data-main的src，调用loadJS加载main.js。
 
 -------------------main.js加载中
 2. main.js里执行window.require函数。
 
 -------------------require函数执行中
 3. 将main模块注册到modules中
 4. 将main模块加入loadingsIds队列中，表示main加载中。
 5. 调用loadDepsModuleScript先加载main模块依赖的其他模块。
 
 -------------------loadDepsModuleScript函数执行中
 6. forEach调用loadJS加载main模块依赖的其他模块,并注册_recursiveUpdateModuleState为回调函数。
 
 -------------------_recursiveUpdateModuleState回调执行中
 7.遍历加载队列的所有节点 
 8.比如当前遍历到节点A,依赖B,C。那么遍历A的依赖列表，如果发现B,C都加载完成，就执行A的回调函数。
 9.然后将A的回调结果保存在module[A].exports,然后将A模块的加载状态设置为完成。
 10.递归调用_recursiveUpdateModuleState,即回到第7步
 
 ## 几个地方出现了回调
 1. 执行loadJs加载某模块.js文件后执行了一次回调
   - 该次回调主要工作是检测loadingsIds队列，然后判断每个已注册模块是否可以更新加载状态。
 2. 某模块require或者define完成后执行了一次回调
 
 ## 依赖树
 从main.js出发，树形展开遍历依赖

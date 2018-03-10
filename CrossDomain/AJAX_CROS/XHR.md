- post请求需要设置Content-type:application/x-www-form-urlencoded
- statusText字段，比如status 200对应statusText:"OK"

### 必须说清楚的事
1. readyState 5次变化，但只有4次会触发readyStateChange，无到0不会触发readyStateChange
1. status 状态码 0 ---> 200 || 304 || 400
1. 事件顺序

### 优点
无刷新更新数据
可以把以前一些服务器负担的工作转嫁到客户端，利用客户端闲置的能力来处理，减轻服务器和带宽的负担，节约空间和宽带租用成本。并且减轻服务器的负担
基于标准化的并被广泛支持的技术，不需要下载插件或者小程序。 

### 缺点
阉割了浏览器的History和BACK功能
收藏，发送网址给别人会看到不同的内容 
SEO不好


推荐https://segmentfault.com/a/1190000004322487
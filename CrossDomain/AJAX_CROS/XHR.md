基本原理

Ajax的工作原理相当于在服务器和客户端之间加了一个中间层，由这个中间层操控，使用户操作与服务器端响应异步化。???


````

  //The fetch initiates.
  attribute EventHandler onloadstart;
  attribute EventHandler onprogress;
  //中止已经发送的AJAX请求
  attribute EventHandler onabort;
  
  //The fetch failed.
  attribute EventHandler onerror;
  //The fetch succeeded.
  attribute EventHandler onload;
  //The fetch completed (success or failure).??
  attribute EventHandler onloadend;
  
  //The author specified timeout has passed before the fetch completed.
  //xhr.open之后xhr.timeout = 2000; // 超时时间，单位是毫秒
  attribute EventHandler ontimeout;
  
 ````
 
- 常用content-type
- statusText字段，比如status 200对应statusText:"OK"
- 推荐https://segmentfault.com/a/1190000004322487

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
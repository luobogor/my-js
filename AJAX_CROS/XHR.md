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

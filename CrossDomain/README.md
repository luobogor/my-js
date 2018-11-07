# Some 跨域知识点
 - 源
 > 协+域名(域名 = 子域名+ 主域名)+端口
-  同源策略简单来说就是一个源跟另一个源通信会受到以下限制
   - Cookie、localStorage、IndexDB无法读取 
   - DOM无法获得
   - AJAX请求不能发送

- 前后端通信方式(除了AJAX，其他两种都不受同源策略限制)
  - AJAX
  - WebSocket
  - CORS("跨域资源共享" Cross-origin resource sharing，可以看作是一个可跨域的AJAX,IE10+ support)
 
 - localStorage/cookie在同一域名和端口下是不同页面是可以共享的，而不同页面无法共享sessionStorage的数据
 
### 跨域
- 请求跨域

	1. jsonp(只能处理get请求) 
	2. CORS(Fetch对象是对CORS规范的一种实现)
	
	````
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET, POST, PUT
	````      
  3. 服务器代理
       - 即向同源服务器发送一个请求，然后该服务转发请求到另一个非同源服务器
       
- iframe跨域

   1. Hash 
   1. postMessage
   1. websock

CORS原理

整个CORS通信过程，都是浏览器自动完成，不需要用户参与。对于开发者来说，CORS通信与同源的AJAX通信没有差别，代码完全一样。浏览器一旦发现AJAX请求跨源，就会自动添加一些附加的头信息(header中加入origin字段)，有时还会多出一次附加的请求,使得请求能够跨域。

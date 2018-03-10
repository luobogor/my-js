CORS (Cross-Origin Resource Sharing)

CORS规范中请求头的Origin字段都是浏览器自动添加的，不需要人为设置。

### 服务器端常用配置(以下为SpringMVC配置)

````
public class CrossDomainFilter extends OncePerRequestFilter {
  private static final Logger LOG = LoggerFactory.getLogger(CrossDomainFilter.class);

  private volatile boolean allowCrossDomain = true;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {
    // 设置允许跨域访问
    if(allowCrossDomain){
      response.addHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
	   //response.addHeader("Access-Control-Allow-Origin", "*");
      response.addHeader("Access-Control-Allow-Credentials", "true");

       //Access-Control-Max-Age
       //该字段可选，用来指定本次预检请求的有效期，单位为秒。上面结果中，有效期是20天（1728000秒）
       //即允许缓存该条回应1728000秒（即20天），在此期间，不用发出另一条预检请求。
       //response.addHeader("Access-Control-Max-Age", "60");
       
       
      /**
       * 处理 Preflight 情况下的额外返回数据:
       * Preflighted_requests 需要确认 Preflight 是有效的请求，而不是直接进行的OPTIONS操作.
       */
      //Access-Control-Allow-Methods字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。
      //注意,返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。
      response.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      
      //该字段是一个逗号分隔的字符串，指定浏览器CORS请求会额外发送的头信息字段
	  response.addHeader("Access-Control-Allow-Headers", "X-Access-Token, Cookie,");
    
    }
    if(request.getMethod().equals("OPTIONS")){
    	return ;
    }else{
    	filterChain.doFilter(request, response);
    }
  }

  public void setAllowCrossDomain(boolean allowCrossDomain) {
    this.allowCrossDomain = allowCrossDomain;
  }
}

````

### 简单请求

> 浏览器在request header附带origin:http://www.example.com,服务器返回Access-Control-Allow-Origin:http://www.example.com或者Access-Control-Allow-Origin:*

#### 请求头字段对应关系
浏览器 | 服务器
---|---
Origin:http://www.example.com | Allow-origin:http://www.example.com 或者 *
xhr.withCredentials = true | Access-Control-Allow-Credentials:true
xhr.getResponseHeader('FooBar') | Access-Control-Expose-Headers: FooBar

### 非简单请求
#### 预检阶段请求头字段对应关系
浏览器 | 服务器
---|---
Origin:http://www.example.com | Allow-origin:http://www.example.com 或者 *
xhr.withCredentials = true | Access-Control-Allow-Credentials:true
Access-Control-Request-Method: PUT<br>另外请求头第一行的方法是OPTIONS,如：OPTIONS /cors HTTP/1.1 | Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Request-Headers: X-Custom-Header | Access-Control-Allow-Headers: X-Custom-Header
首次请求60内之内浏览器再发送请求就不需要预检 | Access-Control-Max-Age:60
1. 预检:发送options请求向服务器端询问，当前**网页所在的域名**是否在服务器的许可名单之中，以及可以使用哪些**HTTP动词(GET,POST,PUT,DELETE等等)**和头信息字段(自定义头字段)
> 
````
OPTIONS /cors HTTP/1.1
Origin: http://www.example.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
````

2. **一旦服务器通过了"预检"请求，以后每次浏览器正常的CORS请求，就都跟简单请求一样**，会有一个Origin头信息字段。服务器的回应，也都会有一个Access-Control-Allow-Origin头信息字段。

### 优劣
#### 优点
- CORS支持所有类型的HTTP请求

#### 缺点
- Support IE 10+

参考

http://www.ruanyifeng.com/blog/2016/04/cors.html
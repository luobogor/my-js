# JSONP跨域

## 原理
script标签的资源请求不受同源策略限制，可以通过标签内的src属性发送跨域请求。比如我们平时引入一个jQuery是像下面这样写的。很明显这是一个跨域请求，但浏览器依然可以成功加载。

````
<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.slim.js"></script>
````
## 客户端

````
<script>
    (function () {
        //动态创建脚本标签
        function addScriptTag(src) {
            var script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.src = src;
            document.body.appendChild(script);
        }
        
        window.onload = function () {
            //注意参数callback=foo，服务器端会根据这个参数来返回回调方法foo
            addScriptTag('http://localhost:8081/user/testJSONP?callback=foo');
        };
    })();
  
    //声名全局回调方法
    function foo(data) {
        console.log(data);//打印结果:{data:"我是回调数据"}
    }
</script>
````

## 服务器端
以下是服务器端代码，返回一个方法调用。

````
//SpringMVC
@RequestMapping(value = "/testJSONP", method = RequestMethod.GET)
public String testJSONP(HttpServletRequest request) {
    //获取回调方法名
    String callbackName = request.getParameter("callbackName");
    //拼接回调方法，填充回传数据
    String JSONPCallback = callbackName + "({\"data\": \"我是回调数据\"});";
    return JSONPCallback;
}
````

## 优劣
- 优点
  - 配置简单
  - 兼容性好,很多老式浏览器都支持
- 缺点
  - 只支持GET方法
 
> 参考:[<<浏览器同源政策及其规避方法>>](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)    --阮一峰

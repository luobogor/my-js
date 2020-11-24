// cookie path 与 domain 的区别？

假设 cookie的 domain为 "taobao.com", path为 "/"，则以下规则有效
- 子域： tmall.taobao.com、cdn.taobao.com
- 所有路径：taobao.com/home、taobao.com/:id/post、tmall.taobao.com/:id/post 等等

domain (可选)
例如 'example.com'， '.example.com' (包括所有子域名), 'subdomain.example.com'。如果没有定义，默认为当前文档位置的路径的域名部分 (string或null)。

domain、path 只能设置本域的？

domain 只用于管理子域？

https://segmentfault.com/a/1190000004556040
https://juejin.im/post/59d1f59bf265da06700b0934#heading-10
https://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html

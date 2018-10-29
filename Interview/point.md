## <a name='html'>HTML</a>

- 行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？

		首先：CSS规范规定，每个元素都有display属性，确定该元素的类型，每个元素都有默认的display值，如div的display默认值为“block”，则为“块级”元素；span默认display属性值为“inline”，是“行内”元素。

		（1）行内元素有：a b span img input select strong（强调的语气）
		（2）块级元素有：div ul ol li dl dt dd h1 h2 h3 h4…p
		（3）常见的空元素：<br> <hr> <img> <input> <link> <meta>
			
- 简述一下你对HTML语义化的理解？

	    搜索引擎的爬虫也依赖于HTML标记来确定上下文和各个关键字的权重，利于SEO;
	    使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。

- 页面导入样式时，使用link和@import有什么区别？

		（1）link属于XHTML标签，除了加载CSS外，还能用于定义rel连接属性等作用；@import引用的CSS 会等到页面全部被下载完再被加载
		
            ````
            <link rel="shortcut icon" href="/static/favicon.png">
            <link rel="stylesheet" href="xx.css">
            ````

		（2）页面被加载的时，link会同时被加载，而@import引用的CSS会等到页面被加载完再加载;
		
		（3）link 比 import兼容性好

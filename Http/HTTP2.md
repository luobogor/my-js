## 多路利用
这个总结得比较好
https://blog.csdn.net/sd19871122/article/details/106908140

- 浏览器和服务端建立 TCP 连接后，可以发送多个流（Steam）进行数据传输（也就是发送多个请求），每个流可以发送多条消息（Message），每条消息包含多个帧（Frame）
- 帧的类型包含头部帧（Header，包含请求/响应行、请求/响应头）、数据帧（Data，也就是请求/响应体）等等
- 帧传输是有序的，也就是一定是先头部帧、再到数据帧，但多个流的传输是无序的
- 帧包含的字段：
  - StreamId：所在 Stream 的 ID。因为有 Steam Id，端可以通过帧中的标识知道属于哪个请求。通过这个技术，可以避免 HTTP 旧版本中的队头阻塞问题。
  - ...（次要字段这里不记）

## 头部压缩 HPACK 算法
因为 HTTP 1.1 无状态的特点，所以每次都要发送很多重复和头部，比如 cookie，使得 HTTP 1.1 效率低下。

- 静态字典：使用数字代替常用的头部字段，但这种方式对于取值很广的头部 value 不适用，需要使用哈夫曼编码代替
  ![](https://gitee.com/yejinzhan/images/raw/master/20211002184328.png)
- 动态字典：像 cookie 的值是非固定的，传输一次后可以将这对 key-value 生成一个索引添加到动态表，浏览器和服务端共同维护这个表，以后每次传输只传输索引就可以
- 哈夫曼编码原理：出现概率较大的符号采用较短的编码，出现概率较小的符号采用较长的编码

## 服务端推送

## TODO
为什么 HTTP 1.1 会有队头阻塞问题，看完 TCP 协议再思考

## 参考
[HTTP/2 简介](https://developers.google.com/web/fundamentals/performance/http2?hl=zh-cn#hpack_%E7%9A%84%E5%AE%89%E5%85%A8%E6%80%A7%E5%92%8C%E6%80%A7%E8%83%BD)
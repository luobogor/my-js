## 三次握手
![](https://gitee.com/yejinzhan/images/raw/master/20211003103414.png)

三次握手才能让双方均确认自己和对方的发送和接收能力都正常
第一次握手：客户端只是发送处请求报文段，什么都无法确认，而服务器可以确认自己的接收能力和对方的发送能力正常；

第二次握手：客户端可以确认自己发送能力和接收能力正常，对方发送能力和接收能力正常；

第三次握手：服务器可以确认自己发送能力和接收能力正常，对方发送能力和接收能力正常；

可见三次握手才能让双方都确认自己和对方的发送和接收能力全部正常，这样就可以愉快地进行通信了。


## 四次挥手
[流程图](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS9hNWZjOTRkYy1iMGYyLTRmNjYtOWFkOS00MTBjZTdiMDVkYzEucG5n?x-oss-process=image/format,png)

1. 客户端：我请求发送完了，准备关闭 TCP 连接了，你也准备关闭吧。发送 FIN 报文
2. 服务端：我收到你的报文了，但我现在还不能断开。发送 ACK 报文
3. 服务端：我东西（响应）发送完了，可以断开了。发送 FIN 报文
4. 客户端：我东西（响应）接收完了，准备关闭了，你可以关闭了。发送 ACK 报文。等到一段时间，如果没有接收到服务端的 FIN 报文，就断开连接。因为如果服务端没有接收到 ACK 报文，会重新发 FIN 报文。详情看 youtu 视频 https://www.youtube.com/watch?v=Iuvjwrm_O5g

为什么要四次挥手？为了确保在不可靠的网络链路中，保证可靠的连接断开。

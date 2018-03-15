deferred对象具有的函数属性，并分为两组：

1. 主动触发用来改变状态（成功或者失败）
  - dtd.resolve
  - dtd.reject
2. 状态变化之后才会触发的监听函数
  - dtd.then
  - dtd.done
  - dtd.fail
  
>问题所在：既然是完全不同的两组函数，就应该彻底的分开，否则很容易出现问题。例如在jquery_deferred.html最后一行加上w.reject();
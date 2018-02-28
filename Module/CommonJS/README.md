### example

当前脚本文件 /home/jz/projects/foo.js 执行了 require('bar') ,Node 内部运行过程如下

首先，确定bar模块的绝对路径可能是下面这些位置，依次搜索每一个目录。

````
/home/jz/projects/node_modules/bar
/home/jz/node_modules/bar
/home/node_modules/bar
/node_modules/bar
````

搜索时，Node 先将 bar 当成目录

````
bar/package.json（main字段）
````

如果未成功加载，将 bar 当成文件名，依次尝试加载下面这些文件，只要有一个成功就返回。

````
bar.js
bar.json
bar.node
````

如果还未成功加载，折回bar文件夹查找

````
bar/index.js
bar/index.josn
bar/index.node
````

如果都不成功，说明 bar 可能是目录名，于是依次尝试加载下面这些文件。

````
xxx/.../node_modules/bar/package.json（main字段）
xxx/.../node_modules/bar.js
xxx/.../node_modules/bar/index.js
xxx/.../node_modules/bar/index.json
xxx/.../node_modules/bar/index.node
````

再找不到就抛你一堆异常了
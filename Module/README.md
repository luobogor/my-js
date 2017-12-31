1. 内置模块，如:fs,http等
2. .或..开头的相对路径文件模块，如./example.txt
3. 以/开关的绝对路径模块,如/example/example.txt
4. 自定义模块？？？




- 当前文件目录下的node_modules目录
- 父目录下的node_modules目录
- 父目录的父目录下的node_modules目录
- 沿路径向上逐级查找，直到根目录下的的node_modules目录
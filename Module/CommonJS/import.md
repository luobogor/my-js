1.查找路径
2.找缓存，如何缓存没有就下一步
3.new Module(路径，parent)
4.module.load(路径)
5.filesync()，将exports、require注入到回调函数
6.回朔时就可以拿到exports。
7.cache当前模块

````
Module.prototype.require = function (path) {
    return Module._load(path, this);
};


function Module(id, parent) {
    this.id = id;
    this.exports = {};
    this.parent = parent;
    this.filename = null;
    this.loaded = false;
}



(function (exports, require, module, __filename, __dirname) {

});
````
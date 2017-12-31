var fs = require('fs');

function Module(id, parent) {
    this.id = id;
    this.exports = {};
    this.parent = parent;
    this.children = [];
    this.filename = null;
    this.loaded = false;
}
//
// var module = new Module('filename', 'parent');
// module.exports = Module;

Module.prototype.require = function (path) {
    return Module._load(path, this);
};

Module._load = function (request, parent, isMain) {
    //计算绝对路径
    var filename = Module._resolveFilename(request, parent);
    //缓存
    var cachedModule = Module._cache[filename];
    if(cachedModule){
        return cachedModule.exports;
    }

    //
    if(NativeModule.exists(filename)){
        return NativeModule.require(filename);
    }

    //
    var module = new Module(filename, parent);
    Module._cache[filename] = module;

    try{
        module.load(filename);
        hadException = false;
    }finally {
        if(hadException){
            delete Module._cache[filename];
        }
    }

    return module.exports;
};


Module._resolveFilename = function (request, parent) {
    //如果是内置模块，不含路径返回
    if(NativeModule.exists(request)){
        return request;
    }

    //确定所有可能的路径
    var resolvedModule = Module._resolveLookupPaths(request, parent);
    var id = resolvedModule[0];
    var paths = resolvedModule[1];

    //确定哪一个路径为真
    var filename = Module._findPath(request, paths);
    if(!filename){
        var err = new Error("Cannot find module '" + request + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
    }
    return filename;
}


Module._extensions['.js'] = function (module, filename) {
    //首先，将模块文件读取成字符串，然后剥离 utf8 编码特有的BOM文件头，最后编译该模块。
    var content = fs.readFileSync(filename, 'utf8');
    module._compile(stripBOM(content), filename);
};

Module._extensions['.json'] = function (module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    try {
        module.exports = JSON.parse(stripBOM(content));
    } catch(err){
        err.message = filename + ':' + err.message;
        throw  err;
    }
};

Module.prototype_compile = function (content,filename) {
    var self = this;
    var args = [self.exports, require, self, filename, dirname];
    return compiledWrapper.apply(self, exports, args);
};


(function (exports, require, module, __filename, __dirname) {

});
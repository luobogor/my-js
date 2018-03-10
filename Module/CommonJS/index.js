var fs = require('fs');

function Module(id, parent) {
    this.id = id;
    this.exports = {};
    this.parent = parent;
    this.children = [];
    this.filename = null;
    this.loaded = false;
}

Module.prototype.require = function (path) {
    return Module._load(path, this);
};

/**
 *
 * @param {string} request 开发者传入require函数的文件路径
 * @param {Module对象} parent 父模块
 * @param isMain ??
 * @returns {*} 默认是返回exports对象，当然开发者可以对exports进行任意类型赋值
 * @private
 */
Module._load = function (request, parent, isMain) {
    //*******!!important 计算绝对路径(filename是返回的绝对路径，不只是单单的文件名)
    var filename = Module._resolveFilename(request, parent);

    //  第一步：如果有缓存，取出缓存
    var cachedModule = Module._cache[filename];
    if (cachedModule) {
        return cachedModule.exports;
    }

    // 第二步：是否为内置模块
    if (NativeModule.exists(filename)) {
        return NativeModule.require(filename);
    }

    // 第三步：生成模块实例，存入缓存
    var module = new Module(filename, parent);
    Module._cache[filename] = module;

    //*******!!important 第四步：加载模块
    try {
        module.load(filename);
        hadException = false;
    } finally {
        if (hadException) {
            delete Module._cache[filename];
        }
    }

    // 第五步：输出模块的exports属性
    return module.exports;

}

/**
 *
 * @param {string} request 开发者传入require函数的文件路径
 * @param {Module对象} parent 父模块
 * @returns {string} filename require文件的绝对路径
 * @private
 */
Module._resolveFilename = function (request, parent) {
    //如果是内置模块，不含路径返回
    if (NativeModule.exists(request)) {
        return request;
    }

    //确定所有可能的路径
    var resolvedModule = Module._resolveLookupPaths(request, parent);
    var paths = resolvedModule[1];

    //paths就是在js文件里输出的module.paths，也就是node_modules逐层向上查找的路径数组，例如
    // module.paths:  [ '/Users/jinzhan/Desktop/dev/practiceProject/my-everyting/my-js/Module/hello/node_modules',
    //     '/Users/jinzhan/Desktop/dev/practiceProject/my-everyting/my-js/Module/node_modules',
    //     '/Users/jinzhan/Desktop/dev/practiceProject/my-everyting/my-js/node_modules',
    //     '/Users/jinzhan/Desktop/dev/practiceProject/my-everyting/node_modules',
    //     '/Users/jinzhan/Desktop/dev/practiceProject/node_modules',
    //     '/Users/jinzhan/Desktop/dev/node_modules',
    //     '/Users/jinzhan/Desktop/node_modules',
    //     '/Users/jinzhan/node_modules',
    //     '/Users/node_modules',
    //     '/node_modules' ]

    //确定哪一个路径为真
    var filename = Module._findPath(request, paths);
    if (!filename) {
        var err = new Error("Cannot find module '" + request + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
    }
    return filename;
}


/**
 *
 * @param {string} request 开发者传入require函数的文件路径
 * @param {array} paths 路径数组
 * @private
 */
Module._findPath = function (request, paths) {
    //if(request是绝对路径){
    //  return request
    // }

    // 从路径缓存中查找绝对路径
    // var cacheKey = JSON.stringify({request: request, paths: paths});
    // if (Module._pathCache[cacheKey]) {
    //     return Module._pathCache[cacheKey];
    // }


    //for(path:paths){
    //注意path为 xx/.../node_modules
    //var filename;

    //调用函数获取basePath，即调用require那个js文件的绝对路径


    //下面提到的package.json配置大概长这样
    // {
    //     "name": "appName",
    //     "main": "entryFileName.js"
    // }

    // 注意如果是当前路径下的文件模块，一定要以./开头，否则nodejs会试图去加载核心模块，或node_modules内的模块，正如下面的判断

    // if(request开头是./或者../这种形式){
        //if(检测到request有扩展名是文件){
        //    filename = basePath + request
        //    例如require('./helloGit.js') 匹配 basePath/helloGit.js
        // }else if(./hello/ 这种形式){
        //    如果 hello/pack.json.main 找不到，找 hello/index.js
        // }else ./hello 这种形式{
        //     if(basePath目录存在[request]目录){
        //        if(request目录下存在package.json &&
        //                      package.json有指定main){
        //                 if(main指向的文件存在){
        //                     filename = basePath + request目录 + main指向的文件名
        //                 }else{
        //                     抛出异常
        //                 }
        //              例如require('./helloGit') 匹配 basePath/helloGit/main指向的文件名
        //         }
        //     }else if(basePath目录存在[request].[扩展名]){
        //              filename = basePath + request + .[扩展名]
        //               例如require('./helloGit') 匹配 basePath/helloGit.js ，与显式写扩展名的结果一样
        //      }else if(basePath目录下存在request目录 && request目录下存在index.[扩展名]){
        //			    filename = basePath + request目录 + index.[扩展名]
        //              例如require('./helloGit') 匹配 basePath/helloGit/index.js
        //		}
    // }else 进行非路径形式的文件模块检测{
    //      上文提到path 为 xx/.../node_modules
    //     if(path目录下检测到以[request]命名的文件夹 &&
    //               该文件夹存在package.json &&
    //                  package.json有指定main){
    //                 if(main指向的文件存在){
    //                     filename = path + request目录 + main指向的文件名
    //                     例如require('helloGit') 匹配 path/helloGit/main指向的文件名，即xx/.../node_modules/helloGit/main指向的文件名
    //                 }else{
    //                     抛出异常
    //                 }
    //     }else if(path目录存在[request].[扩展名]){
    //        filename = path + [request].[扩展名]
    //        例如require('helloGit') 匹配 path/helloGit.js
    //     }else if(path目录下检测到以[request]命名的文件夹 && 存在[index].[扩展名]){
    //        filename = path + [request].[扩展名]
    //        例如require('helloGit') 匹配 path/helloGit/index.js
    //     }
    // }

    //将找到的文件路径存入返回缓存，然后返回。否则继续执行循环向上一层文件夹继续查找
    // if (filename) {
    //     Module._pathCache[cacheKey] = filename;
    //     return filename;
    // }

    //}for循环尾部

    //没有找到文件
    // return false
}

Module.prototype.load = function (filename) {
    //对filename进行扩展名判断依次判断.js、.json、.node的_extensions方法进行调用
    //.........
    //extension 可能为 '.js' || '.json' || '.node'
    Module._extensions[extension](this, filename);
    this.loaded = true;
};

/**
 *  读取js文件
 * @param {Module实例化对象} module
 * @returns {string} filename require文件的绝对路径
 */
Module._extensions['.js'] = function (module, filename) {
    //首先，将模块文件读取成字符串
    //*******!!important 注意这里用readFileSync是同步加载文件
    var content = fs.readFileSync(filename, 'utf8');
    //然后剥离 utf8 编码特有的BOM文件头，最后编译该模块
    module._compile(stripBOM(content), filename);
};


Module.prototype._compile = function (content, filename) {
    var self = this;
    var args = [self.exports, require, self, filename, dirname];
    //注入全局变量，执行js
    return compiledWrapper.apply(self, exports, args);
};

//compiledWrapper.apply(self, exports, args) 基本上等价于以下函数
//这也是平时开发中为什么能直接使用这些变量的原因
(function (exports, require, module, __filename, __dirname) {

});
(function (global) {
    //* loadingIds:存放正在加载的模块id，加载完成后需要移除
    //* requestedLoadIds:已经发送过加载脚本请求的模块id。
    //*  modules:存放所有开始加载的模块信息，包括已经处理完成后的模块
    var loadingIds = [], requestedLoadIds = {}, modules = {};

    var basePath = '';
    var init = false;
    var depFlagBase = 0;

    const State = {
        LOADING: 0,
        LOAD_DONE: 1
    };

    var feRequireJs = {};

    feRequireJs.init = function () {
        if (!init) {
            var currentFile = feRequireJs.getCurrentJSPath();
            // currentfile.replace将最后部分的js去掉，例如
            // /a/b/c.js =>  /a/b/
            basePath = currentFile.replace(/[^\/]+\.js/i, '');
            init = true;

            var node = document.getElementsByTagName('script')[0];
            //获取main.js路径
            var mainJs = node.getAttribute('data-main');
            //动态(异步)加载main.js
            feRequireJs.loadJS(mainJs, null);
        }
    };

    //内部方法:异步加载script脚本
    feRequireJs.loadJS = function (url, callback) {
        // 默认情况下动态加载的script标签async=true
        let node = document.createElement('script');
        node.type = "text/javascript";

        //脚本加载完成事件(准确来说是执行完成)
        node.onload = function () {
            // console.log('script ', url, ' execute finished');
            if (callback) {
                callback();
            }
        };
        node.onerror = function () {
            throw Error('load script:' + url + 'failed!');
        };
        node.src = url;

        //
        let head = document.getElementsByTagName('head')[0];
        head.appendChild(node);
    };

    feRequireJs.require = function (depsFileName, callback) {
        let currentJSPath = feRequireJs.getCurrentJSPath();
        //将主模块main注册到modules中
        if (modules[currentJSPath] == null) {//modules[currentJSPath] === null || modules[currentJSPath] === undefined
            let depsPath = depsFileName.map(function (name) {
                return feRequireJs.getJSPathByName(name);
            });
            //将主模块main注册到modules列表中
            modules[currentJSPath] = {
                id: currentJSPath,
                state: State.LOADING,//模块的加载状态
                depsPath,//模块的依赖关系
                callback,//模块的回调函数
                exports: null,//保存执行callback的返回值
                depFlag: 0
            };
            //这里为main入口函数，需要将它的id也加入loadings列表，以便触发回调
            loadingIds.unshift(currentJSPath);
        }

        //加载模块依赖
        feRequireJs.loadDepsModule(currentJSPath);
    };

    //内部方法,返回调用该方法的脚本的<script> 标签的src属性
    feRequireJs.getCurrentJSPath = function () {
        return document.currentScript.src;
    };

    feRequireJs.getJSPathByName = function (name) {
        if (!init) {
            feRequireJs.init();
        }
        return basePath + name + '.js';
    };

    feRequireJs.loadDepsModule = function (currentJSPath) {
        // depPath 指的是依赖js文件的路径
        let depsPath = modules[currentJSPath].depsPath;
        depsPath.forEach(function (path) {
            // requestedLoadIds解决多次发送加载脚本请求的问题
            if (modules[path] == null && requestedLoadIds[path] == null) {
                requestedLoadIds[path] = path;
                feRequireJs.loadJS(path, function () {
                    //加载一个模块完成后，执行回调加载该模块依赖的其他模块。
                    feRequireJs.checkDeps();
                });
            }
        })
    };

    feRequireJs.checkCycle = function (depsPath, id, depFlag) {
        depsPath.forEach((path) => {
            let currentModule = modules[path];
            if (currentModule == null) return;

            if (currentModule.depFlag === depFlag) {
                throw Error('检测到循环依赖');
            } else {
                currentModule.depFlag = depFlag;
            }

            if (currentModule.state === State.LOADING) {
                feRequireJs.checkCycle(currentModule.depsPath, id, depFlag);
            }
        });
    };


    feRequireJs.checkDeps = function () {
        loadingIds.forEach((id, idx) => {
            let obj = modules[id];
            let allLoaded = true;

            //检测循环依赖
            feRequireJs.checkCycle(obj.depsPath, id, depFlagBase++);

            obj.depsPath.some((path) => {
                if (!modules[path] || modules[path].state !== State.LOAD_DONE) {
                    allLoaded = false;
                    //return true可以终止循环
                    return true;
                }
                return false;
            });

            if (allLoaded) {
                loadingIds.splice(idx, 1);
                feRequireJs.fireDepsCallback(obj);
                //***********!!!该模块执行完成后可能使其他模块也满足执行条件了，继续检查，直到没有模块满足allLoaded条件
                feRequireJs.checkDeps();
            }
        });
    };


    //执行依赖模块中的回调方法
    feRequireJs.fireDepsCallback = function (obj) {
        let {id, depsPath, callback} = obj;

        //遍历id模块的依赖，为calllback准备参数
        let params = depsPath.map((dep) => {
            return modules[dep].exports;
        });

        let returnValue = callback.apply(global, params);
        if (returnValue) {
            modules[id].exports = returnValue;
        }
        modules[id].state = State.LOAD_DONE; //标志模块已经加载并执行完成
    };

    feRequireJs.init();
    //对外暴露接口
    global.define = feRequireJs.require;
    global.require = feRequireJs.require;
})(window);

/**
 * @file feRequire
 * 以'_'开头的都是内部方法
 */
(function (global) {
    /**
     * @type {Array} loadingIds:存放加载中的模块id，加载完成后需要移除
     */
    var loadingIds = [],
        /**
         * @type {{}} 存放已经发送过加载脚本请求的模块id。
         */
        requestedLoadIds = {},
        /**
         * @type {{}}  modules:存放所有开始加载的模块信息，包括已经处理完成后的模块
         */
        modules = {};

    /**
     * @type {string} main.js所在目录
     */
    var baseDir = '';
    var init = false;
    var depFlagBase = 0;

    /**
     * @type {{LOADING: number, LOAD_DONE: number}} 模块加载状态
     */
    const STATE = {
        LOADING: 0,
        LOAD_DONE: 1
    };

    /**
     * @type {{}} 方法容器
     */
    var feRequireJs = {};

    /**
     *内部方法,初始化:加载main.js
     */
    feRequireJs._init = function () {
        if (!init) {
            var currentFile = feRequireJs._getCurrentJSPath();
            // currentfile.replace将最后部分的js去掉，例如
            // /a/b/c.js =>  /a/b/
            baseDir = currentFile.replace(/[^\/]+\.js/i, '');
            init = true;

            var node = document.getElementsByTagName('script')[0];
            //获取main.js路径
            var mainJs = node.getAttribute('data-main');
            //动态(异步)加载main.js
            feRequireJs._loadJS(mainJs, null);
            console.log('load main.js have called');
        }
    };

    /**
     * 内部方法,异步加载script脚本
     * @param url {string} 脚本url
     * @param callback {function} 加载完成的回调方法
     */
    feRequireJs._loadJS = function (url, callback) {
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


        let head = document.getElementsByTagName('head')[0];
        head.appendChild(node);
    };

    /**
     *内部方法,返回调用该方法的脚本的<script> 标签的src属性
     */
    feRequireJs._getCurrentJSPath = function () {
        return document.currentScript.src;
    };

    /**
     * 内部方法, 根据模块名返回模块js文件路径
     * @param {string} name 模块名
     * @returns {string}
     */
    feRequireJs._getJSPathByName = function (name) {
        return baseDir + name + '.js';
    };

    /**
     * 外部方法,引入/定义模块
     * @param depsFileName {Array} 当前模块的依赖模块的文件名列表
     * @param callback {function} 模块加载完成回调函数
     */
    feRequireJs.require = function (depsFileName, callback) {
        //获取当前模块js文件路径
        let currentJSPath = feRequireJs._getCurrentJSPath();
        console.log(currentJSPath, ' require have called');
        //将模块注册到modules中
        if (modules[currentJSPath] == null) {//modules[currentJSPath] === null || modules[currentJSPath] === undefined
            //查找出当前模块所依赖的模块的路径
            let depsPath = depsFileName.map(name => feRequireJs._getJSPathByName(name));
            /**
             * 模块对象
             */
            modules[currentJSPath] = {
                id: currentJSPath,//模块js文件路径充当模块id
                state: STATE.LOADING,//模块的加载状态
                depsPath,//当前模块所依赖的模块的路径
                callback,//模块加载完成回调函数
                exports: null,//保存执行callback的返回值
                depFlag: 0
            };
            //将当前模块加入等待列队
            loadingIds.unshift(currentJSPath);
        }
        //加载模块依赖
        feRequireJs._loadDepsModuleScript(currentJSPath);
        console.log(currentJSPath, ' require execute finished');
    };

    /**
     * 内部方法，加载模块依赖
     * @param currentJSPath {string} 当前执行脚本的路径
     */
    feRequireJs._loadDepsModuleScript = function (currentJSPath) {
        // depPath 指的是依赖js文件的路径
        let depsPath = modules[currentJSPath].depsPath;
        depsPath.forEach(function (path) {
            // requestedLoadIds防止多个模块共同引入一个模块时发送多次加载脚本请求
            if (requestedLoadIds[path] == null) {
                requestedLoadIds[path] = path;
                //每加载完一个模块就在回调方法feRequireJs._checkDeps中检测LoadingIds队列，进行模块状态更新
                feRequireJs._loadJS(path, feRequireJs._recursiveUpdateModuleState);
                console.log('load ', path, ' have called');
            }
        });
    };

    /**
     * 内部方法，递归更新模块加载状态
     */
    feRequireJs._recursiveUpdateModuleState = function () {
        loadingIds.forEach((id, idx) => {
            let obj = modules[id];
            let allLoaded = true;

            //检测循环依赖
            feRequireJs._checkCycle(obj.depsPath, id, depFlagBase++);

            allLoaded = obj.depsPath.every((depPath) => {
                //当前模块所依赖的模块已经注册到modules 并且 该依赖已经加载完成
                return modules[depPath] && modules[depPath].state === STATE.LOAD_DONE;
            });

            if (allLoaded) {
                loadingIds.splice(idx, 1);//在等待队列中踢除当前模块
                feRequireJs._fireDepsCallback(obj);//执行当前模块的回调方法
                //***********!!!该模块执行完成后可能使其他模块也满足执行条件了，继续检查，直到没有模块满足allLoaded条件
                feRequireJs._recursiveUpdateModuleState();
            }
        });
    };

    /**
     * 内部方法，执行当前模块的回调函数
     * @param currentModule {obj} 当前模块
     */
    feRequireJs._fireDepsCallback = function (currentModule) {
        let {id, depsPath, callback} = currentModule;

        //遍历id模块的依赖，为calllback准备参数
        let params = depsPath.map(dep => modules[dep].exports);

        let returnValue = callback.apply(global, params);
        if (returnValue) {
            //******保存当前模块的导出，供其他模块使用
            modules[id].exports = returnValue;
        }
        modules[id].state = STATE.LOAD_DONE; //标志模块已经加载并执行完成
    };

    /**
     * 循环依赖检测
     * @param depsPath
     * @param id
     * @param depFlag
     */
    feRequireJs._checkCycle = function (depsPath, id, depFlag) {
        depsPath.forEach((path) => {
            let currentModule = modules[path];
            if (currentModule == null) return;

            if (currentModule.depFlag === depFlag) {
                throw Error('检测到循环依赖');
            } else {
                currentModule.depFlag = depFlag;
            }

            if (currentModule.state === STATE.LOADING) feRequireJs._checkCycle(currentModule.depsPath, id, depFlag);
        });
    };

    //初始化
    feRequireJs._init();
    //对外暴露接口
    global.define = feRequireJs.require;
    global.require = feRequireJs.require;
})(window);

/**
 * @file feRequire
 * @author jinzhanye 20180104
 * 注：以'_'开头的都是内部方法
 */
(function (global) {
    /**
     * @type {Array} 模块等待队列:存放加载中的模块id，加载完成后需要移除
     */
    var loadingIds = [],
        /**
         * @type {{}} 存放已经发送过加载脚本请求的模块id。
         */
        requestedLoadIds = {},
        /**
         * @type {{}}  存放模块
         */
        modules = {};

    /**
     * @type {string} main.js所在目录
     */
    var baseDir = '';

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
        var currentFile = feRequireJs._getCurrentJSPath();
        // currentfile.replace将最后部分的js去掉，例如
        // /a/b/c.js =>  /a/b/
        baseDir = currentFile.replace(/[^\/]+\.js/i, '');

        var node = document.getElementsByTagName('script')[0];
        //获取main.js路径
        var mainJs = node.getAttribute('data-main');
        //动态(异步)加载main.js
        feRequireJs._loadJS(mainJs, null);
        console.log('load main.js have called');
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
            callback && callback();//相当于 if(callback) callback();
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
     * 外部方法,feRequireJS主入口，功能：引入/定义模块
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
        depsPath.forEach((path) => {
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
            let obj = modules[id],
                allLoaded;

            //检测循环依赖
            feRequireJs._checkCycle(obj.depsPath, id, depFlagBase++);

            //*************************************当前模块所依赖的模块已经注册到modules 并且 该依赖已经加载完成
            allLoaded = obj.depsPath.every(depPath => modules[depPath] && modules[depPath].state === STATE.LOAD_DONE);

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
        //由于在_recursiveUpdateModuleState中已经确定当前模块的依赖模块已经加载完成，所以可以获取他们的exports值
        //遍历id模块的依赖，为calllback准备参数
        let params = depsPath.map(depPath => modules[depPath].exports);
        //注入依赖模块，执行模块回调函数
        let returnValue = callback.apply(global, params);
        returnValue && (modules[id].exports = returnValue);
        modules[id].state = STATE.LOAD_DONE; //标志模块已经加载并执行完成
    };

    /**
     * 递归检测循环依赖
     *
     * 检测原理：从当前模块出发遍历依赖树，所到达的节点，如果没有被标记则打上标记，表示该节点已经访问过，
     *                                          如果检测到当前节点已经被打过标记，也就是说在树的遍历中访问了同一个节点两次，则证明被访问两次的节点与第二次他的父亲之间存在循环依赖。
     *
     * 函数递归的终止条件：如果当前模块没有依赖，不会进入depsPath.forEach，自然也不会递，归执行_checkCycle，然后逐层返回。
     * @param depsPath {Array} 当前模块的依赖模块的路径
     * @param id {string} 当前模块的js文件路径
     * @param depFlag {number} 每次_checkCycle被调用前，caller都会生成一个新一depFlag，然后传递给_checkCycle
     */
    feRequireJs._checkCycle = function (depsPath, id, depFlag) {
        depsPath.forEach((path) => {
            //当前模块的依赖模块还没注册就直接返回
            let currentModule = modules[path];
            if (currentModule == null) return;

            if (currentModule.depFlag === depFlag) {
                throw Error('检测到循环依赖');
            } else {
                currentModule.depFlag = depFlag;
            }
            //如果当前遍历模块已经加载完成了，说明这个模块之前已经通过了测循环依赖检测，所以不再递归调用。
            if (currentModule.state === STATE.LOADING) feRequireJs._checkCycle(currentModule.depsPath, id, depFlag);
        });
    };

    //初始化
    feRequireJs._init();
    //对外暴露接口
    global.define = feRequireJs.require;
    global.require = feRequireJs.require;
})(window);

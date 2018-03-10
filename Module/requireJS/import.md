require/define方法参数 依赖路径数组，回调方法

loadingsIds 等待栈

modules 模块对象

````
  modules[currentJSPath] = {
                id: currentJSPath,//模块js文件路径充当模块id
                state: STATE.LOADING,//模块的加载状态
                depsPath,//当前模块所依赖的模块的路径
                callback,//模块加载完成回调函数
                exports: null,//保存执行callback的返回值
            };
````

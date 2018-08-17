// Universal Module Definition 通用模块化解决方案
// 三个步骤
// 1. 判断是否支持 AMD
// 2. 判断是否是支持 CommonJS
// 3. 都不支持则暴露给全局对象

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'underscore'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('jquery'), require('underscore'));
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory(root.jQuery, root._);
    }
}(this, function ($, _) {// 假设这个 module 依赖 jQuery、underscore
    //    方法
    function a(){};    //    私有方法，因为它没被返回 (见下面)
    function b(){};    //    公共方法，因为被返回了
    function c(){};    //    公共方法，因为被返回了

    //    暴露公共方法
    return {
        b: b,
        c: c
    }
}));

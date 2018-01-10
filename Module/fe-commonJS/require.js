(function (modules) {
    var installedModules = {};

    function require(moduleName) {
        if (installedModules[moduleName]) {
            return installedModules[moduleName];
        }

        let currentModule = installedModules[moduleName] = {
            exports: {},
            name: moduleName,
            loaded: false
        };
        //执行当前模块，取得当得模块的exports
        modules[moduleName].call(currentModule.exports, currentModule, currentModule.exports, require);

        currentModule.loaded = true;

        return currentModule.exports;
    }
})({
    "entry":function (module,exports,require,global) {
        //index.js
        let module1 = require("./module1");
        let module2 = require("./module2");

        module1.foo();
        module2.foo();

        function hello() {
            console.log("Hello Git");
        }

        module.exports = hello();
    },

    "./module1": function (module, exports, require, global) {
        let module2 = require("./module2");

        console.log("initialize module1");
        console.log("this is module2.foo() in module1:");
        module2.foo();
        console.log("\n");
        module.exports = {
            foo: function () {
                console.log("module1 foo !!!");
            }
        }
    },

    "./module2": function(module, exports, require, global) {
        console.log("initialize module2");
        module.exports = {
            foo: function() {
                console.log("module2 foo !!!");
            }
        };
    }
});
'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jsBeautify = require('js-beautify');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = _bluebird2.default.promisifyAll(_fs2.default);

var __MODULES = [];

if (process.argv[2]) {
    console.log("start bundle ", process.argv[2]);
} else {
    console.log("No File Input");
}

var outputFile = process.argv[3] || "bundle.js";
pack(process.argv[2]);

function pack(fileName) {
    //fileName.js => fileName
    var name = fileName.replace(/\.js/, "");

    var moduleTemplate = "function (module, exports, require, global) {\n{{moduleContent}}\n}";

    bundleModule(name, './').then(function () {
        console.log(__MODULES);
        return _bluebird2.default.map(__MODULES, replaceRequireWithID);
    }).then(function (moduleContents) {
        console.log("*********************");
        console.log(moduleContents);
        console.log("*********************");
        return '[' + moduleContents.map(function (content) {
            return moduleTemplate.replace(/{{moduleContent}}/, content);
        }).join(',\n') + ']';
    }).then(function (modules) {
        return fs.readFileAsync("packSource.js", "utf8").then(function (content) {
            return content + "(" + modules + ")";
        });
    }).then(_jsBeautify.js_beautify).then(log).then(function (result) {
        return fs.writeFileAsync(outputFile, result);
    }).then(function () {
        return console.log("bundle success");
    });
}

function bundleModule(moduleName, nowPath) {
    var pathNormalized = _path2.default.normalize(nowPath + moduleName + '.js');
    console.log('\n');
    console.log('**now path:', nowPath);
    console.log('moduleName:', moduleName);
    console.log("unNormalized", nowPath + moduleName + '.js');
    console.log("reading:", pathNormalized);
    return fs.readFileAsync(pathNormalized, 'utf8').then(function (content) {
        // console.log("fileContent:", content);

        __MODULES.push(_path2.default.normalize(nowPath + moduleName));
        return content;
    }).then(function (content) {
        return matchRequire(content);
    }) //相当于 content => {return matchRequire(content)}
    .then(function (requires) {
        if (requires.length > 0) {
            //对每个require分别递归打包
            return _bluebird2.default.map(requires, function (requireName) {
                // console.log('path.dirname:', path.dirname);
                console.log('map dir: ');
                console.log('nowPath:', nowPath);
                console.log('moduleName:', moduleName);
                console.log('path.dirname:', _path2.default.dirname(nowPath + moduleName) + "/");

                return bundleModule(requireName, _path2.default.dirname(nowPath + moduleName) + "/");
            });
        } else {
            //所有依赖加载完成，直接返回一个Promise对象
            return _bluebird2.default.resolve();
        }

        //  A common use of Promise.map is to replace the .push+Promise.all boilerplate:
        //             var promises = [];
        //             for (var i = 0; i < fileNames.length; ++i) {
        //                 promises.push(fs.readFileAsync(fileNames[i]));
        //             }
        //             Promise.all(promises).then(function() {
        //                 console.log("done");
        //             });
        //
        // //           *****Using Promise.map:
        //             Promise.map(fileNames, function(fileName) {
        //                 // Promise.map awaits for returned promises as well.
        //                 return fs.readFileAsync(fileName);
        //             }).then(function() {
        //                 console.log("done");
        //             });
    });
}

//解析依赖的模块名:找出所有require语句， require("./module1") => ./module1
function matchRequire(code) {
    var requires = code.match(/require\("\S*"\)|require\('\S*'\)/g) || [];
    //从js文件中匹配require语句，比如 require("./module1")
    // console.log('matchRequire:', requires);

    //去除"require",比如require("./module1") => "./module1"
    // var temp = requires.map(item => item.match(/"\S*"|'\S*'/)[0]);
    // console.log(temp);

    //去掉"号，比如 "./module1" =>  ./module1
    // console.log(temp.map(item => item.substring(1, item.length - 1)));

    return requires.map(function (item) {
        return item.match(/"\S*"|'\S*'/)[0];
    }).map(function (item) {
        return item.substring(1, item.length - 1);
    });
}

function replaceRequireWithID(moduleName) {
    // return fs.readFileAsync(moduleName + '.js', 'utf8')
    //     .then(content => {
    //         return content;
    //     });

    var dirPath = _path2.default.dirname(moduleName) + '/';
    return fs.readFileAsync(moduleName + '.js', 'utf-8').then(function (code) {
        matchRequire(code).forEach(function (item) {
            var regRequire = new RegExp("require\\(\"" + item + "\"\\)|" + "require\\(\'" + item + "\'\\)");
            var modulePath = _path2.default.normalize(dirPath + item);
            var moduleID = __MODULES.indexOf(modulePath);
            code = code.replace(regRequire, "require(" + moduleID + ")");
        });
        return code;
    });
}

function log(packSourceConnected) {
    // console.log(packSourceConnected);
    return packSourceConnected;
}

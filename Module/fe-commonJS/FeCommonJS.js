import Promise from 'bluebird';
import fs_origin from 'fs';
import {js_beautify} from 'js-beautify';
import path from 'path';

var fs = Promise.promisifyAll(fs_origin);

var __MODULES = [];

if (process.argv[2]) {
    //获取命令行第3个参数
    console.log("start bundle ", process.argv[2]);
} else {
    console.log("No File Input");
}

var outputFile = process.argv[3] || "bundle.js";
pack(process.argv[2]);


/**
 *
 * @param {string} entryFilePath 入口文件路径
 */
function pack(entryFilePath) {
    //fileName.js => fileName
    var name = entryFilePath.replace(/\.js/, "");

    //模板
    var moduleTemplate = "function (module, exports, require, global) {\n{{moduleContent}}\n}";

    recursiveBundleModule(name, './')
        .then((promise) => {
            console.log(promise);
            console.log(__MODULES);
            //得到一个按依赖顺序排序的依赖路径数组
            //["a.js","b.js","module/c.js"，etc....]
            return Promise.map(__MODULES, replaceRequireWithID);
        })
        .then(moduleContents => {

            console.log("*********************");
            console.log(moduleContents);
            console.log("*********************");
            //*******************************构建一个函数数组
            return '[' + moduleContents.map(
                content => moduleTemplate.replace(/{{moduleContent}}/, content)).join(',\n') +
                ']';
        })
        .then(modules => fs.readFileAsync("packSource.js", "utf8")
        //*******************************将上一步构建好的数组注入到模板的调用参数位置
            .then(content => content + "(" + modules + ")"))
        .then(js_beautify)
        .then(log)
        .then(result => fs.writeFileAsync(outputFile, result))//输出打包文件
        .then(() => console.log("bundle success"));
}

/**
 *  获取模块路径，然后将所有模块路径存放到__MODULES数组中
 *
 * @param {string} moduleName js文件名作为模块名
 * @param {string} nowPath js文件所在目录
 * @returns {Promise.<TResult>}
 */
function recursiveBundleModule(moduleName, nowPath) {
    var pathNormalized = path.normalize(nowPath + moduleName + '.js');
    console.log('\n');
    console.log('**now path:', nowPath);
    console.log('moduleName:', moduleName);
    console.log("unNormalized", nowPath + moduleName + '.js');
    console.log("reading:", pathNormalized);

    //在__MODULES中注册这个模块名
    __MODULES.push(path.normalize(nowPath + moduleName));

    return fs.readFileAsync(pathNormalized, 'utf8')
        .then(content => matchAllRequires(content))//找出当前模块文件的所有依赖路径
        .then(requiresPath => {//根据依赖路径递归加载依赖模块
            if (requiresPath.length > 0) {
                //对每个require分别递归打包
                return Promise.map(requiresPath, (requireName) => {
                    // console.log('path.dirname:', path.dirname);
                    console.log('map dir: ');
                    console.log('nowPath:', nowPath);
                    console.log('moduleName:', moduleName);
                    console.log('path.dirname:', path.dirname(nowPath + moduleName) + "/");

                    return recursiveBundleModule(requireName, path.dirname(nowPath + moduleName) + "/");
                });
            } else {
                //所有依赖加载完成，直接返回一个Promise对象
                return Promise.resolve('ok');
            }

           /* Promise.map实际上是对下面原生js代码进行封装 */
//  A common use of Promise.map is to replace the .push + Promise.all boilerplate:

//             var promises = [];
//             for (var i = 0; i < fileNames.length; ++i) {
//                 promises.push(fs.readFileAsync(fileNames[i]));
//             }
//             Promise.all(promises).then(function() {
//                 console.log("done");
//             });
//
//            *****Using Promise.map:
//             Promise.map(fileNames, function(fileName) {
//                 // Promise.map awaits for returned promises as well.
//                 return fs.readFileAsync(fileName);
//             }).then(function() {
//                 console.log("done");
//             });
        });
}



/**
 * 解析依赖的模块名:找出当前js文件所有require语句的中依赖文件路径，eg: 匹配出require语句，然后 require("./module1") => ./module1
 *
 * @param {string} code js文件中的代码
 * @returns {Array} 该数组包含当前js文件所有依赖文件的路径
 */
function matchAllRequires(code) {
    var requires = code.match(/require\("\S*"\)|require\('\S*'\)/g) || [];
    //从js文件中匹配require语句，比如 require("./module1")
    // console.log('matchRequire:', requires);

    //去除"require",比如require("./module1") => "./module1"
    // var temp = requires.map(item => item.match(/"\S*"|'\S*'/)[0]);
    // console.log(temp);

    //去掉引号，比如 "./module1" =>  ./module1
    // console.log(temp.map(item => item.substring(1, item.length - 1)));

    return requires
        .map(item => item.match(/"\S*"|'\S*'/)[0])
        .map(item => item.substring(1, item.length - 1));
}

/**
 *  "./module1" 这样的字符串作为模块的唯一识别码，这是一个明显的缺陷，存在多层级文件时，这个名称很容易冲突。
 *  所以用 moduleID 替代 moduleName
 *
 *  过程：
 *  读取js文件内容，将 require("./module1") 转换成 模板所在数组下标
 *
 * @param moduleName 模板名
 * @returns {Promise.<TResult>}
 */
function replaceRequireWithID(moduleName) {
    var dirPath = path.dirname(moduleName) + '/';
    return fs.readFileAsync(moduleName + '.js', 'utf-8')
        .then(code => {
            matchAllRequires(code).forEach(item => {
                var regRequire = new RegExp(
                    "require\\(\"" + item + "\"\\)|" +
                    "require\\(\'" + item + "\'\\)"
                );
                var modulePath = path.normalize(dirPath + item);
                //这句代码是关键，将模块的数组下标作为其唯moduleID
                var moduleID = __MODULES.indexOf(modulePath);
                code = code.replace(regRequire, "require(" + moduleID + ")");
            });
            return code;
        })
}

function log(packSourceConnected) {
    return packSourceConnected;
}





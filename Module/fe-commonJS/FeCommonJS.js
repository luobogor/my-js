import Promise from 'bluebird';
import fs_origin from 'fs';
import {js_beautify} from 'js-beautify';
import path from 'path';

var fs = Promise.promisifyAll(fs_origin);

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

    bundleModule(name, './')
        .then(() => {
            console.log(__MODULES);
            return Promise.map(__MODULES, replaceRequireWithID);
        })
        .then(moduleContents => {
            console.log("*********************");
            console.log(moduleContents);
            console.log("*********************");
            return '[' + moduleContents.map(
                content => moduleTemplate.replace(/{{moduleContent}}/, content)).join(',\n') +
                ']';
        })
        .then(modules => fs.readFileAsync("packSource.js", "utf8")
            .then(content => content + "(" + modules + ")"))
        .then(js_beautify)
        .then(log)
        .then(result => fs.writeFileAsync(outputFile, result))
        .then(() => console.log("bundle success"));
}


function bundleModule(moduleName, nowPath) {
    var pathNormalized = path.normalize(nowPath + moduleName + '.js');
    console.log('\n');
    console.log('**now path:', nowPath);
    console.log('moduleName:', moduleName);
    console.log("unNormalized", nowPath + moduleName + '.js');
    console.log("reading:", pathNormalized);
    return fs.readFileAsync(pathNormalized, 'utf8')
        .then((content) => {
            // console.log("fileContent:", content);

            __MODULES.push(path.normalize(nowPath + moduleName));
            return content;
        })
        .then(content => matchRequire(content))//相当于 content => {return matchRequire(content)}
        .then(requires => {
            if (requires.length > 0) {
                //对每个require分别递归打包
                return Promise.map(requires, (requireName) => {
                    // console.log('path.dirname:', path.dirname);
                    console.log('map dir: ');
                    console.log('nowPath:', nowPath);
                    console.log('moduleName:', moduleName);
                    console.log('path.dirname:', path.dirname(nowPath + moduleName) + "/");

                    return bundleModule(requireName, path.dirname(nowPath + moduleName) + "/");
                });
            } else {
                //所有依赖加载完成，直接返回一个Promise对象
                return Promise.resolve();
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

    return requires
        .map(item => item.match(/"\S*"|'\S*'/)[0])
        .map(item => item.substring(1, item.length - 1));
}


function replaceRequireWithID(moduleName) {
    // return fs.readFileAsync(moduleName + '.js', 'utf8')
    //     .then(content => {
    //         return content;
    //     });

    var dirPath = path.dirname(moduleName) + '/';
    return fs.readFileAsync(moduleName + '.js', 'utf-8')
        .then(code => {
            matchRequire(code).forEach(item => {
                var regRequire = new RegExp(
                    "require\\(\"" + item + "\"\\)|" +
                    "require\\(\'" + item + "\'\\)"
                );
                var modulePath = path.normalize(dirPath + item);
                var moduleID = __MODULES.indexOf(modulePath);
                code = code.replace(regRequire, "require(" + moduleID + ")");
            })
            return code;
        })
}

function log(packSourceConnected) {
    return packSourceConnected;
}





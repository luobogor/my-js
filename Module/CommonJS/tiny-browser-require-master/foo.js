require.register("./foo.js", function(module, exports, require){
    //此处的require是以父文件foo所在目录为根目录
    // var test = require("../abc.js");
    var test = require("./abc.js");
    function hello(x) {
        console.log(x);
    };
});
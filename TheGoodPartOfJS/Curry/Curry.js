//柯里化
//把函数与传递给它的参数相结合
//柯里化是 func.bind(null,args) 的实现原理
Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};

//错误写法
// Function.method('curry', function () {
//     var args = arguments,
//         that = this;
//
//     return function () {
//         return that.apply(null, args.concat(arguments));
//     };
// });

//利用slice方法将arguments转化为数组
Function.method('curry', function () {
    var slice = Array.prototype.slice,
        args = slice.apply(arguments),
        that = this;

    return function () {
        //注意这里的arguments是当前函数的实例，而上面的arguments是curry函数的实例
        return that.apply(null, args.concat(slice.apply(arguments)));
    };
});

function add(a, b) {
    return a + b;
}

var add1 = add.curry(1);//返回一个函数
console.log(add1(6));//7，执行了that.apply(null, args.concat(slice.apply(arguments)));
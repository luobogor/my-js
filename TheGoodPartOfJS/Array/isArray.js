//Javascript本身对于数组和对象的区别是混乱的。typeof运算符报告数组的类型是'object'，这没有任何意义

//有缺陷？？P61
var is_array = function (value) {
    return value &&
        typeof value === 'object' &&
        value.constructor === Array;
};

var is_array_good = function (value) {
    return Object.prototype.toString.apply(value) === '[object Array]';
};


var arr = [1, 2, 3];
var arr2 = new Array(1, 2, 3);


console.log(is_array(arr));//true
console.log(is_array(arr2));//true

console.log(is_array_good(arr));//true
console.log(is_array_good(arr2));//true

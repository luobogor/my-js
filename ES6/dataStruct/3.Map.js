{
    console.log('map支持任何数据类型作为key,这个特性是普通对象没有的');
    let map = new Map();
    let arr = ['123'];
    //set(key,value)
    map.set(arr, 456);
    console.log(map.get(arr));
}

{
    console.log('另一种初始化的方法');
    //[[key,value],[key,value],.....]
    let map = new Map([['a', 123], ['b', 456]]);
    console.log('map args',map);
    //delete,clear方法与Set类似
}


{
    let weakMap = new WeakMap();
    let o = {};
    weakMap.set(o,'hello');
}
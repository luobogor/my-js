{
    //1.属性简易表达
    let a = 'hello';
    let b = 'git';
    let obj1 = {a, b};
    console.log(obj1);

    //2.方法简易表达
    let obj2 = {
        hello() {//这种写法只能是对象里这么写，在外部声明一个函数是不能这么写的
            return 'hello world';
        }
    };
    console.log(obj2);

    //3.属性表达式
    let c = 'expression';
    let obj3 = {//[]表示对里面的表达式求值
        [c]: 'hi'
    };
    console.log(obj3);

    //新增API
    //Object.is与===的功能是一样的
    console.log(Object.is('abc', 'abc'), 'abc' === 'abc');
    console.log('数组',Object.is([],[]),[]===[]);//false , false
    
    //Object.assign是浅拷贝，而且不可枚举和继承的属性都不会拷贝
    //Object.assign(target,src);
    console.log('copy', Object.assign({a: 'a', b: 'b'}, {c: 'c'}));


    //Object.entries
    console.log('entries');
    let test = {a: 123, b: 456};
    //Object.entries返回的是一个数组，数组里面有对象的key与value
    console.log(Object.entries(test));
    for(let [key,value] of Object.entries(test)){
        console.log([key, value]);
    }
}

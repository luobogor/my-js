{
    let obj = {
        time: '2018-01-01',
        name: 'net',
        _r: 123
    };

    let monitor = new Proxy(obj, {
        //拦截对象属性的读取
        get (target, key) {
            return target[key].replace('2018', '2019');
        },
        //拦截对象属性的设置
        set (target, key, value) {
            //以下代码意思是：限制只能设置name属性
            if (key === 'name') {
                return target[key] = value;
            } else {
                return target[key];
            }
        },
        //拦截key in object操作
        has(target, key) {
            if (key === 'name') {
                return target[key];
            } else {
                return false;
            }
        },
        //拦截属性删除
        deleteProperty(target, key) {
            //只允许删除'_'开头的属性
            if (key.indexOf('_') > -1) {
                delete target[key];
                return true;
            } else {
                return false;
            }
        },
        //拦截Object.keys,Object.getOwnPropertySymbols,Object.getOwnPropertyNames
        ownKeys(target) {
            return Object.keys(target).filter(item => item != 'time');
        }
    });

    //**拦截对象属性的读取 测试
    console.log(monitor.time);
    //**拦截对象属性的设置 测试
    monitor.time = '2111';
    console.log(monitor.time);//time并没有被改变
    monitor.name = 'hello git';
    console.log(monitor.name);//name改变了

    //**拦截key in object操作 测试
    console.log('has name', 'name' in monitor);//true
    console.log('has time', 'time' in monitor);//false

    //**删除测试
    // delete monitor.name;
    // console.log('after delete name', monitor.name);
    //
    // delete monitor._r;
    // console.log('after delete time', monitor._r);//删除属性后打印报错

    //**拦截Object.keys测试
    console.log('ownKeys', Object.keys(monitor));//['name','_r']
}
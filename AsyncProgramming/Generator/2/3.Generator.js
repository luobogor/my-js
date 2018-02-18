{
    console.log("*****************************part1");
    let tell = function* () {
        yield 'a';
        yield 'b';
        return 'c';
    };

    let k = tell();

    console.log(k.next());//false
    console.log(k.next());//false
    console.log(k.next());//true，表示后面已经没值可以返回了
    console.log(k.next());//true
    for (let value of tell())
        console.log(value)// 'a','b'
}

{
    console.log("*****************************part2:Generator返回Iterator");
    let obj = {
        //Generator是一个遍历器生成函数
        * [Symbol.iterator]() {
            yield 1;
            yield 2;
            yield 3;
        }
    };

    for (let value of obj) {
        console.log('value', value);
    }
}

{
    console.log("*****************************part3:Generator当状态机使用");
    let state = function* () {
        //不断在A,B,C三个状态循环
        while (1) {
            yield 'A';
            yield 'B';
            yield 'C';//每次执行完状态C之后因为while (1)又重新回到状态A
        }
    };

    let status = state();
    console.log(status.next());
    console.log(status.next());
    console.log(status.next());
    console.log(status.next());
    console.log(status.next());
    console.log(status.next());
}

{
    console.log("*****************************part4:给迭代器传递参数及抛出错误");

    function* createIterator(num) {
        console.log('begin');
        let first = yield num + 1;// 1 + 1
        console.log(first);// 已经被替换成4
        let second;
        try {
            second = yield first + 2;// yield 4 + 2，然后抛出错误
        } catch (ex) {
            second = 6;
        }
        yield second + 3;//6 + 3 = 9
    }

    //通过调用生成器时传递参数给第一次执行yield语句使用。
    let iterator = createIterator(1);
    //因为第一次调用next()方法前不会执行任何yield语句，因此在第一次调用next()方法时传递998没任何作用
    console.log(iterator.next(998));//1,false
    // next()方法的参数4会替代生成器内部上一条yield语句的返回值2
    console.log(iterator.next(4));//6,false
    console.log(iterator.throw(new Error("Boom")));//9,false
    console.log(iterator.next());//undefined,true
}

{
    console.log("*****************************part5:yield*进行Generator嵌套");

    function* G1() {
        yield 'a';
        yield* G2();
        // 如果要返回'z'，将这样操作
        // let res = yield* G2();
        // yield res;
        yield 'b';
        return 'hello';
    }

    function* G2() {
        yield 'x';
        yield 'y';
        return 'z';
    }

    let iteratorG1 = G1();
    for (let item of iteratorG1) {
        console.log(item);//'a','x','y','b'
    }

    let iteratorG2 = G2();
    iteratorG2.next();//'x',false
    iteratorG2.next();//'y',false
    //如果当前生成器不作为委托生成器，可以用next()可以取到return的值
    iteratorG2.next();//'z',true
}


{
    console.log("*****************************part5:Generator作长轮询使用");
    //即不断向服务器发送请求

    //模拟AJAX
    let ajax = function* () {
        yield new Promise(function (resolve, reject) {
            setTimeout(function () {
                //模拟服务器返回数据
                // resolve({code: 1});
                resolve({code: 0});
            }, 200);
        });
        // yield 1;
        // return 2;
    };

    let pull = function () {
        let generator = ajax();//每次都返回新的Generator
        let step = generator.next();//返回{value:Promise对象,done:false}
        console.log(step);
        step.value.then(function (d) {
            if (d.code != 0) {
                setTimeout(function () {
                    console.log('wait');
                    pull();
                }, 1000);
            } else {
                console.log(d);
            }
        });
    };

    pull();
}

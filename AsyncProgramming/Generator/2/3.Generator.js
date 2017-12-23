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
    console.log(k.next());//true
    console.log(k.next());//true
}

{
    console.log("*****************************part2:Generator返回Iterator");
    let obj = {};
    //Generator是一个遍历器生成函数(Generator实际上是一个对象不是函数)
    obj[Symbol.iterator] = function* () {
        yield 1;
        yield 2;
        yield 3;
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
    console.log("*****************************part4:Async Await只是Generator的一个语法糖，功能是一样的");
    //****注意这里要打补丁才能执行

    // let state = async function() {
    //     while (1) {
    //         await 'A';
    //         await 'B';
    //         await 'C';
    //     }
    // };
    //
    // let status = state();
    // console.log(status.next());
    // console.log(status.next());
    // console.log(status.next());
    // console.log(status.next());
    // console.log(status.next());
    // console.log(status.next());
}

{
    console.log("*****************************part5:yield*进行Generator嵌套");

    function* G1() {
        yield 'a';
        yield* G2();
        yield 'b';
    }

    function* G2() {
        yield 'x';
        yield 'y';
    }

    for (let item of G1()) {
        console.log(item);
    }
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

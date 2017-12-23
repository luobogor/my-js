{
    console.log("*****************************part1");
    //Symbol()的作用生成一个独一无二的值，有点像UUID
    let a1 = Symbol();
    let a2 = Symbol();
    console.log('a1:', a1);
    console.log('a2:', a2);
    console.log(a1 === a2);//false
    //想将独一无二的值保存以后再用可以用Symbol.for();
    let a3 = Symbol.for('a3');
    let a4 = Symbol.for('a3');
    console.log('a3:', a3);
    console.log('a4:', a4);
    console.log(a3 === a4);//true
}

{
    console.log("*****************************part2");
    let a1 = Symbol.for('abc');
    let obj = {
        [a1]: '123',
        'abc': 345,
        'c': 998
    };
    console.log('obj:', obj);

    //1.一般的for循环无法拿到对象中Symbol属性
    for (let [key, value] of Object.entries(obj)) {
        console.log('let of', key, value);
    }

    //2.Object.getOwnPropertySymbols可以拿到对象中Symbol属性
    Object.getOwnPropertySymbols(obj).forEach(function (item) {
        console.log(obj[item]);//123
    });

    //Reflect.ownKeys可以拿到所以属性
    Reflect.ownKeys(obj).forEach(function (item) {
        console.log('ownKeys:', item, obj[item]);
    });
}

{

}
//rest参数
{
    //参数变成了一个数组，与ES5中的arguments相似
    //rest参数只能有一个，后面不能再跟参数
    function test(...arg) {
        console.log('rest');
        arg.forEach(function (item) {
            console.log(item);
        });
    }

    test(1, 2, 3, 4, 'a');
    //...解构数组
    test(...[1, 2, 3, 4, 'a']);
}
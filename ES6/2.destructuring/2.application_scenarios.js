//应用场景
{
    console.log('1.数值交换');
    let a = 1, b = 2;
    [a, b] = [b, a];
    console.log(a, b);//2,1
}

{
    console.log('2.接收函数数组返回值_1');

    function f() {
        return [1, 2];
    }

    let a, b;
    [a, b] = f();
    console.log(a, b);//1,2

    //旧方法如下，比较繁琐
    // var array = f();
    // logic_expression = array[0];
    // b = array[1];
}

{
    console.log('3.接收函数数组返回值_2');

    function f() {
        return [1, 2, 3, 4, 5, 6];
    }

    let a, b;
    [a, , , b] = f();
    console.log(a, b);//1,4
}

{
    console.log('4.接收函数数组返回值_3');

    function f() {
        return [1, 2, 3, 4, 5, 6];
    }

    let a, b, rest;
    [a, b, ...rest] = f();
    console.log(a, b, rest);//1,2,[3,4,5,6]

    // 旧方法如下，比较繁琐
    // var array = f();
    // logic_expression = array[0];
    // b = array[1];
    // rest = array.xxxx
}

{
    console.log('5.提取服务器端返回的json');
    //假设这是服务器端返回的json对象
    let serverData = {
        title: 'title1',
        test: [{
            title: 'title2',
            desc: 'description'
        }]
    };

    //结构与serverData一致，声名outerTitle,innerTitle变量
    let {title: outerTitle, test: [{title: innerTitle}]} = serverData;
    console.log('outerTitle', outerTitle);
    console.log('innerTitle', innerTitle);
}
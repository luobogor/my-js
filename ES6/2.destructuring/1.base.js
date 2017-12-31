//语法基础
{
    console.log('数组解构赋值1');
    let a, b;
    [a, b] = [1, 2];
    console.log(a, b);
}

{
    console.log('数组解构赋值2');
    let a, b, rest;
    [a, b, ...rest] = [1, 2, 3, 4, 5, 6];
    console.log(a, b, rest);//rest变成了一个数组 1,2,[3,4,5,6]
}

{
    console.log('数组解构赋值3');
    let a, b, c;
    //设置默认值
    [a, b, c = 3] = [1, 2];
    //如下例子，c找不到匹配所以是undefined
    // [logic_expression, b, c] = [1, 2];

    console.log(a, b, c);//1,2,3
}

{
    console.log('对象解构赋值1');
    let a, b;
    ({a, b} = {a: 1, b: 2});
    //左边标签符要与右边对象的属性名称一致，否则会赋值失败。如下例子是不行的。
    // ({logic_expression, b} = {fieldA: 1, fieldB: 2});
    // ({a1, b1} = {logic_expression: 1, b: 2});
    console.log(a, b);//1,2
}

{
    console.log('对象解构赋值2');
    let a, b;
    //设置默认值
    ({a, b=100} = {a: 1});
    console.log(a, b);//1,100
}

{
    console.log('对象解构赋值3：一种比较常见的写法');
    //从右侧对象中提取a
    const {a} = {b: 'bbb', a: 'aaa'};
    //相当于
    // const a = {b: 'bbb', a: 'aaa'}.a;
    console.log(a);//aaa
}


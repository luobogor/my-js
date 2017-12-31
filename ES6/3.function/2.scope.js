{
    let x = 'hi';
    //注意y取到的是形参x，而不是上面的
    function test(x, y = x) {
        console.log(x, y);//hello hello
    }

    test('hello ');
}

{
    let x = 'hi';
    //注意y取到的是形参x，而不是上面的,即使形参是undefined
    function test(x, y = x) {
        console.log(x, y);//undefined undefined
    }

    test();
}

{
    let x = 'hi';
    function test(a, y = x) {
        console.log(a, y);//hello hi
    }

    test('hello ');
}
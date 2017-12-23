let A = 123;

function test() {
    console.log('test');
}

class Hello {
    test() {
        console.log('class');
    }
}

export default {
    A,
    test,
    Hello
}
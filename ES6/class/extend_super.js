class Rectangle {
    constructor(length, width) {
        this.length = length;
        this.width = width;
    }

    getArea() {
        return this.width * this.length;
    }
}

class Square extends Rectangle {
    constructor(length) {
        //必须显式调用super，js不会像java那样自动调用super
        super(length, length);//等价于Rectangle.call(this, length , length)
    }

    //如果不显式写出constructor，则js引擎默认constructor如下
    // constructor(...args){
    //     super(...args)
    // }
}

var square = new Square(3);

console.log(square.getArea());//9
console.log(square instanceof Square);//true
console.log(square instanceof Rectangle);//true
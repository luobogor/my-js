//**使用ES5模拟静态方法
//在构造函数上绑定静态方法
{
    function PersonType(name) {
        this.name = name;
    }

// static method
    PersonType.create = function(name) {
        return new PersonType(name);
    };

// instance method
    PersonType.prototype.sayName = function() {
        console.log(this.name);
    };

    var person = PersonType.create("Nicholas");
}


//**ES6 static关键字声名静态方法
// static不能声名静态变量，可以将变量绑定在class上模拟静态变量
{
    class PersonClass {

        // equivalent of the PersonType constructor
        constructor(name) {
            this.name = name;
        }

        // equivalent of PersonType.prototype.sayName
        sayName() {
            console.log(this.name);
        }

        // equivalent of PersonType.create
        static create(name) {
            return new PersonClass(name);
        }
    }

    let person = PersonClass.create("Nicholas");
}
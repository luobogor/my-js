//ES6 Class
class PersonClass {

    // equivalent of the PersonType constructor
    constructor(name) {
        this.name = name;
        // PersonClass = "hello"; 报错：TypeError: Assignment to constant variable.
    }

    // equivalent of PersonType.prototype.sayName
    sayName() {
        console.log(this.name);
    }
}

let person = new PersonClass("Nicholas");
person.sayName();   // outputs "Nicholas"

console.log(person instanceof PersonClass);     // true
console.log(person instanceof Object);          // true

console.log(typeof PersonClass);                    // "function"
console.log(typeof PersonClass.prototype.sayName);  // "function"

console.log(PersonClass.prototype);
PersonClass.prototype = {};//严格模式下报错，非严格模式下修改无效，不报错
console.log('******************');
console.log(PersonClass.prototype);

PersonClass = "hello"; //可以修改
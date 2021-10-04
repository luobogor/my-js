//ES6 不用Class关键字模仿Class
//direct equivalent of PersonClass

let PersonType2 = (function () {

    "use strict";

    //const确保从内部无法修改类名
    const PersonType2 = function (name) {

        console.log('new.target:', new.target);
        // make sure the function was called with new
        if (typeof new.target === 'undefined') {
            throw new Error("Constructor must be called with new.");
        }

        this.name = name;

        // PersonType2 = "hello"; 报错：TypeError: Assignment to constant variable.
    };

    Object.defineProperty(PersonType2.prototype, "sayName", {
        value: function () {

            // make sure the method wasn't called with new
            if (typeof new.target !== "undefined") {
                throw new Error("Method cannot be called with new.");
            }
            console.log(this.name);
        },
        enumerable: false,
        writable: true,
        configurable: true
    });

    return PersonType2;
}());

let person = new PersonType2("Nicholas");
person.sayName();   // outputs "Nicholas"

console.log(person instanceof PersonType2);     // true
console.log(person instanceof Object);          // true

console.log(typeof PersonType2);                    // "function"
console.log(typeof PersonType2.prototype.sayName);  // "function"

PersonType2 = "hello"; //可以修改

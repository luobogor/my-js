var events = require('events');
var util = require('util');

var Person = function (name) {
    this.name = name;
};

util.inherits(Person, events.EventEmitter);

var james = new Person('james');
var mary = new Person('mary');
var nack = new Person('nack');

[james, mary, nack].forEach(function (person) {
    person.on('say', function (msg) {
        console.log(person.name + ' say:' + msg);
    });
});

james.emit('say', 'hello world');
mary.emit('say', 'hello baby');
nack.emit('say', 'hello git');

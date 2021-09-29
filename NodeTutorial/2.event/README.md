- node自定义事件

````
//nodeJS内置模块events
var events = require('events');
var myEmitter = new events.EventEmitter();

myEmitter.on('someEvent', function (msg) {
    console.log(msg);
});

myEmitter.emit('someEvent', 'the event was emitted');
````

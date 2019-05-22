//nodeJS内置模块events
var events = require('events');
var myEmitter = new events.EventEmitter();

// once 接收一次后解绑
// removeListener 与 js事件相似
myEmitter.on('someEvent', function (msg) {
    console.log(msg);
});

myEmitter.emit('someEvent', 'the event was emitted');

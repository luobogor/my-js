console.log('get in a.js');

// define(['b'], function (b) {
define([], function () {
    console.log('a.js callback');
    return 0.5;
});

console.log('out a.js');

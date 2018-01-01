console.log('a.js load finished');

// define(['b'], function (b) {
define([], function () {
    console.log('a.js callback');
    return 0.5;
});
console.log('main.js load finished');
require(['c'], function (cValue) {
    console.log('main.js callback');
    console.log(100 * cValue);
});
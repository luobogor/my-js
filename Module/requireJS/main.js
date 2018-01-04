console.log('get in main.js');
require(['c'], function (cValue) {
    console.log('main.js callback');
    console.log(100 * cValue);
});
console.log('out main.js');

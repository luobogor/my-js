console.log('get in b.js');

define(['a'], function (aValue) {
    console.log('b.js callback');
    console.log(aValue);
    return 2;
});

console.log('out b.js');

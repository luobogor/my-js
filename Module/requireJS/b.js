console.log('b.js load finished');

define(['a'], function (aValue) {
    console.log('b.js callback');
    console.log(aValue);
    return 2;
});
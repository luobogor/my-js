console.log('c.js load finished');

define(['a', 'b'], function (aValue, bValue) {
    console.log('c.js callback');
    console.log(aValue * bValue);
    return aValue * bValue;
});
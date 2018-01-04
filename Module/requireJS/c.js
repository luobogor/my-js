console.log('get in c.js');

define(['a', 'b'], function (aValue, bValue) {
    console.log('c.js callback');
    console.log(aValue * bValue);
    return aValue * bValue;
});

console.log('out c.js');

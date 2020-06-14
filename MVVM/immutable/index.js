const { Map } = require('immutable');


const map1 = Map({
  a: 1,
  b: 2,
  c: 3
});


const map2 = map1.set('b', 50);

console.log(map1)
console.log(map2)

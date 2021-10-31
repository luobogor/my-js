const fs = require('fs')

setImmediate(() => {
  console.log('setImmediate')
})

setTimeout(() => {
  console.log('setTimeout')
}, 0)

setTimeout(() => {
  console.log('setTimeout1')
},1)


fs.readFile('./test', () => {
  console.log('readFile callback')

  setTimeout(() => {
    console.log('次轮循环 readFile callback setTimeout0')
  },0)

  setImmediate(() => {
    console.log('次轮循环 readFile callback setImmediate')
  })

  process.nextTick(() => {
    console.log('process.nextTick file')
  })
})

new Promise((resolve) => { resolve('promise resolved') }).then(res => console.log(res));

process.nextTick(() => {
  console.log('process.nextTick')
})

console.log('sync')

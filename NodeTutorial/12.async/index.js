setImmediate(() => {
  console.log('setImmediate');
});

setTimeout(() => {
  console.log('setTimeout');
}, 0);

process.nextTick(() => {
  console.log('nextTick1');
  process.nextTick(() => {
    console.log('nextTick2');
  });
});


// 打印顺序
// nextTick1
// nextTick2
// setTimeout
// setImmediate
// 优先级 nextTick > setTimeout > setImmediate

const path = require('path')
const cp = require('child_process');

// https://www.youtube.com/watch?v=eWn4xATRwCA

// exec 内部调用 execFile
// cp.exec('ls -al', function (err, stdout, stderr) {
//   console.log(err)
//   console.log(stdout)
//   console.log(stderr)
// })

// 需要执行 chmod +x ./test.shell 添加权限
// execFile 内调调用 spawn
// cp.execFile(path.resolve(__dirname, 'test.shell'), ['-al', '-bl'], function (err, stdout, stderr) {
//   console.log(err)
//   console.log(stdout)
//   console.log(stderr)
// })


const child = cp.spawn(path.resolve(__dirname, 'test.shell'), ['-al', '-bl'], {
  cwd: './'
})

child.stdout.on('data', function (chunk) {
  console.log('data:', chunk.toString())
})

child.stderr.on('data', function (chunk) {
  // 比如将命令 ls 写成 lss 就会触发 stderr
  console.error('err:', chunk.toString())
})

console.log('child process')

console.log('child pid:', process.pid)

process.on('message', (msg) => {
  console.log('child process receive:', msg)
})

process.send('hello main process')

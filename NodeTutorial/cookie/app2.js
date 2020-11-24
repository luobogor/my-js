const express = require('express');
const cookieParser = require('cookie-parser')

const users = [
  { id: 1, name: 'yej', email: 'yjz@gmail.com', password: '123456' },
  { id: 2, name: 'yjz2', email: 'yjz2@gmail.com', password: '123456' },
  { id: 3, name: 'yjz3', email: 'yjz3@gmail.com', password: '123456' }
]

const sessions = {}

function generateSession(req, cookieOptions) {
  const sessionKey = req.cookies[cookieOptions.name]
  if (sessions[sessionKey]) {
    return sessions[sessionKey]
  }


  const newKey = `key_${Date.now()}`
  sessions[newKey] = {}

  res.cookie(cookieOptions.name, newKey, {
    maxAge: cookieOptions.maxAge,
    // .....
  })

  return sessions[newKey]
}

app.use(cookieParser())

app.use((req, res, next) => {
  req.session = generateSession(req, {
    name: 'yjz-session',
    // 过期时间：1 小时过期
    maxAge: 60 * 60 * 1000,
  });

  const { userId } = req.session
  if (userId) {
    res.locals.user = users.find(user => user.id === userId)
  }

  next()
})

app.post('/login', (req, res) => {
  const { email, password } = req.body
  if (email && password) {
    const user = users.find((user) => {
      return user.email === email && user.password === password;
    })

    if (user) {
      req.session.userId = user.id
    }
  }

  res.send('invalidate account.')
})

app.get('/profile', (req, res) => {
  const { user } = res.locals
  if (user) {
    res.send(user)
    return
  }

  res.send('please login.')
})

app.listen(3901, () => {
  console.log('I am listening port 3901...');
});

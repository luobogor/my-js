const express = require('express');
const todoController = require('./controllers/todoControllers');
const bodyParser = require('body-parser');
const session = require('express-session')
const app = express()

// https://www.youtube.com/watch?v=OH6Z0dJ_Huk&t=1236s

app.use(bodyParser.urlencoded({
  extended: true
}))

//设置模板引擎
//nodejs默认在views文件夹寻找view模块，所以要建一个文件夹命名为'views'
app.set('view engine', 'ejs');

//利用中间件配置静态资源请求
app.use(express.static('./public'));
// app.use('/assets',express.static('./public'));

const SESS_NAME = 'sid'

app.use(session({
  secret: `quiet, pal! it's a secret!`,
  resave: false,
  saveUninitialized: false,
  name: SESS_NAME,
  cookie: {
    // 1 小时过期
    maxAge: 60 * 60 * 1000,
    sameSite: true,
    // secure: true
  }
}))

const users = [
  { id: 1, name: 'yejz', email: 'yejz@gmail.com', password: '123456' },
  { id: 2, name: 'yejz2', email: 'yejz2@gmail.com', password: '123456' },
  { id: 3, name: 'yejz3', email: 'yejz3@gmail.com', password: '123456' }
]

app.use((req, res, next) => {
  const { userId } = req.session
  // locals 是 express 提供的 https://expressjs.com/en/api.html
  if (userId) {
    res.locals.user = users.find(user => user.id === userId)
  }

  next()
})

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/login')
  } else {
    next()
  }
}

const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/home')
  } else {
    next()
  }
}

app.get('/', redirectHome, (req, res) => {
  // console.log(req.session)
  const { userId } = req.session
  // console.log(req.session.id)


  res.send(`
  <div>
    <h1>Welcome!</h1>
    ${
    userId ?
      `<a href="/home">Home</a>
       <form method="post" action="/logout">
         <button>Logout</button>
       </form>` :
      `<a href="/login">Login</a>`
    }
  </div>`)
})

app.get('/home', redirectLogin, (req, res) => {
  const { user } = res.locals

  res.send(`
    <h1>Home</h1>
    <a href="/">Main</a>
    <ul>
      <li>Name: ${user.name}</li>
      <li>Email: ${user.email}</li>
    </ul>
  `)
})

app.get('/login', redirectHome, (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form method="post" action="/login">
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <input type="submit"/>
    </form>  
  `)
})

app.post('/login', redirectHome, (req, res) => {
  const { email, password } = req.body
  if (email && password) {
    const user = users.find((user) => {
      return user.email === email && user.password === password;
    })

    if (user) {
      req.session.userId = user.id
      return res.redirect('/home')
    }
  }
})

app.get('/profile', redirectLogin, (req, res) => {
  const { user } = res.locals
  res.send(user)
})

app.post('/logout', redirectLogin, (req, res) => {
  console.log(req.get('cookie'))

  req.session.destroy(err => {
    if (err) {
      return res.redirect('/home')
    }
    res.clearCookie(SESS_NAME)
    res.redirect('/')
  })
})

//fire controllers,调用controllers
todoController(app);

app.listen(3900, () => {
  console.log('I am listening port 3900...');
});

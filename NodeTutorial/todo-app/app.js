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

// session-cookie 中文文档 https://juejin.im/post/5ca7c191f265da30ac21adae#heading-40
app.use(session({
  name: SESS_NAME,
  // store: session 的存储方式，默认存放在内存中，也可以使用 redis，mongodb 等。express 生态中都有相应模块的支持。
  // secret: 用计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改。
  secret: `quiet, pal! it's a secret!`,
  // resave saveUninitialized 解释 https://cnodejs.org/topic/55e1cb5a07b4d1cf3a80d6de
  resave: false,
  saveUninitialized: false,
  cookie: {
    // 过期时间：1 小时过期
    maxAge: 60 * 60 * 1000,
    // 浏览器无法通过 document.cookie 获取该 cookie，防止 XXS 攻击
    httpOnly: true,
    // https://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html
    sameSite: 'lax',
    // sameSite: 'strict',
    // sameSite: 'none',
    // cookie 只通过https协议传输
    // secure: true
  }
}))

// 响应 cookie
// Set-Cookie: sid=s%3A8glG0_zyZtqrCNG4b6NhahV7RFcp3dhh.C1VrlnVzbKcSYnrxQeqmEmgPgTJXteyfQ2g5AEFzXoQ; Path=/; Expires=Sun, 21 Jun 2020 05:14:57 GMT; HttpOnly; SameSite=Strict

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

app.get('/img', (req, res) => {
  if(req.session.userId) {
    res.sendFile(`${__dirname}/cookie.png`)
    return
  }

  // res.sendStatus(403);
  res.sendStatus(500);
  res.end();
})

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
  const { email, password, redirect } = req.body
  if (email && password) {
    const user = users.find((user) => {
      return user.email === email && user.password === password;
    })

    if (user) {
      req.session.userId = user.id

      if(redirect !== '0') {
        return res.redirect('/home')
      }
      res.send("ok")
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

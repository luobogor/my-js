var express = require('express');
var todoController = require('./controllers/todoControllers');
var app = express();

//设置模板引擎
//nodejs默认在views文件夹寻找view模块，所以要建一个文件夹命名为'views'
app.set('view engine', 'ejs');

//利用中间件配置静态资源请求
app.use(express.static('./public'));
// app.use('/assets',express.static('./public'));

//fire controllers,调用controllers
todoController(app);

app.listen(3000);
console.log('I am listening port 3000...');

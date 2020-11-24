const mongoose = require('mongoose');

mongoose.connect('mongodb://test:test@ds161146.mlab.com:61146/ninja');
//Create a schema
const todoSchema = new mongoose.Schema({
    item: String
});
const Todo = mongoose.model('Todo', todoSchema);
// var data = [
//     {item: 'hello basketball'},
//     {item: 'hi guitar'},
//     {item: 'hehe football'}
// ];

module.exports = function (app) {
    //********************************RESTFul API********************************
    app.get('/todo', function (req, res) {
        //query all data
        Todo.find({}, function (err, data) {
            if (err) throw err;
            // res.sendFile()返回一个文件
            //渲染模板并返回渲染后的Html
            res.render('todo', {todos: data});
        });
    });

    //利用中间件bodyParser从http请求头中提取请求体数据,然后放到req.body中
    app.post('/todo', function (req, res) {
        var newTodo = Todo(req.body).save(function (err,data) {
            if (err) throw err;
            //返回json串
            res.json(data);
        });
    });

    app.put('/todo', function (req, res) {

    });

    app.delete('/todo/:item', function (req, res) {
        //如果读取url上的参数比如 www.baidu.com?name=hehe，用req.query，该属性是一个对象。
        Todo.find({item:req.params.item.replace(/\-/g, ' ')}).remove(function (err, data) {
            if (err) throw err;
            //返回json串
            res.json(data);
        });

        // data = data.filter(function (todo) {
        //     return todo.item.replace(/ /g, '-') !== req.params.item;
        // });
        // res.json(data);
    });
};

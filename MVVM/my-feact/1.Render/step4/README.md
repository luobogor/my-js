> 可以处理自定义组件嵌套及原生标签
- children参数只作用于原生标签，然后将children合并到this.pros.children = children，自定义标签是不需要这个参数的。

###问题
- 用户自定义组件的props是怎样起作用的?
由原生标签的children参数负责渲染
````
 const MyTitle = Feact.createClass({
       render() {
            //可以注意到原生标签的virtual dom的children参数一定是this.props.xxx
           return Feact.createElement('h1', null, this.props.title);
       }
   });

 Feact.render(
            Feact.createElement(MyTitle, { title: 'hey there Mytitle'}),
            document.getElementById('root0')
        );

````

- createClass的本质是什么

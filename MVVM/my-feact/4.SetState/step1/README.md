> 每当一个组件想要更新，它需要告诉 Feact “嘿，我想再次渲染”，而 this.setState() 是完成这个的主要方式。setState 更新 this.state，并触发一个渲染，它将通过生命周期方法 shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate（该 Feact没有，但是 React 有）发送组件。
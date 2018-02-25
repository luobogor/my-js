const Feact = {
    // Feact.createElement 替代 JSX
    //比如
    // <h1>hello world</h1>
    // createElement('h1', null, 'hello world'),
    //** 生成一个virtual dom
    createElement(type, props, children) {
        // 如果type 是字符串，元素就原生的，
        // 如果type 是函数，那就代表复合组件。
        const element = {
            type,
            props: props || {}
        };

        if (children) {
            element.props.children = children;
        }

        return element;
    },

    createClass(spec) {
        function Constructor(props) {
            this.props = props;
        }

        Constructor.prototype.render = spec.render;
        return Constructor;
    },


    render(element, container) {
        const componentInstance = new FeactCompositeComponentWrapper(element);
        return componentInstance.mountComponent(container);
    }
};


class FeactDOMComponent {
    //这里的element是个virtual dom
    constructor(element) {
        this._currentElement = element;
    }

    mountComponent(container) {
        const domElement = document.createElement(this._currentElement.type);
        const text = this._currentElement.props.children;
        const textNode = document.createTextNode(text);
        domElement.appendChild(textNode);

        container.appendChild(domElement);
        // this._hostNode = domElement;
        return domElement;
    }
}

class FeactCompositeComponentWrapper {
    constructor(element) {
        this._currentElement = element;
    }

    mountComponent(container) {
        //type可能是字符串，可能是函数Constructor
        const Component = this._currentElement.type;
        const compoenntInstance = new Component(this._currentElement.props);

        //render调用Feact.createElement('h1', null, this.props.message)获取virtual dom
        //该element可能是原生标签的virtual dom，
        // 也可能是用户自定义组件的virtual dom
        let element = compoenntInstance.render();

        //当这个element是用户自定义组件的virtual dom,将自定义组件标签转化为原生标签的virtual dom
        while (typeof element.type === 'function'){
            element = (new element.type(element.props)).render();
        }

        //与Feact类中的redner方法写法一样
        const domComponentInstance = new FeactDOMComponent(element);
        return domComponentInstance.mountComponent(container);
    }
}

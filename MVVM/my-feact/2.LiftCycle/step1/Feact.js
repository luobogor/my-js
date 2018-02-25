const TopLevelWrapper = function (props) {
    this.props = props;
};

TopLevelWrapper.prototype.render = function () {
    return this.props;
};

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

        // Constructor.prototype.render = spec.render;
        Constructor.prototype = Object.assign(Constructor.prototype, spec);
        return Constructor;
    },


    render(element, container) {
        const wrapperElement = this.createElement(TopLevelWrapper, element);

        const componentInstance = new FeactCompositeComponentWrapper(wrapperElement);
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
        const Component = this._currentElement.type;
        const compoenntInstance = new Component(this._currentElement.props);

        // 经过包装componentInstance一定是用户自定义组件，所以用render进行一次卸装
        //render弹出componentInstance的props属性
        let element = compoenntInstance.render();
        // const willDidMountMethod = Component.prototype.componentWillDidMount;
        // const didMountMethod = Component.prototype.componentDidMount;

        //当这个element是用户自定义组件的virtual dom,将自定义组件标签转化为原生标签的virtual dom
        while (typeof element.type === 'function'){
            let component = new element.type(element.props);
            element = component.render();
        }

        const domComponentInstance = new FeactDOMComponent(element);

        //生命周期
        // if(willDidMountMethod){
        //     willDidMountMethod();
        // }

        const didMount = domComponentInstance.mountComponent(container);

        // if(didMountMethod){
        //     didMountMethod();
        // }
        return didMount;
    }
}

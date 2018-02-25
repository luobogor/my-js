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
        const wrapperElement = this.createElement(TopLevelWrapper, element);
        //as before
        const componentInstance = new FeactCompositeComponentWrapper(wrapperElement);
        return componentInstance.mountComponent(container);
    }
};

/**
 * 真实DOM节点类
 */
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

/**
 * 复合组件类
 * Composite 复合
 */
class FeactCompositeComponentWrapper {
    constructor(element) {
        this._currentElement = element;
    }

    mountComponent(container) {
        //之前的step中type可能是字符串，可能是函数Constructor
        //因为现在在Feact.render中使用TopLevelWrapper进行包装，所以type一定是函数
        //简单来说就是无论type是字符串还是函数，统一包装成一个函数，也就是统一包一层用户自定义组件
        const Component = this._currentElement.type;
        const compoenntInstance = new Component(this._currentElement.props);

        // 经过包装componentInstance一定是用户自定义组件，所以用render进行一次卸装
        //render弹出componentInstance的props属性
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

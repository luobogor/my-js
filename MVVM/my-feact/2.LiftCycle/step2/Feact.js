/**
 * TopLevelWrapper与createClass里的Constructor写法基本一样的
 * 不同的是TopLevelWrapper.prototype.render返回该实例化对象的props
 *         而Constructor.prototype.render是用户自定义的，返回原生组件
 *
 * 简单来说，ToplevelWrapper 是一个简单的复合组件。
 * 它能够通过调用 Feact.createClass() 来定义，它的 render 方法只返回使用者提供的元素。
 *
 * @param props
 * @constructor
 */
const TopLevelWrapper = function (props) {
    this.props = props;
};

TopLevelWrapper.prototype.render = function () {
    return this.props;
};

/**
 * 核心工具类
 */
const Feact = {
    // Feact.createElement 替代 JSX
    //比如
    // <h1>hello world</h1>
    // createElement('h1', null, 'hello world'),
    //**
    /**
     * 生成virtual dom
     *
     * @param {string/function} type
     *          如果type 是字符串，元素就原生组件(即原生标签)，
     *          如果type 是构造函数，那就代表复合组件。
     * @param {obj} props 组件属性
     * @param {string} children 只有原生组件使用这个参数，用于保存节点内容
     * @returns {{type: string/function, props: obj}}
     */
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

    /**
     * 生成复合组件构造函数,将用户自定义方法都注入这个构造函数当中
     *
     * @param  {obj} spec spec对象里存放用户自定义方法及一些如componentDidMount的生命周期重载方法
     * @returns {Constructor: function}
     */
    createClass(spec) {
        /**
         *
         * @param {obj} props 组件属性
         * @constructor
         */
        function Constructor(props) {
            this.props = props;
        }

        //将spec对象里的方法全部拷贝到prototype中，相当于做继承
        Constructor.prototype = Object.assign(Constructor.prototype, spec);
        return Constructor;
    },

    /**
     *render核心 javascript对象映射到真实dom节点
     *
     * @param {obj} element virtual dom
     * @param {obj} container dom节点
     * @returns {*}
     */
    render(element, container) {
        //将virtual dom作为TopLevelWrapper组件的属性，有些奇怪
        const wrapperElement = this.createElement(TopLevelWrapper, element);

        const componentInstance = new FeactCompositeComponentWrapper(wrapperElement);
        //最终结果得到一个渲染在容器中的dom节点
        return FeactReconciler.mountComponent(componentInstance, container);
    }
};

/**
 * 真实DOM节点类
 * ReactDOMComponent 负责为 React 元素和它们相应的本地 DOM 元素之间搭建桥梁。
 */
class FeactDOMComponent {
    /**
     *
     * @param {obj} element virtualDOM
     *
     */
    constructor(element) {
        this._currentElement = element;
    }

    /**
     *
     * @param {obj} container 真实dom节点容器
     * @returns {Element obj} 在窗口中渲染的dom节点
     */
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
 *
 * FeactCompositeComponentWrapper 组件对Component进行解包装，最终产生FeactDOMComponent
 */
class FeactCompositeComponentWrapper {
    /**
     *
     * @param {obj} element virtualDOM
     */
    constructor(element) {
        //virtualDOM
        this._currentElement = element;
        //根据virtualDOM的Constructor生成的实例
        this._instance = null;
        //根据virtualDOM的Constructor生成的实例执行render后得到的另一个virtualDOM，
        // 注入新的vitualDOM到FeactCompositeComponentWrapper构造函数中，生成一个FeactCompositeComponentWrapper实例
        //将该实例保存在this._renderedComponent
        this._renderedComponent = null;
    }

    /**
     *
     * @param {obj} container 真实DOM容器
     * @returns {obj} markup 渲染在真实container容器中的真实DOM节点
     */
    mountComponent(container) {
        const Component = this._currentElement.type;//Feact.createClass生成的Constructor
        const componentInstance = new Component(this._currentElement.props);//将属性注入到实例当中
        this._instance = componentInstance;

        //*******在这里控制组件的生命周期

        //代理模式

        //钩子：挂载前
        if (componentInstance.componentWillDidMount) {
            componentInstance.componentWillDidMount();
        }
        //进行挂载
        const markup = this.performInitialMount(container);
        //钩子：挂载后
        if (componentInstance.componentDidMount) {
            componentInstance.componentDidMount();
        }
        return markup;
    }

    //performInitialMount是一个代理方法，钩子方法放在FeactReconciler.mountComponent前后
    /**
     * perform翻译成'执行'
     * @param container
     * @returns {*}
     */
    performInitialMount(container) {
        //执行复合组件render方法

        //如MyH1中有个render方法，在这里执行，得到一个virtualDOM
        // const MyH1 = Feact.createClass({
        //     componentWillDidMount() {
        //         console.log('MyH1 will did mount');
        //     },
        //     componentDidMount() {
        //         console.log('MyH1 has did mount');
        //     },
        //
        //     render() {
        //         return Feact.createElement('h1', null, this.props.message);
        //     }
        // });

        const renderedElement = this._instance.render();

        //生成virtualDOM实例
        const child = instantiateFeactComponent(renderedElement);
        this._renderedComponent = child;

        //挂载：即渲染virtualDOM
        //**************FeactReconciler.mountComponent递归调用child.mountComponent
        //除了最后一次递归child是FeactDOMComponent的实例化对象，之前的所有递归中child都是FeactCompositeComponentWrapper的实例化对象
        return FeactReconciler.mountComponent(child, container);
    }

}


// 这是相当数量的新代码，但基本思想是将挂载移至另一层。这是 FeactReconciler 的工作，随着我们的前进
// 也将有更多的工作要做。在 React 中，ReactReconciler 扮演同样的角色。
/**
 * Reconciler 调解人
 * @type {{mountComponent: (function(*, *=))}}
 */
const FeactReconciler = {
    mountComponent(internalInstance, container) {
        //***************************！！！！！这个递归调用代替了上一节的while循环
        return internalInstance.mountComponent(container);
    }
};


/**
 * 根据type判断生成原生组件或者复合组件
 * @param element
 * @returns {*}
 */
function instantiateFeactComponent(element) {
    if (typeof element.type === 'string') {
        return new FeactDOMComponent(element);
    } else if (typeof element.type === 'function') {
        return new FeactCompositeComponentWrapper(element);
    }
}
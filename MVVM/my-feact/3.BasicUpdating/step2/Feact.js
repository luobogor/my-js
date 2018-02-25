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

        //将spec的方法全部拷贝到prototype中
        //所以可以使用如 componentWillMount 的方法，也允许使用用户定义的任意方法。
        Constructor.prototype = Object.assign(Constructor.prototype, spec);
        return Constructor;
    },


    render(element, container) {
        const prevComponent = getTopLevelComponentInContainer(container);
        if (prevComponent) {
            return updateRootComponent(prevComponent, element);
        } else {
            return renderNewRootComponent(element, container);
        }
    }
};

/**
 *
 * @param {obj} container 真实DOM节点容器
 * @returns {null | obj} 上一次渲染的virtualDOM的FeactCompositeComponentWrapper实例
 */
function getTopLevelComponentInContainer(container) {
    return container.__feactComponentInstance;
}

/**
 *
 * @param {obj} prevComponent 上一次渲染的virtualDOM的FeactCompositeComponentWrapper实例
 * @param {obj} nextElement 将要渲染的virtualDOM
 */
function updateRootComponent(prevComponent, nextElement) {
    FeactReconciler.receiveComponent(prevComponent, nextElement);
}

/**
 *
 * @param element
 * @param container
 * @returns {*}
 */
function renderNewRootComponent(element, container) {
    const wrapperElement = Feact.createElement(TopLevelWrapper, element);
    const componentInstance = new FeactCompositeComponentWrapper(wrapperElement);
    const markup = FeactReconciler.mountComponent(componentInstance, container);

    // because componentInstance is just
    // the TopLevelWrapper, which we don't need for updates
    container.__feactComponentInstance = componentInstance._renderedComponent;
    return markup;
}


/**
 *
 * @field {obj} _currentElement
 * @field {obj} _hostNode
 */
class FeactDOMComponent {
    /**
     *
     * @param element
     */
    constructor(element) {
        this._currentElement = element;
        this._hostNode = null;
    }

    mountComponent(container) {
        const domElement = document.createElement(this._currentElement.type);
        const text = this._currentElement.props.children;
        const textNode = document.createTextNode(text);
        domElement.appendChild(textNode);

        container.appendChild(domElement);
        this._hostNode = domElement;
        return domElement;
    }

    receiveComponent(nextElement) {
        const prevElement = this._currentElement;
        this.updateComponent(prevElement, nextElement);
    }

    updateComponent(prevElement, nextElement) {
        const lastProps = prevElement.props;
        const nextProps = nextElement.props;

        this._updateDOMProperties(lastProps, nextProps);
        this._updateDOMChildren(lastProps, nextProps);
    }

    _updateDOMProperties(lastProps, nextProps) {
        // _updateDOMProperties 主要关心更新 CSS 样式。
        // 我们不会在这个博客文章系列中实现它，只是指出它是 React 用于处理样式更改的方法。
    }

    /**
     *
     * @param {obj} lastProps 上一次渲染的virtualDOM的属性
     * @param {obj} nextProps 将要渲染的virtualDOM的属性
     * @private
     */
    _updateDOMChildren(lastProps, nextProps) {
        // 在 React中 _updateDOMChildren 这个方法很复杂，处理了很多不同的场景
        //但在 Feact 中，子元素只是 DOM 元素的文本内容，在这种情况下，子元素将从 "hello" 变成 "hello again"。
        const lastContent = lastProps.children;
        const nextContent = nextProps.children;

        if (!nextContent) {
            this.updateTextContent('');
        }else if(lastContent !== nextContent){
            this.updateTextContent('' + nextContent);
        }
    }

    updateTextContent(text) {
        const node = this._hostNode;

        const firstChild = node.firstChild;
        //????
        if (firstChild &&
            firstChild === node.lastChild &&
            firstChild.nodeType === 3) {//nodeType 3是Text类型的节点
            firstChild.nodeValue = text;
            return;

        }
        //??????
        node.textContent = text;
    }
}

class FeactCompositeComponentWrapper {
    constructor(element) {
        //wrapperElement
        this._currentElement = element;
        //wrapperElement生成的实例，即当前virtual dom 解包装之前
        this._instance = null;
        //当前virtual dom 解包装之后
        this._renderedComponent = null;
    }

    /**
     *
     * @param nextElement
     */
    receiveComponent(nextElement){
        const prevElement = this._currentElement;
        this.updateComponent(prevElement,nextElement);
    }

    /**
     *
     * @param prevElement
     * @param nextElement
     */
    updateComponent(prevElement, nextElement) {
        const nextProps = nextElement.props;
        const inst = this._instance;
        
        if(inst.componentWillReceiveProps){
            inst.componentWillReceiveProps(nextProps);
        }

        let shouldUpdate = true;

        if(inst.shouldComponentUpdate){
            shouldUpdate = inst.shouldComponentUpdate(nextProps);
        }

        if(shouldUpdate){
            this._performComponentUpdate(nextElement, nextProps);
        }else {
            // if skipping the update,
            // still need to set the latest props
            inst.props = nextProps;
        }
    }

    /**
     *
     * @param nextElement
     * @param nextProps
     * @private
     */
    _performComponentUpdate(nextElement,nextProps){
        //更新当前节点
        this._currentElement = nextElement;
        //注意mountComponent方法中已经生成了_instance，当组件的props或者state发生变化时才触发更新，就是说只是组件的props或者state变了，
        // 但组件的内部生命周期方法和其他用户自定义方法是不变的，所以直接修改原组件上的props或者state
        const inst = this._instance;

        inst.props = nextProps;
        this._updateRenderedComponent();
    }

    /**
     *
     * @private
     */
    _updateRenderedComponent(){
        //_renderedComponent 可以是 FeactCompositeComponentWrapper，
        // 或者可能是 FeactDOMComponent。它是第一次渲染过程中创建的。
        const prevComponentInstance = this._renderedComponent;
        const inst = this._instance;
        //每次render就是一次解包装，取下下层组件的virtualDOM
        const nextRenderedElement = inst.render();

        //******递归调用FeactCompositeComponentWrapper.receiveComponent

        //除了最后一次递归prevComponentInstance是FeactDOMComponent的实例化对象，
        // 之前的所有递归中prevComponentInstance都是FeactCompositeComponentWrapper的实例化对象

        // prevComponentInstance.receiveComponent(nextRenderedElement);
        FeactReconciler.receiveComponent(prevComponentInstance, nextRenderedElement);
    }

    mountComponent(container) {
        const Component = this._currentElement.type;
        const componentInstance = new Component(this._currentElement.props);
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
    performInitialMount(container) {
        const renderedElement = this._instance.render();

        const child = instantiateFeactComponent(renderedElement);
        this._renderedComponent = child;

        //挂载
        //**************FeactReconciler.mountComponent递归调用child.mountComponent
        //除了最后一次递归child是FeactDOMComponent的实例化对象，
        // 之前的所有递归中child都是FeactCompositeComponentWrapper的实例化对象
        return FeactReconciler.mountComponent(child, container);
    }

}


// 这是相当数量的新代码，但基本思想是将挂载移至另一层。这是 FeactReconciler 的工作，随着我们的前进，
// 也将有更多的工作要做。在 React 中，ReactReconciler 扮演同样的角色。
const FeactReconciler = {
    mountComponent(internalInstance, container) {
        //***************************！！！！！这个递归调用代替了上一节的while循环
        return internalInstance.mountComponent(container);
    },

    receiveComponent(internalInstance,nextElement){
        internalInstance.receiveComponent(nextElement);
    }
};

//判断type是原生节点还是用户自定义组件节点
function instantiateFeactComponent(element) {
    if (typeof element.type === 'string') {
        return new FeactDOMComponent(element);
    } else if (typeof element.type === 'function') {
        return new FeactCompositeComponentWrapper(element);
    }
}
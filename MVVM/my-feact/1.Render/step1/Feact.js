const Feact = {
    // Feact.createElement 替代 JSX
    //比如
    // <h1>hello world</h1>
    // createElement('h1', null, 'hello world'),
    createElement(type,props,children) {
        const element = {
            type,
            props: props || {}
        };

        if(children){
            element.props.children = children;
        }

        return element;
    },

    render(element,container){
        const componentInstance = new FeactDOMComponent(element);
        return componentInstance.mountComponent(container);
    }
};



class FeactDOMComponent{
    constructor(element){
        this._currentElement = element;
    }

    mountComponent(container){
        const domElement = document.createElement(this._currentElement.type);
        const text = this._currentElement.props.children;
        const textNode = document.createTextNode(text);
        domElement.appendChild(textNode);

        container.appendChild(domElement);
        return domElement;
    }
}

function createVirtualComponent(tag, props) {
    return {
        tag: tag,
        props: props,
        dom: null,
    }
}

function createVirtualElement(tag, config, children = null) {
    const {className, style} = config;

    return {
        tag: tag,
        style: style,
        props: {
            children: children,
        },
        className: className,
        dom: null,
    }
}

function createElement(tag, config, children) {
    //if tag is a function we have a component
    if (typeof tag === 'function') {
        return createVirtualComponent(tag, config);
    }
    return createVirtualElement(tag, config, children);
}


function mount(input, parentDOMNode) {
    if (typeof input === 'string' || typeof input === 'number') {
        return mountVirtualText(input, parentDOMNode);
    }
    else if (typeof input.tag === 'function') {
        return mountVirtualComponent(input, parentDOMNode);
    }
    else if (typeof input.tag === 'string') {
        return mountVirtualElement(input, parentDOMNode)
    }
}

function mountVirtualComponent(virtualComponent, parentDOMNode) {
    const {tag, props} = virtualComponent;

    const Component = tag;
    const instance = new Component(props);
    const nextRenderedElement = instance.render();
    instance._currentElement = nextRenderedElement;
    instance._parentNode = parentDOMNode;

    const dom = mount(nextRenderedElement, parentDOMNode);

    //instance will be used for updating the DOM
    virtualComponent._instance = instance;
    virtualComponent.dom = dom;

    parentDOMNode.appendChild(dom);
}

function mountVirtualText(virtualText, parentDOMNode) {
    parentDOMNode.textContent = virtualText;
}

function mountVirtualElement(virtualElement, parentDOMNode) {
    const {className, tag, props, style} = virtualElement;

    const domNode = document.createElement(tag);
    virtualElement.dom = domNode;

    if (props.children) {
        if (!Array.isArray(props.children)) {
            mount(props.children, domNode)
        } else {
            props.children.forEach(child => mount(child, domNode));
        }
    }

    if (className !== undefined) {
        domNode.className = className;
    }

    if (style !== undefined) {
        Object.keys(style).forEach(sKey => domNode.style[sKey] = style[sKey]);
    }

    parentDOMNode.appendChild(domNode);

    return domNode;
}

function updateVirtualElement(prevElement, nextElement) {
    const dom = prevElement.dom;
    nextElement.dom = dom;

    if (nextElement.props.children) {
        updateChildren(prevElement.props.children, nextElement.props.children, dom);
    }

    if (prevElement.style !== nextElement.style) {
        Object.keys(nextElement.style).forEach((s) => dom.style[s] = nextElement.style[s])
    }
}

function updateVirtualText(prevText, nextText, parentDOM) {
    if (prevText !== nextText) {
        parentDOM.firstChild.nodeValue = nextText;
    }
}

function updateChildren(prevChildren, nextChildren, parentDOMNode) {
    if (!Array.isArray(nextChildren)) {
        nextChildren = [nextChildren];
    }
    if (!Array.isArray(prevChildren)) {
        prevChildren = [prevChildren];
    }

    for (let i = 0; i < nextChildren.length; i++) {
        //assumption that there are no new child HTML elements
        const nextChild = nextChildren[i];
        const prevChild = prevChildren[i];

        //check if virtualNode is a virtualText
        if (typeof nextChild === 'string' && typeof prevChild === 'string') {
            updateVirtualText(prevChild, nextChild, parentDOMNode);
        } else {
            update(prevChild, nextChild);
        }
    }
}


function updateVirtualComponent(prevComponent, nextComponent) {
    //get instance
    const {_instance} = prevComponent;
    const {_currentElement} = _instance;

    //old and new props
    const prevProps = prevComponent.props;
    const nextProps = nextComponent.props;

    //replace component
    nextComponent.dom = prevComponent.dom;
    nextComponent._instance = _instance;
    nextComponent._instance.props = nextProps;

    if (_instance.shouldComponentUpdate()) {
        const prevRenderedElement = _currentElement;
        const nextRenderedElement = _instance.render();
        //save nextRenderedElement for the next iteration
        nextComponent._instance._currentElement = nextRenderedElement;
        update(prevRenderedElement, nextRenderedElement, _instance._parentNode);
    }
}

class Component {
    constructor(props) {
        this.props = props || {};
        this.state = {};

        this._currentElement = null;
        this._pendingState = null;
        this._parentNode = null;
    }

    //override in component
    shouldComponentUpdate() {
        return true;
    }

    updateComponent() {
        const prevState = this.state;
        const prevElement = this._currentElement;

        if (this._pendingState !== prevState) {
            this.state = this._pendingState;
        }

        this._pendingState = null;
        const nextElement = this.render();
        this._currentElement = nextElement;

        if (this.shouldComponentUpdate()) {
            update(prevElement, nextElement, this._parentNode);
        }
    }

    setState(partialNewState) {
        this._pendingState = Object.assign({}, this.state, partialNewState);
        this.updateComponent();
    }

    //override in component
    render() {
    }
}

function update(prevElement, nextElement) {
    //assumption that html tag will not change
    if (prevElement.tag === nextElement.tag) {
        if (typeof prevElement.tag === 'string') {
            updateVirtualElement(prevElement, nextElement);
        } else if (typeof prevElement.tag === 'function') {
            updateVirtualComponent(prevElement, nextElement);
        }
    }
}
const xtag = (function (factory) {
  return factory.call()
}(function () {
  const __DEFS__ = {
    lifecycle: {
      created() {},
      attributeChanged() {},
    },
    methods: {},
  }

  const __CORE__ = {
    register(tag, options) {
      const thisDoc = document.currentScript.ownerDocument
      const template = thisDoc.querySelector('template').content
      const element = Object.create(HTMLElement.prototype)

      element.createdCallback = function () {
        const shadowRoot = this.attachShadow( { mode: 'closed' } );
        const clone = document.importNode(template, true)
        shadowRoot.appendChild(clone)

        if(!options.methods){
          options.methods = __DEFS__.methods
        }
        Object.keys(options.methods).forEach(method=>{
          this[method] = options.methods[method]
        })

        if (options && options.lifecycle && options.lifecycle.created) {
          options.lifecycle.created.call(this)
        } else {
          __DEFS__.lifecycle.created.call(this)
        }
      }

      element.attributeChangedCallback = function (attr, oldVal, newVal) {
        console.log(attr, oldVal, newVal)
        if (options && options.lifecycle && options.lifecycle.attributeChanged) {
          options.lifecycle.attributeChanged.call(this, attr, oldVal, newVal)
        } else {
          __DEFS__.lifecycle.attributeChanged.call(this)
        }
      }

      document.registerElement(tag, {
        prototype: element,
      })
    }
  }


  return __CORE__
}))

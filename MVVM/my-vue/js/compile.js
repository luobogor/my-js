/**
 *
 * @param el
 * @param vm
 * @constructor
 */

function Compile(el, vm) {
    this.vm = vm
    this.el = document.querySelector(el)
    this.fragment = null
    this.init()
}

Compile.prototype = {
    init: function () {
        if (this.el) {
            //为了提高性能，将el内的第一层原生节点移动到fragment，fragment不会即时渲染
            this.fragment = this.nodeToFragment(this.el)
            this.compileElement(this.fragment)
            //将移动到fragment重新添加到文档
            this.el.appendChild(this.fragment)
        } else {
            console.log('Dom元素不存在')
        }
    },

    nodeToFragment: function (el) {
        var fragment = document.createDocumentFragment(),
            child = el.firstChild

        while (child) {
            fragment.appendChild(child)
            //注意child已经被移动到fragment，所以再el.firstChild，就可以继续遍历兄弟节点
            child = el.firstChild
        }

        return fragment
    },

    compileElement: function (el) {
        var childNodes = el.childNodes,
            self = this
            //childNodes获取所有子节点，children只获取类型为Element的子节点
        ;[].slice.call(childNodes).forEach(function (node) {
            var reg = /\{\{(.*)\}\}/,
                text = node.textContent

            //处理 v-mode、v-on:click 等情况
            if (self.isElementNode(node))
                self.compile(node)
            else if (self.isTextNode(node) && reg.test(text))
                self.compileText(node, reg.exec(text)[1])

            //递归处理子节点
            if (node.childNodes && node.childNodes.length) self.compileElement(node)
        })
    },

    compile: function (node) {
        var nodeAttrs = node.attributes,
            self = this

        Array.prototype.forEach.call(nodeAttrs, function (attr) {
            var attrName = attr.name
            if (self.isDirective(attrName)) {
                var exp = attr.value,
                    //dir directive
                    dir = attrName.substring(2)

                if (self.isEventDirective(dir))
                    self.compileEvent(node, self.vm, exp, dir)
                else
                    self.compileModel(node, self.vm, exp, dir)
                //将'v-xxx'自定义属性移除
                node.removeAttribute(attrName);
            }
        })
    },

    /**
     *  处理事件绑定 <button v-on:click="clickMe">click me!</button>
     *
     * @param {obj} node 原生节点
     * @param vm
     * @param exp
     * @param {string} dir 指令，如：v-on:click
     */
    compileEvent: function (node, vm, exp, dir) {
        var eventType = dir.split(':')[1],
            cb = vm.methods && vm.methods[exp]//取出用户定义的回调方法

        if (eventType && cb)
            node.addEventListener(eventType, cb.bind(vm), false)
    },

    /**
     *  将 v-modle = expression 里的 expression与data.expression绑定
     *
     * @param node
     * @param vm
     * @param exp
     * @param dir
     */
    compileModel: function (node, vm, exp, dir) {
        var self = this,
            val = this.vm[exp]
        //初始化input value
        this.modelUpdater(node, val)
        //监听属性变化
        new Watcher(this.vm, exp, function (value) {
            self.modelUpdater(node, value)
        })

        //input元素上绑定input事件，实现view驱动data变化
        node.addEventListener('input', function (e) {
            var newVal = e.target.value
            if (val === newVal) return
            self.vm[exp] = newVal
            val = newVal
        })

        //当view发生变化
        //触发inputEventHandler -> vm[exp].set -> vm[exp].data.set -> dep.notify  -> self.modelUpdater更新view

        //当data发生变化
        // vm[exp].set -> vm[exp].data.set -> dep.notify  -> self.modelUpdater更新view
    },

    /**
     *  处理标签文字内容为 {{xxx}} 的情况
     *  eg: <span>{{name}}</span>
     *
     * @param {obj} node 原生DOM元素节点
     * @param {string} exp 即expression {{expression}}
     */
    compileText: function (node, exp) {
        var self = this,
            initText = this.vm[exp]
        //初始化标签内的文字内容
        this.updateText(node, initText)

        //监听text的model，model驱动view变化
        new Watcher(this.vm, exp, function (value) {
            self.updateText(node, value)
        })

    },

    updateText: function (node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value
    },

    modelUpdater: function (node, value, oldValue) {
        node.value = typeof value === 'undefined' ? '' : value
    },

    isEventDirective: function (dir) {
        return dir.indexOf('on:') === 0
    },

    isDirective: function (attr) {
        return attr.indexOf('v-') === 0
    },

    isElementNode: function (node) {
        return node.nodeType == 1
    },

    isTextNode: function (node) {
        return node.nodeType === 3
    }
}
function Vue(options) {
    var self = this
    this.data = options.data
    this.methods = options.methods

    //在Vue实例直接读取data里的数据
    Object.keys(this.data).forEach(function (key) {
        self.proxyKeys(key)
    })

    //监听data里所有属性
    observe(this.data)
    new Compile(options.el, this)
    options.mounted.call(this)
}

Vue.prototype = {
    proxyKeys: function (key) {
        var self = this
        Object.defineProperty(this, key, {
            enumerable: true,
            configurable: true,
            get:function () {
                return self.data[key]
            },
            set:function (newVal) {
                self.data[key] = newVal
            }
        })
    }
}

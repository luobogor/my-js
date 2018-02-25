/**
 *
 * @param {obj} vm Vue对象
 * @param {string} exp expression 表达式
 * @param {fun} cb 属性发生变化时的回调函数
 * @constructor
 */
function Watcher(vm, exp, cb) {
    this.cb = cb
    this.vm = vm
    this.exp = exp
    // 从vm中读取exp属性，同时将自己添加到订阅器的操作
    this.value = this.get();
}

Watcher.prototype = {
    update:function () { this.run() },
    run:function () {
        var newVal = this.vm.data[this.exp]
            oldVal = this.value
        if(newVal !== oldVal){
            this.value = newVal
            //驱动view发生变化
            this.cb.call(this.vm, newVal, oldVal)
        }
    },
    get:function () {
        var value
        Dep.target = this // 缓存自己
        value = this.vm.data[this.exp]// 强制执行Observer监听器里的get函数将自己加入到监听队列
        Dep.target = null // 释放自己
        return value
    }
}
function Observer(data) {
    this.data = data
    this.walk(data)
}

Observer.prototype = {
    walk:function (data) {
        var self = this
        Object.keys(data).forEach(function (key) {
            self.defineReactive(data, key, data[key])
        })
    },

    defineReactive:function (data, key, val) {
        var dep = new Dep()

        observe(val)

        Object.defineProperty(data, key, {
            enumerable:true,
            configurable:true,
            //Compile -> new Watcher -> Watcher.prototype.get -> Observer.get  这条路径会addSub
            get: function getter() {

                Dep.target && dep.addSub(Dep.target)
                return val
            },

            //model驱动view变化
            //执行阶段完成，用户对对象设置触发 set -> dep.notify -> sub.update -> get 这条路径不会addSub
            set: function setter(newVal) {

                if(newVal === val) return
                val = newVal
                dep.notify()
            }
        })

    }
}

function observe(value) {
    if(!value || typeof value !== 'object') return
    return new Observer(value)
}

//Dep是defineProperty的缩写？？
function Dep() {
    this.subs = []
}

Dep.prototype = {
    //放入观察者列表
    addSub: function (sub) {
        this.subs.push(sub)
    },
    //触发观察者列表里的任务
    notify:function () {
        this.subs.forEach(function (sub) {
            sub.update()
        })
    }
}
//初始化
Dep.target = null
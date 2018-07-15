{
    let log = (type) => {
        // obj.prototype, fieldName, descriptor
        return function (target, name, descriptor) {
            //  descriptor = {
            //     value: function () { console.log('classinner show excute'); },
            //     enumerable: false,
            //     configurable: true,
            //     writable: true
            // }
            let srcMethod = descriptor.value;
            descriptor.value = (...arg) => {
                srcMethod.apply(target, arg);
                console.log(`log ${type}`);
            }
        }
    };

    /**
     * 广告类
     */
    class AD {
        @log('show')
        show() {
            console.log('classinner show excute');
        }

        @log('click')
        click() {
            console.log('classinner click excute');
        }
    }

    let ad = new AD();
    ad.show();
    ad.click();

    //classinner show excute
    //log show
    //classinner click excute
    //log click

    //第三方类型库 core-decorator
}

{
    let log = (type) => {
        return function (target, name, descriptor) {
            let src_method = descriptor.value;
            descriptor.value = (...arg) => {
                src_method.apply(target, arg);
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
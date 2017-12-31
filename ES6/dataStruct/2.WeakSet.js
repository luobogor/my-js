{
    //1.只能添加对象
    //2.添加对象时不会该对象是否已经被垃圾回收
    //3.不支持遍历
    //4.其他用法与普通Set相同
    let weakList = new WeakSet();
    let arg = {};
    weakList.add(arg);
    // weakList.add('a');//报错

}
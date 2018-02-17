{
    let list = new Set();
    list.add(1);
    list.add(2);
    console.log(list);
}

{
    //list转set
    let arr = [1, 2, 3, 4];
    let list = new Set(arr);
    console.log(list);
}

{
    //元素唯一
    let list = new Set();
    list.add(1);
    list.add(2);
    list.add('2');
    list.add(1);
    console.log(list);//结果1,2,'2'    1不会重复添加

    // 利用元素唯一的特性可以做数组去重操作
    let arr = [1, 2, 4, 3, 1, 2];
    console.log('元素去重',new Set(arr));
}


{
    //增删查
    console.log('增删查');
    let arr = ['a','b','c','d'];
    let list = new Set(arr);
    console.log('has', list.has('a'));
    console.log('delete', list.delete('b'), list);
    list.clear();//清空
    console.log('list', list);
}


{
    console.log('**************************遍历');
    let arr = ['a','b','c','d'];
    let list = new Set(arr);
    //遍历key
    console.log('keys:');
    for(let key of list.keys()) {
        console.log(key);
    }

    //遍历value
    console.log('values:');
    for(let value of list.values()) {
        console.log(value);
    }
    //遍历key,value
    console.log('key,value:');
    for(let [key,value] of list.entries()) {
        console.log(key,value);
    }

    console.log('key,value foreach:');
    list.forEach(function (item) {
        console.log(item);
    });
}
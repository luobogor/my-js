### 返回undefined的情况

1. 声音了一个变量，但未赋初始值
	
	````
	    var a;
	    console.log(a)//undefined
	````

2. 没有返回值的函数
3. 没有提供实参的函数形参

	````
		function fn(a){
			console.log('fn inner',a)//undefined
		}
		console.log('call fn',fn())//undefined
	````
4. 查询对象属性或数组元素不存在时
    ````
        //无论非严格模式还是严格模式下都是undefined，不会报错
        
        var obj = {};
        console.log(obj.abc)//undefined

        var array = [];
        console.log(array[1]);//undefined
    ````

### null与undefined
````
    type of undefined;//undefined   undefined值是undefined类型的唯一成员 
    type of null;//object   null是一个特殊的object
    null == undefined;//true
    null === undefined;//false
````
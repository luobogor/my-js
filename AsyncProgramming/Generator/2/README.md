### Symbol
ES5 的对象属性名都是字符串，这容易造成属性名的冲突。比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），新方法的名字就有可能与现有方法产生冲突。如果有一种机制，保证每个属性的名字都是独一无二的就好了，这样就从根本上防止属性名的冲突。这就是 ES6 引入Symbol的原因。

Symbol是原始值，new Symbol()会报错

### Iterator(迭代器)
迭代器是一种特殊`对象`所有的迭代器对象都有一个next()方法，每次调用都返回一个结果的对象。结果对象有个属性：一个是`value`，表示下一个将要返回的值；另一个是`done`，它是一个布尔类型的值，当没有更多返回可返回数据时返回true。迭代器还会保存一个`内部指针`，用来指向当前集合中值的位置，每调用一次next()方法，都会返回下一个可用的值。

如果在最后一个值返回后再调用next()方法，那么返回的对象属性done为true,value为undefined

### Generator(生成器)
生成器是一种返回迭代器的`函数`，它可以让创建迭代器对象的过程变得更简单，调用生成器返回的是一个迭代器

````
{
    console.log("*****************************part1");
    let tell = function* () {
        yield 'a';
        yield 'b';
        return 'c';
    };

    let k = tell();//返回一个迭代器

    console.log(k.next());//false
    console.log(k.next());//false
    console.log(k.next());//true，表示后面已经没值可以返回了
    console.log(k.next());//true
}
````

#### yield运行细节
详见p167、p168，有图片详细说明。简单地说就是在执行yield左侧代码前，右侧的每一个表达式会先执行再停止。在下次执行next()方法时，执行下一句yield左侧代码前，先执行上个yield语句左侧未执行完的语句，然后本次yield语句右侧的每一个表达式会先执行再停止，如此反复。

#### 给迭代器传递参数及在迭代器中抛出错误
next()方法的参数的值会替代生成器内部上一条yield语句的返回值。

因为第一次调用next()方法前不会执行任何yield语句，因此在第一次调用next()方法时传递参数是没有任何作用的。只能通过调用生成器时传递参数给第一次执行yield语句使用。

````
{
    console.log("*****************************part4:给迭代器传递参数及抛出错误");

    function* createIterator(num) {
        console.log('begin');
        let first = yield num + 1;// 1 + 1
        console.log(first);// 已经被替换成4
        let second;
        try {
            second = yield first + 2;// yield 4 + 2，然后抛出错误
        } catch (ex) {
            second = 6;
        }
        yield second + 3;//6 + 3 = 9
    }

    //通过调用生成器时传递参数给第一次执行yield语句使用。
    let iterator = createIterator(1);
    //因为第一次调用next()方法前不会执行任何yield语句，因此在第一次调用next()方法时传递998没任何作用
    console.log(iterator.next(998));//1,false
    // next()方法的参数4会替代生成器内部上一条yield语句的返回值2
    console.log(iterator.next(4));//6,false
    console.log(iterator.throw(new Error("Boom")));//9,false
    console.log(iterator.next());//undefined,true
}
````

请注意这里有一个有趣的现象：调用throw()方法后也会像调用next()方法一样返回一个结果对象。由于在生成器内部捕获了这个错误，因而会继续执行下一条yield语句，最终返回数值9。

next()和throw()就像是迭代器的两条指令，调用next()方法命令迭代器继续执行（可能提供一个值），调用throw()方法也会命令迭代器继续执行，但同时也抛出一个错误，在此之后的执行过程取决于生成器内部的代码。

个人认为next()这种替代上次yield返回值的做法不合理，如果用户需要保留上次yield的返回值呢？

#### 生成器return语句
在生成器中，return表示所有操作已经完成，属性done被设置为true

> NOTE: 展开运算符与for~of循环语句会直接忽略通过return语句指定的任何返回值，只要done一变为true就立即停止读取其他的值，但next()方法可以获取返回值。下面委托生成器的代码可以验证。


#### 委托生成器
在某些情况下需要将两个迭代器合二为一，这里可以创建一个生成器，再给yield语句添加一个星号，就可以将生成数据的过程委托给其他迭代器，也就是生成器嵌套。

````
{
    console.log("*****************************part5:yield*进行Generator嵌套");

    function* G1() {
        yield 'a';
        yield* G2();
        // 如果要返回'z'，将这样操作
        // let res = yield* G2();
        // yield res;
        yield 'b';
        return 'hello';
    }

    function* G2() {
        yield 'x';
        yield 'y';
        return 'z';
    }

    let iteratorG1 = G1();
    for (let item of iteratorG1) {
        console.log(item);//'a','x','y','b'
    }

    let iteratorG2 = G2();
    iteratorG2.next();//'x',false
    iteratorG2.next();//'y',false
    //如果当前生成器不作为委托生成器，可以用next()可以取到return的值
    iteratorG2.next();//'z',true
}
````


### for~of
可迭代对象具有Symbol.iterator属性，是一种与迭代器密切相关的对象。Symbol.iterator通过指定的函数可以返回一个作用于附属对象的迭代器。所有集合对象(数组、Set集合及Map集合)和字符串都是可迭代对象，这些对象都有默认的迭代器。for~of需要用到可迭代对象的这些功能。

#### 原理

for~of 循环通过的代码通过调用可迭代目标的`Symbol.iterator`方法来获取迭代器，这一过程在Javascript引擎背后完成的(又或者如下代码直接取得迭代器也可以)。随后迭代器的next()方法多次调用，从其返回对象的value属性读取值并存储在指定的变量中。


````
{
    console.log("*****************************part1");
    let tell = function* () {
        yield 'a';
        yield 'b';
        return 'c';
    };

    let k = tell();

    console.log(k.next());//false
    console.log(k.next());//false
    console.log(k.next());//true
    console.log(k.next());//true
    for(let value of tell()) 
        console.log(value)// 'a','b'
}
````

相比传统的for循环，for~of循环的控制条件更简单，不需要追踪复杂的条件，所以更少出错，推荐使用。

#### 展开运算符
展开运算符也可以作用于可迭代对象，通过迭代器从对象中读取相应的值并插入到一个数组中，因此展开运算符是将可迭代对象转换为数组最简单的方法。

#### 创建可迭代对象
默认情况下，开发者定义的对象都是不可迭代对象，但如果给Symbol.iterator属性添加一个生成器，则可以将其变为可迭代对象

````
{
    console.log("*****************************part2:Generator返回Iterator");
    let obj = {
        //Generator是一个遍历器生成函数
        *[Symbol.iterator]() {
            yield 1;
            yield 2;
            yield 3;
        }
    };

    for (let value of obj) {
        console.log('value', value);
    }
}
````
> NOTE: 如果将for-of语句用于不可迭代对象、null或undefined将会导致程序抛出错误

### 内置迭代器
数组、Set、Map

- entries() 返回一个迭代器，其值为多个键值对
- values() 返回一个迭代器，其值为集合的值
- keys() 返回一个迭代器，其值为集合中的所有键名

````
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
````

- async与Generator的区别
  - 语法糖
  - 不需要co库
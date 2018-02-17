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
如果将for-of语句用于不可迭代对象、null或undefined将会导致程序抛出错误

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
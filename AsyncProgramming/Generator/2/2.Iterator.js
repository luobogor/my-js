//主要作用，统一不同数据结构迭代方式
{
    console.log("*****************************part1");
    let arr = ['helloGIt', 'helloWorld'];
    let map = arr[Symbol.iterator]();
    console.log(map.next());
    console.log(map.next());
    console.log(map.next());
}

{
    console.log("*****************************part2:for...of是按照Iterator接口来进行的");
    let arr = ['helloGIt', 'helloWorld'];
    for (let key of arr) {
        console.log(key);
    }
}


{
    console.log("*****************************part3:自定义Iterator,按顺序遍历对象里的数组");
    let obj = {
        start: [1, 3, 2],
        end: [7, 9, 8],
        [Symbol.iterator]() {
            let self = this;
            let index = 0;
            let arr = self.start.concat(self.end);
            let len = arr.length;
            return {
                next() {
                    if (index < len) {
                        return {
                            value: arr[index++],
                            done: false
                        };
                    } else {
                        return {
                            value: arr[index++],
                            done: true
                        }
                    }
                }
            }
        }
    };
    for (let key of obj) {
        console.log(key);
    }
}
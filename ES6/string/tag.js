//定义标签
function passthru(literals, ...substitutions) {
    let result = "";

    for (let i = 0; i < substitutions.length; i++) {
        result += literals[i];
        result += substitutions[i];
    }

    //合并最后一个literal
    result += literals[literals.length - 1];
    return result;
}

let count = 10,
    price = 0.25,
    message = passthru`${count} items cost $${(count * price).toFixed(2)}.`;

console.log(message);//10 items cost $2.50.

//标签可以对字串符模板进行操作
//第一个参数literals = ["", " items cost $", "."]
//第二参数substitutions = [10, 2.50]
//《深入理解javascript》 p33
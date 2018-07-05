const babel = require('babel-core');
const transform = babel.transform;

const result = transform('(() => {' +
    '    console.log(\'hello\');' +
    '})();');

console.log(result);
// 返回值为一个对象，参数分别为生成的代码，source map 以及 AST

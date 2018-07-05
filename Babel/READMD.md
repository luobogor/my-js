你可以通过安装**插件（plugins）或预设（presets，也就是一组插件）**来指示 Babel 去做什么事情。

Babel 几乎可以编译所有时新的 JavaScript 语法，但对于 APIs 来说却并非如此。
polyfill 即是在当前运行环境中用来复制（意指模拟性的复制，而不是拷贝）尚不存在的原生 api 的代码。 能让你提前使用还不可用的 APIs，Array.from 就是一个例子。

## babel-core
拥有transform api，用于实时编程。babel-loader依赖于babel-core
````js

````

## babel-cli
命令行工具

## babel-register
它的特点就是实时编译，不需要输出文件，执行的时候再去编译。所以它很适用于开发。
总结一下就是，多用在 node 跑程序，做实时编译用的，通常会结合其他插件作编译器使用，比如 mocha 做测试的时候。
这个在生产环境是无效的，只在开发环境用。

## babel-runtime
这个包提供
````js
var _defineProperty2 = require('babel-runtime/helpers/defineProperty');
````



## babel-polyfill
与babel-runtime作用一样，区别是，babel-polyfill需要引入到js文件，模拟ES6环境
This polyfill is automatically loaded when using babel-node.
The polyfill adds to the global scope as well as native prototypes like String in order to do this.

https://juejin.im/post/59ec657ef265da431b6c5b03#heading-10
https://juejin.im/entry/59ba1a3c5188255e723b8cae

## transform-runtime
https://segmentfault.com/q/1010000005596587?from=singlemessage&isappinstalled=1
内部使用babel-runtime，减少转译后的js文件体积

## Demo01
如果从.babelrc中去除"es2015"，会报错，因为没有相应的preset组件做转译

## presets env 2017年出的
作用与babel-preset-latest(包含babel-preset-2015~2017)一样，但可以进行额外的环境配置，配置不同的环境，会针对环境输出不同的js语句 


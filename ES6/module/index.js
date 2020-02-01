// ComponentA中导出多个变量，所以引入的时候名称要跟ComponentA相同
import caSub, { caSub2Hello1, caSub2Hello2,A, test, Hello } from './ComponentA';

//相当于ComponentA{A, test, Hello}
import * as ComponentA from './ComponentA';

//由于ComponentB使用export default的方式导出，所以导入的时候可以取任意名称
import HelloB from './ComponentB';

//这种形式??
// import from './ComponentC';

console.log(A, test, Hello);
console.log(ComponentA.A, ComponentA.test, ComponentA.Hello);
console.log(HelloB.A)
console.log(caSub.foo())
console.log(caSub2Hello1())
console.log(caSub2Hello2())

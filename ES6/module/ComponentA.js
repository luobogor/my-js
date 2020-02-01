export let A = 123;

export function test() {
  console.log('test');
}

export class Hello {
  test() {
    console.log('class');
  }
}

// 相当于重定向所有非default模块作为 caSub2 导出
// 即 export const caSub2 = xxxxx
export { default as caSub2Hello1, hello2 as caSub2Hello2 } from './ComponentA-sub2'

// 相当于重定向 default 模块
// 即 export default xxx
export { default } from './ComponentA-sub'

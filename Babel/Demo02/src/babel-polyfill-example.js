require('babel-core/register')({});
// 不用'babel-polyfill'也能跑？？
// require('babel-polyfill');

async function a() {
    console.log('begin');
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000)
    });
    console.log('done');
}

a();

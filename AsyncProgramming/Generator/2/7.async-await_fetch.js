require("babel-core/register");

const fetchAsync = async function (url) {
    //使用 await 后，写异步代码就像写同步代码一样爽。await 后面可以跟 Promise 对象，表示等待 Promise resolve() 才会继续向下执行，
    // 如果 Promise 被 reject() 或抛出异常则会被外面的 try...catch 捕获。
    try {
        let response = await fetch(url);
        let data = response.json(response);
        console.log(data);
        return 'done';
    } catch (e) {
        console.log("Oops, error", e);
        return e.message;
    }
};

fetchAsync('url').then(msg => {
    console.log(msg);
});


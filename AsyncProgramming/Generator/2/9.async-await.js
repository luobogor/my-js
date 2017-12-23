const fs = require('fs');
require("babel-core/register");
const readFilePromise = function (fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data.toString())
            }
        })
    })
};

const readFileAsync = async function () {
    const f1 = await readFilePromise('./TestFile/json1.json');
    const f2 = await readFilePromise('./TestFile/json2.json');
    console.log('json1.json', f1.toString());
    console.log('json2.json', f2.toString());
    return 'done';
};

const result = readFileAsync();

result.then(data=>{
    console.log(data);
});
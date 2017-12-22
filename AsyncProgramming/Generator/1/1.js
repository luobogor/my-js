var fs = require('fs');

const readFilePromise = function (fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            resolve(data.toString());
        });
    });
};

readFilePromise('../TestFile/json1.json').then(data => {
    console.log('*******************');
    console.log(data);
    return readFilePromise('../TestFile/json2.json');
}).then(data => {
    console.log('*******************');
    console.log(data);
    return readFilePromise('../TestFile/json3.json');
}).then(data => {
    console.log('*******************');
    console.log(data);
});
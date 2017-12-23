var fs = require('fs');

const thunk = function (fileName, codeType) {
    return function (callback) {
        fs.readFile(fileName, codeType, callback);
    };
};

const readFileThunk = thunk('../TestFile/json1.json', 'utf-8');

readFileThunk((err,data) => {
    console.log(data);
});

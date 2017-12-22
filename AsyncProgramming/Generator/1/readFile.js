const readFilePromise = function (fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            resolve(data.toString());
        });
    });
};

module.exports = readFilePromise;
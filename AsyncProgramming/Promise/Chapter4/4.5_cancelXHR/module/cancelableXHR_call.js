//调用
var cancelXHR = require("./cancelableXHR");

var xhrPromise = cancelableXHR.createXHRPromise('http://httpbin.org/get');
xhrPromise.catch(function (error) {

});
cancelXHR.abortPromise(xhrPromise);
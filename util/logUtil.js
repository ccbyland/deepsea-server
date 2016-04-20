require("colors");

var dateUtil = require('../util/dateUtil.js');

var slice = Array.prototype.slice;

exports.info = function (message) {

    message = message || '';
    
    var args = slice.call(arguments);
    args[0] = ('[' + dateUtil.format(new Date(), 'yyyy-MM-dd hh:mm:ss') + '] ').yellow + message.yellow;
    console.log.apply(console, args);
};

exports.error = function (message) {

    console.log(message);
};

exports.success = function (message) {

    message = message || '';

    var args = slice.call(arguments);
    args[0] = ('[' + dateUtil.format(new Date(), 'yyyy-MM-dd hh:mm:ss') + '] ').green + message.green;
    console.log.apply(console, args);
};
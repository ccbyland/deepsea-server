/**
 * 目的地Dao类
 * @type {[type]}
 */
var BaseDao = require('./BaseDao.js'),
    models = require('../models/db.js'),
    destinationModel = models.destination,
    logUtil = require('../util/logUtil.js');

var destinationDao = function(){};
destinationDao.prototype = new BaseDao(destinationModel);

module.exports = destinationDao;
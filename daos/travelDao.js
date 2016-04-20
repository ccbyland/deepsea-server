/**
 * 游记Dao类
 * @type {[type]}
 */
var BaseDao = require('./BaseDao.js'),
    models = require('../models/db.js'),
    travelModel = models.travel,
    logUtil = require('../util/logUtil.js');

var travelDao = function(){};
travelDao.prototype = new BaseDao(travelModel);

module.exports = travelDao;
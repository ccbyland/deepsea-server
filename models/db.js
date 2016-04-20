/**
 * 数据库连接工具类
 * @type {[type]}
 */
var mongoose = require('mongoose'),
    fs = require('fs'),
    config = require('../config/serviceConfig.js'),
    log = require('../util/logUtil.js');

//连接mongodb
mongoose.connect(config.connection);
mongoose.connection.on('error', function(err) {

    log.error(config.connection + '连接失败...');
    process.exit(1); //立即退出当前进程
});
mongoose.connection.once('open', function() {

    log.success(config.connection + '连接成功...');
});

// 注册模型
var modelsPath = __dirname + '/mapping/';
fs.readdirSync(modelsPath).forEach(function(file) {

    // 载入所有的model
    require(modelsPath + '' + file);

    // 对外提供访问模型接口
    var modelName = file.replace('Model.js', '');
    exports[modelName] = mongoose.model(modelName);
});
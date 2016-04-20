var async = require('async'),
    UFile = require('../../util/fileUtil.js'),
    ULog = require('../../util/logUtil.js'),
    UDate = require('../../util/dateUtil.js'),
    tDao = require('../../daos/travelDao.js'),
    config = require('../../config/serviceConfig.js');

/**
 * 检查当前ID是否存在 
 */
function findTravel(id, callback) {

    tDao.prototype.countByQuery({
        'id': id
    }, function(err, count) {

        if (err) {
            ULog.error('findTravel error：' + err);
        }

        callback(count)
    });
}

/**
 * 保存攻略列表
 */
exports.saveTravelList = function(list, callback) {

    ULog.info('保存旅行攻略列表开始...');

    var uCount = 0,
        aCount = 0;

    async.eachSeries(list, function(item, next) {

        var preview_img_src = item.preview_img_src;

        async.series([

            // 保存图片
            function(done) {

                UFile.saveImg({
                    old_url: preview_img_src,
                    save_path: config.crawler.travelstrategy.imgSavePath,
                    callback: function(result) {

                        item.preview_img_src = config.imageServerHost + config.crawler.travelstrategy.imgReadPath + result.new_name;
                        done();
                    }
                });
            },

            // 保存数据
            function(done) {

                findTravel(item.id, function(count) {

                    item.update_data = UDate.format(new Date(), 'yyyy-MM-dd hh:mm:ss');

                    if (count) {

                        tDao.prototype.update({
                            'id': item.id
                        }, item, {}, function(data) {
                            uCount++;
                            next();
                        });
                    } else {

                        item.create_data = UDate.format(new Date(), 'yyyy-MM-dd hh:mm:ss');

                        tDao.prototype.create(item, function(data) {
                            aCount++;
                            next();
                        });
                    }
                });
            }

        ], function(err) {

            if (err) {
                ULog.error('saveTravelList error：' + err);
                return;
            }
        });

    }, function() {

        ULog.info('保存旅行攻略列表结束，新增' + aCount + '条，更新' + uCount + '条');
        callback();
    });
}

/**
 * 保存攻略详情
 */
exports.saveTravelDetail = function(list, callback) {

    ULog.info('保存旅行攻略详情开始...');

    var succCount = 0,
        errCount = 0;

    async.eachSeries(list, function(item, next) {

        findTravel(item.id, function(count) {

            if (count) {
                tDao.prototype.update({
                    'id': item.id
                }, item, {}, function(error) {
                    succCount++;
                    next();
                });

            } else {
                errCount++;
                ULog.error('saveTravelDetail error：' + '旅行攻略数据丢失，ID=' + item.id);
                next();
            }
        });

    }, function() {

        ULog.info('保存更新旅行攻略详情结束，更新' + succCount + '条，失败' + errCount + '条');
        callback();
    });
}
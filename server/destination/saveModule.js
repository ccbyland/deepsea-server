var async = require('async'),
    UFile = require('../../util/fileUtil.js'),
    ULog = require('../../util/logUtil.js'),
    UDate = require('../../util/dateUtil.js'),
    dDao = require('../../daos/destinationDao.js'),
    config = require('../../config/serviceConfig.js');

/**
 * 检查当前ID是否存在 
 */
function findDestination(id, callback){

    dDao.prototype.countByQuery({'id' : id}, function(err, count){

        if(err){
            ULog.error(err);
        }

        callback(count)
    });
}

/**
 * 保存目的地列表
 */
exports.saveDestinationList = function(list, callback){

    ULog.info('保存目的地列表开始...');

    var uCount = 0,
        aCount = 0;

    async.eachSeries(list, function(item, next){

        findDestination(item.id, function(count){

            item.update_data = UDate.format(new Date(), 'yyyy-MM-dd hh:mm:ss');  

            if(count){
                
                dDao.prototype.update({'id' : item.id}, item, {}, function(data){
                    uCount++;
                    next();
                });

            }else{

                item.create_data = UDate.format(new Date(), 'yyyy-MM-dd hh:mm:ss');
                
                dDao.prototype.create(item, function(data){
                    aCount++;
                    next();
                });
            }
        });

    }, function(){

        ULog.info('保存目的地列表结束，新增'+ aCount +'条，更新'+ uCount +'条');
        callback();
    });
}

/**
 * 保存目的地详情
 */
exports.saveDestinationDetail = function(item, callback, succCount, errCount){

    findDestination(item.id, function(count){

        if(count){

            async.series([

                // 保存图片
                function(done){
                    
                    UFile.saveImg({
                        old_url : item.img_url,
                        save_path : config.crawler.destination.imgPath,
                        callback : function(result){
                                
                            item.img_url = result.new_url || '';
                            done();
                        }
                    });
                },

                // 保存PDF
                // function(done){
                //     UFile.savePdf({
                //         old_url : 'http://www.mafengwo.cn/mdd/book_down.php?type=pdfdown&mddid=11100',
                //         save_path : config.crawler.destination.pdfPath,
                //         callback : function(result){
                //             item.pdf_url = result.new_url || '';
                //             done();
                //         }
                //     });
                // },

                // 保存数据
                function(done){

                    dDao.prototype.update({'id' : item.id}, item, {}, function(data){
                        callback(++succCount, errCount);
                        done();
                    });
                }

            ], function(err){

                if(err){
                    ULog.error(err);
                    return;
                }
            });

        }else{

            callback(succCount, ++errCount);
        }
    });
}
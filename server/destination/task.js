var async = require('async'),
    rm = require('./readModule.js'),
    sm = require('./saveModule.js'),
    config = require('../../config/serviceConfig.js'),
    ULog = require('../../util/logUtil.js');

var destinationList = [],//目的地列表
    destinationDetailList = [];//目的地详情列表

async.series([

    // 读取目的地列表
    function(done){

        rm.readDestinationList(config.crawler.destination.url, function(err, list){

            if(err){
                Ulog.error(err);
            }

            destinationList = list;
            done(err);
        });
    },

    // 保存目的地列表
    function(done){

        sm.saveDestinationList(destinationList, done);
    },

    // 读取目的地详情
    function(done){

        ULog.info('读取目的地详情开始...');
        
        async.eachSeries(destinationList, function(item, next){

            rm.readDestinationDetail(item, function(err, destination){

                if(err){
                    ULog.error(err);
                }else{
                    destinationDetailList[destinationDetailList.length] = destination;
                    next(err);
                }

                if(destinationDetailList.length == destinationList.length){
                    ULog.info('读取目的地详情结束');
                    done();
                }
            });
        });
    },

    // 保存目的地详情列表
    function(done){

        ULog.info('保存目的地详情开始...');
        
        var succCount = 0, errCount = 0;

        async.eachSeries(destinationDetailList, function(item, next){

            sm.saveDestinationDetail(item, function(s, e){

                succCount = s, errCount = e;

                if(succCount + errCount == destinationDetailList.length){

                    ULog.info('保存目的地详情结束，成功'+ succCount +'条，失败'+ errCount +'条');
                    done();

                }else{
                    next();
                }

            }, succCount, errCount);
        });
    }

], function(err){

    if(err){
        ULog.error(err);
        return;
    }
});
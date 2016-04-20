var async = require('async'),
    rm = require('./readModule.js'),
    sm = require('./saveModule.js'),
    config = require('../../config/serviceConfig.js'),
    ULog = require('../../util/logUtil.js');
    
var travelstrategyList = [],//旅行攻略列表
    travelstrategyDetailList = [];//旅行攻略详情列表

async.series([

    // 读取攻略列表
    function(done){

        rm.readTravelList(config.crawler.travelstrategy.url, function(err, list){

            if(err){
                Ulog.error('readTravelList error：' + err);
            }

            travelstrategyList = list;
            done(err);
        });
    },

    // 保存攻略列表
    function(done){

        sm.saveTravelList(travelstrategyList, done);
    },

    // 读取攻略详情
    function(done){
        
        ULog.info('读取旅行攻略详情开始...');
        
        async.eachSeries(travelstrategyList, function(item, next){

            rm.readTravelDetail(item, function(err, travelstrategy){

                if(err){
                    ULog.error('readTravelDetail error：' + err);
                }else{
                    travelstrategyDetailList[travelstrategyDetailList.length] = travelstrategy;
                    next(err);
                }

                if(travelstrategyList.length == travelstrategyDetailList.length){
                    ULog.info('读取旅行攻略详情结束');
                    done();
                }
            });
        });
    },

    // 保存攻略详情
    function(done){

        sm.saveTravelDetail(travelstrategyDetailList, done);
    }

], function(err){

    if(err){
        ULog.error('async.series error：' + err);
        return;
    }
});
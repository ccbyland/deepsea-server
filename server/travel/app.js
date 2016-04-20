var child_process = require('child_process'),
    cronJob = require('cron').CronJob,
    path = require('path'),
    config = require('../../config/serviceConfig.js'),
    ULog = require('../../util/logUtil.js');

new cronJob(config.crawler.travelstrategy.autoUpdateFrequency, function() {

    ULog.info('【旅行攻略】定时服务已开始...');

    var free = child_process.spawn('node', [path.resolve(__dirname, 'task.js')]);

    // 捕获标准输出并将其打印到控制台 
    free.stdout.on('data', function(data) {
        console.log('\n' + data);
    });

    // 捕获标准错误输出并将其打印到控制台 
    free.stderr.on('data', function(data) {
        //console.log('\n' + data);
    });

    // 注册子进程关闭事件 
    free.on('exit', function(code, signal) {
        //console.log('\n' + code);
    });

}, null, true, "America/Los_Angeles");
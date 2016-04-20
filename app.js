// 依赖加载
var express = require('express');
var path = require('path');

// 创建项目实例
var app = express();

// 调度任务中心
require('./server/dispatch_center.js');

// 路由
app.get('/', function(req, res){
    res.send('【深海】调度中心');
});

// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'upload')));

// 定义输出模块接口
module.exports = app;
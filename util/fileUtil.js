var fs = require("fs"),
    UStr = require('./stringUtil.js'),
    UDate = require('./dateUtil.js'),
    UHttp = require('./httpUtil.js'),
    request = require('request'),
    pdfkit = require('pdfkit'),
    nodegrass = require('nodegrass');//http模块

/**
 * 创建目录
 * path 目录路径
 * mode 目录权限编码 
 * cb 回调函数
 */
exports.mkdirSync = function(path, mode, cb){

    var arr = path.split("/");

    mode = mode || 0755;
    cb = cb || function(){};

    if(arr[0]==="."){
        arr.shift();
    }

    if(arr[0] == ".."){
        arr.splice(0,2,arr[0]+"/"+arr[1])
    }

    function inner(cur){

        if(!fs.existsSync(cur)){
            fs.mkdirSync(cur, mode)
        }

        if(arr.length){
            inner(cur + "/"+arr.shift());
        }else{
            cb();
        }
    }
    
    arr.length && inner(arr.shift());
}

/**
 * 保存图片
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.saveImg = function(options){

    var oldFileUrl = options.old_url,
        newFilePath = options.save_path;

    if(!oldFileUrl){
        options.callback({
            'error' : '地址不存在'
        });
        return;
    }

    // 检测目录，没有则创建
    this.mkdirSync(newFilePath);
    
    // 保存图片
    nodegrass.get(oldFileUrl, function(data, status, headers){

        var new_name = UDate.format(new Date(), 'yyyyMMddhhmmss') + UStr.getRandom(6) + '.jpeg';
            new_url = newFilePath + '/' + new_name;

        fs.writeFile(new_url, data, "binary", function(err){

            options.callback({
                'error' : err,
                'new_name' : new_name
            });
        });

    }, 'binary');

}

/**
 * 保存PDF
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.savePdf = function(options){

    var oldFileUrl = options.old_url,
        newFilePath = options.save_path;

    if(!oldFileUrl){
        options.callback({
            'error' : '地址不存在'
        });
        return;
    }

    // 检测目录，没有则创建
    this.mkdirSync(newFilePath);

    UHttp.request(oldFileUrl, function(err, args, headers, data){

        var new_url = newFilePath + '/' + UDate.format(new Date(), 'yyyyMMddhhmmss') + UStr.getRandom(6) + '.pdf';

        fs.writeFile(new_url, data, "binary", function(err){

            options.callback({
                'error' : err,
                'new_url' : new_url
            });
        });
    });

    // var pdf = new pdfkit();

    // var new_url = newFilePath + '/' + UDate.format(new Date(), 'yyyyMMddhhmmss') + UStr.getRandom(6) + '.pdf';

    // pdf.pipe(fs.createWriteStream(new_url));

    // // 保存PDF
    // nodegrass.get(oldFileUrl, function(data, status, headers){

    //     pdf.writeFile(data, 100, 100);
    //     pdf.end();

    //     options.callback({
    //         'new_url' : new_url
    //     });

    // }, 'binary');

}
var originRequest = require('request'),
    cheerio = require('cheerio'),
    zlib = require('zlib'),
    url = require('url'),
    config = require('../../config/serviceConfig.js'),
    UHttp = require('../../util/httpUtil.js'),
    ULog = require('../../util/logUtil.js'),
    UStr = require('../../util/stringUtil.js');

var gunzipStream = zlib.createGunzip();

/**
 * 请求指定URL
 */
function request(url, callback){

    originRequest(url, callback);
}

/**
 * 读取目的地列表
 */
exports.readDestinationList = function(_url, callback){

    ULog.info('读取目的地列表开始...');

    UHttp.request(_url, function(err, args, headers, data){

        if(err){
            return callback(err);
        }

        var $ = cheerio.load(data, {decodeEntities: false});

        var destinationList = [];

        var filter = config.crawler.destination.filter;

        $('div.container').find('div.row').last().find('li').each(function(){

           
            var $this = $(this), item = {};

            $this.find('span').remove();
            var text = $this.text().trim(),
                href = $this.find('a').attr('href'),
                _u = url.parse(_url);

            if(filter.indexOf(text) > -1){
                item = {
                    'id' : href.substring(href.lastIndexOf('/') + 1,href.lastIndexOf('.')),
                    'name' : text,
                    'url' : _u['protocol'] + '//' + _u['host'] + href
                }
                destinationList[destinationList.length] = item;
            }
            
        });
        ULog.info('读取目的地列表结束');
        typeof callback == 'function' && callback(null, destinationList);
    });

}

/**
 * 读取目的地详情 
 */
exports.readDestinationDetail = function(destination, callback){

    var _url = destination.url;

    // 读取详情页面地址
    UHttp.request(_url, function(err, args, headers, data){

        if(err){
            return callback(err);
        }

        var $ = cheerio.load(data, {decodeEntities: false});
        var $gonglve = $('div.row-gonglve');

        // banner图地址
        destination['img_url'] = $('div.screen a.photo img').attr('src');

        var pdf_url, _u = url.parse(_url);

        // PDF文件
        if($gonglve.find('ul.gl-list').length){//存在多本攻略，只取第一本
            pdf_url = $gonglve.find('ul.gl-list').find('li').eq(0).find('a').attr('href');
        }else{//只取唯一的一本
            pdf_url = $('div.row-gonglve').find('a.btn-pdf').attr('href');
        }

        pdf_url = _u['protocol'] + '//' + _u['host'] + pdf_url;

        // // 读取PDF地址
        // UHttp.request(pdf_url, function(err, args, headers, data){

        //     if(err){
        //         return callback(err);
        //     }

        //     var $ = cheerio.load(data, {decodeEntities: false});

        //     var $down_glb = $('div.down_glb');

        //     destination.pdf_url = $down_glb.find('div.down_p').find('a').attr('href');
            
            typeof callback == 'function' && callback(null, destination);
        // });
    });
}
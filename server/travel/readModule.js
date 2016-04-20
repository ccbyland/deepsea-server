var originRequest = require('request'),
    cheerio = require('cheerio'),
    zlib = require('zlib'),
    url = require('url'),
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
 * 读取攻略列表
 */
exports.readTravelList = function(url, callback){

    ULog.info('读取旅行攻略列表开始...');

    request({
        url : url,
        method : 'get'
    }, function(err, res){

        if(err){
            return callback(err);
        }

        var $ = cheerio.load(res.body.toString());
        var travelstrategyList = [];

        $('#_j_tn_content div.tn-item').each(function(){

            var $this = $(this);

            var $wrapper = $this.find('div.tn-wrapper'),
                $image = $this.find('div.tn-image');

            var tn = $wrapper.find('span.tn-nums').text();
            var item = {
                'id' : $wrapper.find('span.tn-ding a').attr('data-iid'),//ID
                'title' : $wrapper.find('dl dt a').text(),//标题
                'short_content' : $wrapper.find('dl dd a').text(),//内容
                'place' : $wrapper.find('span.tn-place a').text(),//地点
                'author' : $wrapper.find('span.tn-user img').attr('alt'),//作者
                'browse_num' : tn.substring(0, tn.indexOf('/')),//浏览人数
                'comment_num' : tn.substring(tn.indexOf('/') + 1),//评论人数
                'praise_num' : $wrapper.find('span.tn-ding a').attr('data-vote'),//点赞人数
                'preview_img_src' :$image.find('img').attr('src'),//预览图地址
                'detail_location' :  url + $image.find('a').attr('href')//详情页地址
            }

            travelstrategyList[travelstrategyList.length] = item;
        });

        ULog.info('读取旅行攻略列表结束');

        typeof callback == 'function' && callback(null, travelstrategyList);
    });

}

/**
 * 读取攻略详情 
 */
exports.readTravelDetail = function(travel, callback){

    UHttp.request(travel.detail_location, function(err, args, headers, data){

        if(err){
            return callback(err);
        }

        var $ = cheerio.load(data, {decodeEntities: false});

        var _travel = {},
            _content = [];

        $('div.view div.va_con').children().each(function(){

            var $this = $(this), _type = '', _val = '', _tag  = '';

            if($this.hasClass('article_title')){//分段导航

                _type = 1;
                _val = '';
                _tag = $this.find('span._j_anchor').text();

            }else if($this.hasClass('_j_note_content')){//文本段落

                _type = 2;
                _val = UStr.htmlToTextByRm_a_img($this.html());

            }else if($this.hasClass('add_pic')){//图片

                _type = 3;
                _val = $this.find('img._j_lazyload').attr('data-src');
                _tag = $this.find('spna.pic_tag').text();
            }

            if(_type){
                _content[_content.length] = {
                    type : _type,
                    val : _val,
                    _tag : _tag
                }
            }
        });

        _travel = {
            id : travel.id,
            long_content : JSON.stringify(_content)
        }

        typeof callback == 'function' && callback(null, _travel);
    });
}
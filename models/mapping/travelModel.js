/**
 * 旅行攻略Model类
 * @type {[type]}
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({

    'id': String, //id
    'title': String, //标题
    'short_content': String, //内容
    'place': String, //地点
    'author': String, //作者
    'browse_num': Number, //浏览人数
    'comment_num': Number, //评论人数
    'praise_num': Number, //点赞人数
    'preview_img_src': String, //预览图地址
    'detail_location': String, //详情页地址
    'long_content': String, //详细内容

    'create_data': String, //创建日期
    'update_data': String //更新日期
});

mongoose.model('travel', schema);
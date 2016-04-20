 /**
  * 目的地Model类
  * @type {[type]}
  */
 var mongoose = require('mongoose'),
 	Schema = mongoose.Schema;

 var schema = new Schema({

 	"id": String,//id
 	"name": String,//名称
 	"img_url": String,//图片url
 	"pdf_url": String,//pdf url

 	'create_data': String, //创建日期
 	'update_data': String //更新日期
 });

 mongoose.model('destination', schema);
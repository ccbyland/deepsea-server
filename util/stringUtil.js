/**
 * Unicode码抓换
 */
exports.hexToDec = function(str){
    return unescape(str.replace(/&#x/g,'%u').replace(/;/g,''));
}

/**
 * html字符串转文本，去除a，img标签
 */
exports.htmlToTextByRm_a_img = function(str){
	return str.replace(/<a[^>]*>/g,'').replace(/<\/a>/g,'').replace(/<img[^>]*>/g,'');
}

exports.getRandom = function(n) {

    var jschars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    var res = "";
    for(var i = 0; i < n ; i ++) {
        var id = Math.ceil(Math.random()*35);
        res += jschars[id];
    }
    return res;
}
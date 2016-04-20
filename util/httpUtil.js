var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    zlib = require('zlib'),
    querystring = require('querystring');

exports.request = function(u, callback){

    var _url = url.parse(u),
        _host = _url['host'].split(':')[0],
        _port = _url['port'] ? _url['port'] : 80,
        _path = _url['path'];

    var args = {
        contents : querystring.stringify({
            name: url
        })
    };

    var options = {
        host: _host,
        port: _port,
        path: _path,
        method: 'get',
        headers: {
            'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Content-Length': args.contents.length,
            'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.11 Safari/537.36',
            'Accept-Encoding':'gzip, deflate'
       }
    }

    var req = http.request(options, function (res) {

        var chunks =[],
            data, 
            encoding = res.headers['content-encoding'];

        // 非gzip/deflate要转成utf-8格式
        if( encoding === 'undefined'){
            res.setEncoding('utf-8'); 
        }

        res.on('data', function (chunk){
            chunks.push(chunk);
        }); 

        res.on('end', function (){

            var buffer = Buffer.concat(chunks);

            if (encoding == 'gzip') {
                zlib.gunzip(buffer, function (err, decoded) {
                    data = decoded.toString();
                    callback( err, args, res.headers, data);
                });
            } else if (encoding == 'deflate') {
                zlib.inflate(buffer, function (err, decoded) {
                    data = decoded.toString();
                    callback( err, args, res.headers, data); 
                });
            } else {
                data = buffer.toString();
                callback( null, args, res.headers, data);
            } 
        });
    });
    
    req.write(args.contents); 
    req.end();
}
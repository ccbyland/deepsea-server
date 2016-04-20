module.exports = {

    /**
     * 格式
     * mongodb://[username:password@]host:port/database[?options]
     * @type {String}
     */
    connection : 'mongodb://admin:byland99@120.25.149.98:27017/deepsea',

    /**
     * 图片服务器
     */
    imageServerHost : 'http://image.deepsea-sh.com',

    /**
     * 爬虫服务
     * @type {Object}
     */
    crawler : {

        // 旅行攻略
        travelstrategy : {
            url : 'http://www.mafengwo.cn/',//马蜂窝
            autoUpdateFrequency : '* 15 * * * *',//每小时第0分钟运行一次
            imgSavePath : '../../upload/img/travel',//img存储地址
            imgReadPath : '/img/travel/'//img访问地址
        },

        // 目的地
        destination : {
            url : 'http://www.mafengwo.cn/mdd/',//马蜂窝
            autoUpdateFrequency : '* 45 * * * *',//每小时第30分钟运行一次
            filter : "英国,泰国,意大利",
            imgPath : '../../upload/img/destination',
            pdfPath : '../../upload/pdf/destination'
        }
    }
}
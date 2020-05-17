/**
 * Module dependencies.
 */

ApiClient = require('../index.js').ApiClient;

const client = new ApiClient({
    'appkey':'24808252',
    'appsecret':'25394001ed7c0f2aff6cb31750e865f0',
    'url':'http://gw.api.taobao.com/router/rest'
});

client.execute('taobao.tbk.tpwd.create',
    {
        'text':'长度大于5个字符',
        'url':'https://media.tmall.com/item.htm?id=548075169457&price=89-238&sourceType=item&sourceType=item',
        'logo':'https://uland.taobao.com/',
    },
    function (error,response) {
        if(!error)
            console.log(response);
        else
            console.log(error);
    }
);
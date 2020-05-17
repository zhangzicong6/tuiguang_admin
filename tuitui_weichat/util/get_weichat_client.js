// var weichat_conf = require('../conf/weichat.json');
var ConfigModel = require('../model/Config');
var WechatAPI = require('wechat-api');
var Memcached = require('memcached');
var memcached = new Memcached('127.0.0.1:11211');
var mem = require('../util/mem.js');

async function getClient(code) {
    var config = await mem.get("configure_" + code);
    if (!config) {
        config = await ConfigModel.findOne({code: code})
        await mem.set("configure_" + code, config, 30 * 24 * 3600)
    }
    // var config=weichat_conf[code];
    var api = new WechatAPI(config.appid, config.appsecret,
        function getToken(callback) {
            // console.log('----- getToken ----')
            memcached.get('access_token' + code, function (err, token) {
                // console.log(token)
                if (token) {
                    callback(null, JSON.parse(token));
                } else {
                    callback(null, null);
                }
            });
        },
        function saveToken(token, callback) {
            console.log('----- saveToken ----')
            memcached.set('access_token' + code, JSON.stringify(token), 5 * 60, callback)
        });
    return api;
}

module.exports.getClient = getClient;

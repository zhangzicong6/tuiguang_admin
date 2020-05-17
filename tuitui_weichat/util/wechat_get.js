var TokenModel = require('../model/Token.js');
// var weichat_conf = require('../conf/weichat.json');
var ConfigModel = require('../model/Config');
var WechatAPI = require('wechat-api');
var Memcached = require('memcached');
var memcached = new Memcached('127.0.0.1:11211');
var weichat_apis = {};
var mem = require('../util/mem.js');

async function getClient(code) {
    var config = await mem.get("configure_" + code);
    if (!config) {
        config = await ConfigModel.findOne({code: code})
        console.log(config, '----------------config')
        await mem.set("configure_" + code, config, 30 * 24 * 3600)
    }
    console.log(config, config.appid, config.appsecret, '----------------config1')
    var api = new WechatAPI(config.appid, config.appsecret);
    return api;
}


function getQr(code, openid, book_id, next) {
    var content = JSON.stringify({openid: openid, book: book_id});
    memcached.get(content, function (err, ticket) {
        if (err) {
            console.log(err);
        }
        if (ticket) {
            next(null, ticket);
        } else {
            var client = getClient(code);
            client.createTmpQRCode(content, 2592000, function (err, reslut) {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                memcached.set(content, reslut.ticket, 2592000, function (err) {
                });
                memcached.set(reslut.ticket, content, 2592000, function (err) {
                });
                next(null, reslut.ticket);
            });
        }
    });
}

function getuserQr(code, openid, next) {
    var content = JSON.stringify({openid: openid});
    memcached.get(content, function (err, ticket) {
        console.log(ticket, '-------------------ticket')
        if (err) {
            console.log(err);
        }
        if (ticket) {
            next(null, ticket.split('_')[1]);
        } else {
            var client = getClient(code);
            client.createTmpQRCode(content, 2592000, function (err, result) {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                memcached.set(content, 'user_' + result.ticket, 2592000, function (err) {
                });
                memcached.set('user_' + result.ticket, content, 2592000, function (err) {
                });
                next(null, result.ticket);
            });
        }
    });
}

function QRCode() {
    var client = getClient(['1']);
    client.createLimitQRCode('book_id:239', function (err, reslut) {
        if (err) {
            console.log(err);
        }
        var qr_url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + reslut.ticket;
        console.log(qr_url);

    });
}

//QRCode();

module.exports.getClient = getClient;
module.exports.getQr = getQr;
module.exports.getuserQr = getuserQr;
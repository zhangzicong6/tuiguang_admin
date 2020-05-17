var express = require('express');
var router = express.Router();
var UserModel = require('../model/User.js');
var moment = require('moment');
var UserAlipayCashModel = require('../model/UserAlipayCash.js');
// var weichat_conf = require('../conf/weichat.json');
var ConfigModel = require('../model/Config');
var mem = require('../util/mem.js');
var async = require('async');
var cash = require('../script/cash');
var request = require('request');


router.use('/redirect/:wechat', function (req, res, next) {
    var async = require('async');
    async.waterfall([
        function (callback) {
            getOpenid(req, res, callback);
        },
        function (callback) {
            var wechat = req.params.wechat;
            var openid = req.session['wechat_' + wechat];
            console.log(openid);
            UserModel.findOne({openid: openid}, {openid: 1, current_balance: 1}, function (error, user) {
                callback(error, user);
            });
        },
        function (user, callback) {
            UserAlipayCashModel.find({openid: user.openid}, {
                price: 1,
                updateAt: 1,
                status: 1,
                wechat_number: 1,
                payee_real_name: 1,
                payee_account: 1,
                err_msg: 1
            }, {sort: {updateAt: -1}, limit: 10}, function (error, cashs) {
                callback(error, user, cashs);
            });
        }
    ], function (error, user, cashs) {
        if (error) {
            next(error);
        }
        //return res.send({user:user,cashs:cashs});

        return res.render('alipay/index', {user: user, cashs: cashs, wechat: req.params.wechat});
    });
});

router.post('/cash', function (req, res, next) {
    var wechat = req.body.wechat;
    var openid = req.body.openid;
    //req.session['wechat_'+wechat] = 'o3qBK0RXH4BlFLEIksKOJEzx08og';
    if (!openid) {
        return res.send({code: -1, message: '操作超时，请重试'});
    }
    var cash = {}
    cash.wechat_number = req.body.wechat_number;
    cash.payee_real_name = req.body.payee_real_name;
    cash.payee_account = req.body.payee_account;
    cash.price = parseFloat(req.body.price);
    cash.openid = openid;
    cash.out_biz_no = uuid(16, 16);
    cash.code = wechat;

    if (cash.price < 1) {
        return res.send({code: -1, message: '提现金额需大于等于1元'});
    }
    async.waterfall([
        function (callback) {
            UserModel.findOne({openid: openid}, {openid: 1, current_balance: 1}, function (error, user) {
                if (error) {
                    return callback(error, null);
                }
                if (parseFloat(user.current_balance.toFixed(2)) >= parseFloat(cash.price.toFixed(2))) {
                    user.current_balance = parseFloat((user.current_balance - cash.price).toFixed(2));
                    user.save();
                    return callback(null, user);
                } else {
                    return callback({code: -1, message: '用户提现金额大于总金额'});
                }
            });
        },
        function (user, callback) {
            UserAlipayCashModel.create(cash, function (error, res) {
                if (error) {
                    return callback(error, null);
                }
                callback(null, user, cash);
            });
        }
    ], function (error, user, cash) {
        if (error) {
            if (error.code) {
                return res.send(error);
            } else {
                console.error(error);
                return res.send({code: -1, message: '服务器开小差了，程序猿们马上解决'});
            }
        }
        return res.send({code: 1, message: '提交成功	'});
    });
});

router.get('/script', function (req, res, next) {
    var s = cash.exec_cash();
    if (!s) {
        s = '提现请求成功'
    }
    res.send(s);
});

function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data. At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

function getDateStr(date) {
    return moment(date).format('YYYY/MM/DD');
}

function text_status(status) {
    switch (status) {
        case 0:
            return '待审核';
        case 1:
            return '审核通过';
        case 2:
            return '付款中';
        case 3:
            return '已提现';
        case -1:
            return '审核失败';
        case -2:
            return '付款失败';
    }
}

async function getOpenid(req, res, callback) {
    var wechat = req.params.wechat;
    var openid = req.session['wechat_' + wechat];
    var code = req.query.code;
    if (!openid) {
        /*req.session['wechat_'+wechat] = 'o3qBK0RXH4BlFLEIksKOJEzx08og';
         return callback();*/
        var configure = await mem.get("configure_" + wechat);
        if (!configure) {
            configure = await ConfigModel.findOne({code: wechat})
            await mem.set("configure_" + wechat, configure, 30 * 24 * 3600)
        }
        if (!code) {
            var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + configure.appid + "&redirect_uri=" + encodeURIComponent('http://' + req.hostname + req.originalUrl) + "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
            res.redirect(url);
        } else {
            var api_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + configure.appid + "&secret=" + configure.appsecret + "&code=" + code + "&grant_type=authorization_code";
            request(api_url, function (err, response, body) {
                body = JSON.parse(body);
                req.session['wechat_' + req.params.wechat] = body.openid;
                callback(null);
            });
        }
    } else {
        callback(null);
    }
}

module.exports = router;
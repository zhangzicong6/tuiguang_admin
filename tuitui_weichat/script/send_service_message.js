var WechatAPI = require('wechat-api');
var weichat_conf = require('../conf/weichat.json');
var schedule = require("node-schedule");
var pro_conf = require('../conf/proj.json');
var UserModel = require('../model/Userconf');
var UserWaitMessageModel = require('../model/UserWaitMessage.js');
var async = require('async');
var send_codes = require('../conf/proj.json').send_wechat;
var clients = {}

send_codes.forEach(function (item) {
    var config = weichat_conf[item]
    var client = new WechatAPI(config.appid, config.appsecret);
    clients[item] = client
})


function next_up(_id) {
    if (_id) {
        return copy_user(_id, next_up);
    } else {
        console.log('copy_user end');
        return;
    }
}

function get_user() {
    copy_user(null, next_up);
}

function next_up1(_id){
    if(_id){
        return send_message(_id,next_up1);
    }else{
        console.log('send_message end');
        return;
    }
}

function get_message(){
    send_message(null,next_up1);
}

function copy_user(_id, next) {
    //从用户表拷贝到信息表
    UserModel.fetch(_id,pro_conf.send_wechat, function (err, users) {
        console.log('users：'+users.length);
        users.forEach(function (user) {
            var openid = user.openid;
            var code = user.code;
            UserWaitMessageModel.findOne({"openid": openid, "code": code}, function (err, user) {
                if (!user) {
                    new UserWaitMessageModel({
                        "openid": openid,
                        "code": code,
                        "status": 0,
                        "user_status": 0,
                        "action_time": 0
                    }).save();
                }
            })
        })
        console.log('copy_user next');
        if (users.length == 50) {
            return next(users[49]._id);
        } else {
            return next(null);
        }
    })
}

function send_message(_id, next) {
    //发送消息
    var strs = {
        0: "你平时用淘宝吗？",
        1: "平时用淘宝优惠券吗",
        2: "是不知道怎么用优惠券吗",
        3: "淘宝商家为了冲击销量和刷单，90%以上的商品都有隐藏优惠券，你发我链接可以查询优惠券",
        4: "商品链接直接分享给我，可以直接领取优惠券，或者搜索+商品名称哦，比如您要找袜子，就发:搜索袜子"
    }

    UserWaitMessageModel.fetch(_id,function (err, users) {
        console.log('--------扫描信息表-----'+users.length)
        users.forEach(function (user) {

            if (user.status == user.user_status && strs[user.status]) {
                clients[user.code].sendText(user.openid, strs[user.status], function (err, result) {
                    if(err){
                        console.log(err);
                    }else{
                        UserWaitMessageModel.findOneAndUpdate({oenid: user.openid}, {$inc: {status: 1}},function(err){})
                    }
                });
            }
            if (user.status != user.user_status && strs[user.status] && (new Date().getTime() - user.updateAt.getTime()) > 2 * 3600 * 1000) {
                clients[user.code].sendText(user.openid, strs[user.status], function (err, result) {
                    if(err){
                        console.log(err);
                    }else{
                        UserWaitMessageModel.findOneAndUpdate({oenid: user.openid}, {$inc: {status: 1}},function(err){})
                    }
                });
            }
        });
        console.log('send_message next');
        if (users.length == 50) {
            return next(users[49]._id);
        } else {
            return next(null);
        }
    })
}

var rule = new schedule.RecurrenceRule();
var times = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56];
rule.minute = times;
var j = schedule.scheduleJob(rule, function () {
    console.log('拷贝用户');
    get_user();
});

var rule1 = new schedule.RecurrenceRule();
var times1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58];
rule1.minute = times1;
var k = schedule.scheduleJob(rule1, function () {
    console.log("执行发送任务");
    if(new Date().getHours()>10 && new Date().getHours()<23) {
        console.log('发送消息');
        get_message();
    }
});

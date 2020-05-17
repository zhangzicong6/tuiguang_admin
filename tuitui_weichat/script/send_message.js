var wechat_util = require('../util/get_weichat_client');
var MessageModel = require('../model/Message');
var UserModel = require('../model/Userconf');
var async = require('async');
var flags = {};

function get_message(id) {
    if (!flags[id]) {
        flags[id] = true;
        MessageModel.findById(id).exec(function (err, message) {
            if (message) {
                send_users(null, message);
            } else {
                flags[id] = false;
                console.log('============= 未找到信息 ==========')
            }
        });
    } else {
        console.log('============= 当前信息正在执行中 ==========')
    }
}

async function send_users(user_id, message) {
    UserModel.fetch(user_id, message.sex, message.tagId, message.codes, function (err, users) {
        async.eachLimit(users, 10, function (user, callback) {
            wechat_util.getClient(user.code).then(function(client){
                if (message.type == 0) {
                    client.sendNews(user.openid, message.contents, function (err, res) {
                        console.log(err);
                        setTimeout(function () {
                            callback(null)
                        }, 50)
                    });
                } else if (message.type == 1) {
                    client.sendText(user.openid, message.contents[0].description, function (error, res) {
                        console.log(error);
                        setTimeout(function () {
                            callback(null)
                        }, 50)
                    })
                } else if (message.type == 2) {
                    client.sendImage(user.openid, message.mediaId, function (error, res) {
                        console.log(error);
                        setTimeout(function () {
                            callback(null)
                        }, 50)
                    })
                }
            });
        }, function (err) {
            if (users.length == 50) {
                send_users(users[49]._id, message);
            } else {
                flags[message._id] = false;
            }
        })
    });
}


module.exports.get_message = get_message

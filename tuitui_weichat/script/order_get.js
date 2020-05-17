var schedule = require("node-schedule");
var UserOrderModel = require('../model/UserOrder.js');
var TaobaoOrderModel = require('../model/TaobaoOrder.js');
var UserModel = require('../model/User.js');
var AddFreeOrderModel = require('../model/AddFreeOrder.js');

var WechatAPI = require('wechat-api');
var weichat_conf = require('../conf/weichat.json');
var weichat_apis = {};
var async = require('async');

function next_up(_id) {
    if (_id) {
        return update_order(_id, next_up);
    } else {
        console.log('end');
        return;
    }
}

function get_order() {
    update_order(null, next_up);
}


function update_order(_id, next) {
    UserOrderModel.fetch(_id, function (err, user_orders) {
        console.log('user_orders：' + user_orders.length);
        async.each(user_orders,
            function (order, cb) {
                TaobaoOrderModel.findOne({order_id: order.order_number}, function (error, taobao) {
                    if (!taobao) {
                        return cb(null, null);
                    }
                    async.waterfall([
                        function (callback) {
                            UserModel.findOne({openid: order.openid}, function (err, user) {
                                if (!user) {
                                    console.log('no order user')
                                } else {
                                    if (!weichat_apis[user.code]) {
                                        var config = weichat_conf[user.code];
                                        weichat_apis[user.code] = new WechatAPI(config.appid, config.appsecret);
                                    }
                                    var client = weichat_apis[user.code];
                                    callback(null, user, client)
                                }
                            });
                        },
                        function (user, client, callback) {
                            if (order.status == 0) {
                                order.create_at = taobao.create_at;
                                var str = '恭喜您！订单【' + taobao.order_id + '】【' + taobao.goods_info + '】跟踪成功！\r\n' +
                                    '[须知]:商品确认收货后半小时返利会添加到个人账户\r\n\r\n一一一🍉常用指令一一一\r\n' +
                                    '账户信息请回复：个人信息\r\n邀请好友请回复：邀请好友\r\n订单查询请回复：订单\r\n余额提现请回复：提现\r\n详细教程请回复：帮助';
                                client.sendText(user.openid, str, function (err, result) {
                                    console.log(err);
                                    callback(null, user, client);
                                });
                            } else {
                                callback(null, user, client);
                            }
                        },
                        function (user, client, callback) {
                            order.status = getOrderStatus(taobao.order_status);
                            if (order.status == 3) {
                                AddFreeOrderModel.findOne({order_number: order.order_number}, function (err, addOrder) {
                                    if (!addOrder) {
                                        var add_cash = parseFloat((parseFloat(taobao.order_tkCommFee) * 0.15).toFixed(2));
                                        var father_add_cash = parseFloat((parseFloat(taobao.order_tkCommFee) * 0.1).toFixed(2));
                                        var host_add_cash = parseFloat((parseFloat(taobao.order_tkCommFee) * 0.1).toFixed(2));
                                        var str = '尊敬的用户：您的订单【' + taobao.goods_info + '】已结算\r\n订单编号：' + taobao.order_id
                                            + '\r\n下单网站：淘宝\r\n返 利：' + add_cash + '\r\n跟单状态：已结算\r\n返利金已添加到您的帐户！回复【个人信息】可以查看帐户情况！'
                                        // var father_str = '尊敬的用户：您的订单【' + taobao.goods_info + '】已结算\r\n订单编号：' + taobao.order_id
                                        //     + '\r\n下单网站：淘宝\r\n返 利：' + father_add_cash + '\r\n跟单状态：已结算\r\n返利金已添加到您的帐户！回复【个人信息】可以查看帐户情况！'
                                        // var host_str = '尊敬的用户：您的订单【' + taobao.goods_info + '】已结算\r\n订单编号：' + taobao.order_id
                                        //     + '\r\n下单网站：淘宝\r\n返 利：' + host_add_cash + '\r\n跟单状态：已结算\r\n返利金已添加到您的帐户！回复【个人信息】可以查看帐户情况！'
                                        order.tk_comm_fee = add_cash;
                                        AddFreeOrderModel.create({
                                            openid: order.openid,
                                            type: 1,
                                            cash: add_cash,
                                            order_number: order.order_number
                                        });
                                        user.current_balance += add_cash;
                                        user.rebate += add_cash
                                        user.save()
                                        client.sendText(user.openid, str, function (err, result) {
                                            console.log(err);
                                        });

                                        if (user.fatherid) {
                                            UserModel.findOneAndUpdate({openid: user.fatherid}, {
                                                $inc: {
                                                    current_balance: father_add_cash,
                                                    friend_rebate: father_add_cash
                                                }, $addToSet: {valid_friend: user.openid}
                                            }, function (error, father) {
                                            //     if (father) {
                                            //         client.sendText(user.fatherid, father_str, function (err, result) {
                                            //             console.log(err);
                                            //         });
                                            //     }
                                            });
                                        }

                                        if (user.fatherid && user.hostid && user.fatherid != user.hostid) {
                                            UserModel.findOneAndUpdate({openid: user.hostid}, {
                                                $inc: {
                                                    current_balance: host_add_cash,
                                                    friend_rebate: host_add_cash
                                                }, $addToSet: {valid_friend: user.openid}
                                            }, function (error, host) {
                                                // if (host) {
                                                //     client.sendText(user.hostid, host_str, function (err, result) {
                                                //         console.log(err);
                                                //     });
                                                // }
                                            });
                                        }
                                    }
                                });
                            }
                            order.save();
                            callback(null);
                        }
                    ], function (error, result) {
                        return cb(null, null);
                    });

                });
            },
            function (error, result) {
                console.log('next');
                if (user_orders.length == 50) {
                    return next(user_orders[49]._id);
                } else {
                    return next(null);
                }

            });

    });
}

function getOrderStatus(status) {
    if (status == '订单失效') {
        return -1;
    } else if (status == '订单付款') {
        return 1;
    } else if (status == '订单成功') {
        return 2;
    } else if (status == '订单结算') {
        return 3;
    }
}

var rule = new schedule.RecurrenceRule();
var times = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56];
rule.minute = times;
var j = schedule.scheduleJob(rule, function () {
    console.log('匹配订单');
    get_order();
});

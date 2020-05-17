var UserconfModel = require('../model/Userconf');
var Userconf1Model = require('../model/Userconf1');
var OpenidModel = require('../model/Openid');
var wechat_util = require('../util/get_weichat_client.js')
var async = require('async');

async function getUserByCode(code) {
    async.waterfall([
        function (callback) {
            get_users(code, 0, function () {
                callback(null)
            })
        }, function (callback) {
            get_user(null, code, function () {
                callback(null)
            })
        }], async function (error) {
        await OpenidModel.remove({code: code})
        console.log('update end')
        return
    })
}

async function get_users(code, count, callback) {
    UserconfModel.find({code: code}, ['openid']).skip(count).limit(1000).exec(async function (err, data) {
        var openids = [];
        for (var i of data) {
            openids.push({'openid': i.openid, 'code': code});
        }
        OpenidModel.insertMany(openids, async function (error, docs) {
            if (error) {
                console.log('------insertMany error--------');
                console.log(error);
                console.log('------------------------------');
            }
            if (data && data.length == 1000) {
                console.log('-----------code -------' + code + '---------update--contitue------')
                get_users(code, count + 1000, callback);
            } else {
                console.log('-----------code -------' + code + '---------update--end')
                callback(null)
            }
        })
    });
}

async function get_user(_id, code, back) {
    if (code) {
        update_user(_id, code, get_user, back);
    } else {
        console.log('update_user end');
        back(null);
    }
}

function update_user(_id, code, next, back) {
    OpenidModel.fetch(_id, code, async function (error, users) {
        var user_arr = [];
        users.forEach(function (user) {
            user_arr.push(user.openid)
        })
        let client = await wechat_util.getClient(code)
        if (user_arr.length == 0) {
            console.log(user_arr, '-------------------user null')
            next(null, null, back)
        } else {
            client.batchGetUsers(user_arr, function (err, data) {
                if (err) {
                    console.log(err, '----------------userinfo err')
                    if (users.length == 100) {
                        next(users[99]._id, code, back);
                    } else {
                        next(null, null, back)
                    }
                } else {
                    if (data && data.user_info_list) {
                        let userArr = []
                        async.eachLimit(data.user_info_list, 100, function (info, callback) {
                            if (info.nickname) {
                                userArr.push({
                                    code: code,
                                    openid: info.openid,
                                    nickname: info.nickname,
                                    headimgurl: info.headimgurl,
                                    sex: info.sex.toString(),
                                    country: info.country,
                                    city: info.city,
                                    province: info.province,
                                    sign: 1
                                })
                            }
                            callback(null)
                        }, function (error) {
                            if (error) {
                                console.log(error, '--------------error')
                            }
                            Userconf1Model.insertMany(userArr, async function (error, docs) {
                                if (error) {
                                    console.log('------insertMany error--------');
                                    console.log(error);
                                    console.log('------------------------------');
                                }
                                if (users.length == 100) {
                                    next(users[99]._id, code, back);
                                } else {
                                    next(null, null, back)
                                }
                            })
                        })
                    } else {
                        if (users.length == 100) {
                            next(users[99]._id, code, back);
                        } else {
                            next(null, null, back)
                        }
                    }
                }
            })
        }
    })
}

var arr = [138, 139, 140, 146, 147, 148, 149, 150, 91]
for (var i in arr) {
    getUserByCode(arr[i])
}
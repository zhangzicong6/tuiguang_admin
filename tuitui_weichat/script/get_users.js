var UserconfModel = require('../model/Userconf');
var ConfigModel = require('../model/Config');
var OpenidModel = require('../model/Openid');
var wechat_util = require('../util/get_weichat_client.js')
var mem = require('../util/mem.js');
var async = require('async');
var UserTagModel = require('../model/UserTag')

async function getUserByCode() {
    let code = process.argv.slice(2)[0]
    if (code) {
        await mem.set('access_token' + code, '', 10)
        let client = await wechat_util.getClient(code)
        async.waterfall([
            function (callback) {
                UserTagModel.remove({code: code}, function (err, doc) {
                    client.getTags(function (err, res) {
                        if (res) {
                            console.log(res, '------------------res')
                            for (let i of res.tags) {
                                if (i.name == "明星说男" || i.name == "明星说女" || i.name == "明星说未知") {
                                    client.deleteTag(i.id, function (error, res) {
                                        console.log(res)
                                    })
                                }
                            }
                            callback(null)
                        } else {
                            callback(null)
                        }
                    })
                })
            }, function (callback) {
                UserconfModel.remove({code: code}, function (err, doc) {
                    OpenidModel.remove({code: code}, function (err, doc) {
                        callback(null)
                    })
                })
            }, function (callback) {
                get_users(code, null, function () {
                    callback(null)
                })
            }, function (callback) {
                get_user(null, code, function () {
                    callback(null)
                })
            }, function (callback) {
                client.createTag("明星说未知", async function (err, data) {
                    console.log(data, '---------------------data')
                    await UserTagModel.create({id: data.tag.id, name: "未知", code: code})
                    get_tag(null, code, data.tag.id, '0', function () {
                        callback(null)
                    })
                })
            }, function (callback) {
                client.createTag("明星说男", async function (err, data) {
                    await UserTagModel.create({id: data.tag.id, name: "男", code: code})
                    get_tag(null, code, data.tag.id, '1', function () {
                        callback(null)
                    })
                })
            }, function (callback) {
                client.createTag("明星说女", async function (err, data) {
                    await UserTagModel.create({id: data.tag.id, name: "女", code: code})
                    get_tag(null, code, data.tag.id, '2', function () {
                        callback(null)
                    })
                })
            }], async function (error) {
            await OpenidModel.remove({code: code})
            await mem.set("jieguan_" + code, 1, 30 * 24 * 3600)
            await ConfigModel.update({code: code}, {status: 1})
            console.log('jieguan end')
            return
        })
    }
}

async function get_users(code, openid, callback) {
    console.log('code : ' + code + ' , openid : ' + openid);
    let client = await wechat_util.getClient(code)
    if (openid) {
        client.getFollowers(openid, async function (err, result) {
            if (err) {
                console.log('-------getFollowers error-------')
                console.log(err)
            }
            // console.log(result);
            if (result && result.data && result.data.openid) {
                var openids = [];
                for (var index in result.data.openid) {
                    openids.push({'openid': result.data.openid[index], 'code': code});
                }
                OpenidModel.insertMany(openids, async function (error, docs) {
                    if (error) {
                        console.log('------insertMany error--------');
                        console.log(error);
                        console.log('------------------------------');
                    }
                    if (result.next_openid) {
                        console.log('-----------code -------' + code + '---------update--contitue------')
                        get_users(code, result.next_openid, callback);
                    } else {
                        console.log('-----------code -------' + code + '---------update--end')
                        callback(null)
                    }
                })
            } else {
                console.log('not have openid arr-----------code -------' + code + '---------update--end')
                callback(null)
            }
        });
    } else {
        client.getFollowers(async function (err, result) {
            if (err) {
                console.log('-------getFollowers error-------')
                console.log(err)
            }
            // console.log(result);
            if (result && result.data && result.data.openid) {
                var openids = [];
                for (var index in result.data.openid) {
                    openids.push({'openid': result.data.openid[index], 'code': code});
                }
                OpenidModel.insertMany(openids, async function (error, docs) {
                    if (error) {
                        console.log('------insertMany error--------');
                        console.log(error);
                        console.log('------------------------------');
                    }
                    if (result.next_openid) {
                        console.log('-----------code -------' + code + '---------update--contitue------')
                        get_users(code, result.next_openid, callback);
                    } else {
                        console.log('-----------code -------' + code + '---------update--end')
                        callback(null)
                    }
                })
            } else {
                console.log('not have openid arr -----------code -------' + code + '---------update--end')
                callback(null)
            }
        });
    }
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
                                    sign: 1
                                })
                            }
                            callback(null)
                        }, function (error) {
                            if (error) {
                                console.log(error, '--------------error')
                            }
                            UserconfModel.insertMany(userArr, async function (error, docs) {
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

async function get_tag(_id, code, tagId, sex, back) {
    if (code) {
        update_tag(_id, code, tagId, sex, get_tag, back);
    } else {
        console.log('update_tag end');
        back(null);
    }
}

function update_tag(_id, code, tagId, sex, next, back) {
    UserconfModel.fetchTag(_id, code, sex, async function (error, users) {
        var user_arr = [];
        users.forEach(function (user) {
            user_arr.push(user.openid)
        })
        let client = await wechat_util.getClient(code)
        if (user_arr.length == 0) {
            console.log(user_arr, '-------------------user null')
            next(null, null, null, null, back)
        } else {
            client.membersBatchtagging(tagId, user_arr, function (error, res) {
                console.log(res)
            })
            if (users.length == 50) {
                next(users[49]._id, code, tagId, sex, back);
            } else {
                next(null, null, null, null, back)
            }
        }
    })
}

getUserByCode()
// module.exports.getUserByCode = getUserByCode

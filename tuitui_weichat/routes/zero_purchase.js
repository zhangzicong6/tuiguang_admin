var weichat_conf = require('../conf/weichat.json');
var zero_conf = require('../conf/zero.json');
var WechatAPI = require('wechat-api');
var WechatUtil = require('../util/wechat_get.js');
var ImageUtil = require('../util/image_util.js');
var weichat_apis = {};
var mem = require('../util/mem.js');
var ZeroAuthorityModel = require('../model/ZeroAuthority.js');
var UserModel = require('../model/User.js');
var moment = require('moment');
var getClient = require('../util/get_weichat_client');


function purchase(openid, config, message, res) {
    //var str = zero_conf.text;
    res.reply('');
    var ticket = message.Ticket;
    luoji(openid, config, ticket)
    // get_img(openid, config);
}
async function get_img(openid, config) {
    console.log('====----- 生成图片 -----======')
    // if (!weichat_apis[config.code]) {
    //     weichat_apis[config.code] = new WechatAPI(config.appid, config.appsecret);
    // }
    // client = weichat_apis[config.code];
    var client = getClient.getClient(config.code)
    var user = await UserModel.findOne({openid: openid});

    if (!user.nickname) {
        //获取用户
        await nickname(user, client)
    }
    var headimgurl = user.headimgurl
    console.log('headimgurl:'+headimgurl);
    var content = JSON.stringify({type: '0_shop', openid: openid});
    var ticket = await mem.get(content);
    console.log('--- ticket ----' + ticket)
    if (!ticket) {
        ticket = await get_qr(client, content);
    }
    if (!ticket) {
        return;
    }
    console.log('---------====ticket=====-------' + ticket)
    var qr_name = await img_compose(config.code,headimgurl, ticket);
    console.log('---------====qr_name=====-------' + qr_name)
    var res = await send_img(client, openid,config.code, qr_name);
}

async function get_qr(client, content) {
    return await new Promise((resolve, reject) => {
        client.createTmpQRCode(content, 2592000, function (err, reslut) {
            if (reslut && reslut.ticket) {
                var ticket1 = mem.set(content, reslut.ticket, 2592000)
                console.log(ticket1);
                var content1 = mem.set(reslut.ticket, content, 2592000)
                console.log(ticket1);
                return resolve(reslut.ticket);
            } else {
                return resolve('');
            }

        });
    });
}

async function img_compose(code,headimgurl, ticket) {
    return await new Promise((resolve, reject) => {
        ImageUtil.getZeroImg(code,headimgurl, ticket, function (qr_name) {
            return resolve(qr_name);
        });
    });
}

async function nickname(user, client) {
    return await new Promise((resolve, reject) => {
        client.getUser(user.openid, function (err, data) {
            user.nickname = data.nickname;
            user.headimgurl = data.headimgurl;
            user.save()
            return resolve(data.headimgurl)
        })
    });
}

async function send_img(client, openid,code, qr_name) {
    return await new Promise((resolve, reject) => {
        var media_id = mem.get('media_zero_' + zero_conf[code].version + qr_name);
        console.log('-------media_id-----' + media_id);
        if (!media_id) {
            client.sendImage(openid, media_id, function (err, res) {
                if (err) {
                    console.log(err, '----------------err')
                }
                console.log('-------发送图片----')
                resolve(1)
            })
        } else {
            var url = __dirname + '/../public/qr_image/' + qr_name;
            client.uploadMedia(url, 'image', function (cerror, result) {
                if (result) {
                    console.log('------上传图片-----')
                    var value = mem.set('media_zero_' + zero_conf[code].version + qr_name, result.media_id, 7 * 24 * 60 * 60);
                    console.log('-------mem-----set----' + value);
                    client.sendImage(openid, result.media_id, function (err, res1) {
                        if (err) {
                            console.log(err, '----------------err')
                        }
                        console.log('-------发送图片----')
                        resolve(1)
                    })
                } else {
                    console.log(cerror, '-----------------cerror')
                }


            });
        }
    });
}

function subscribe(openid, config, message, res) {
    res.reply(zero_conf[config.code].str_reply)
    var ticket = message.Ticket;
    console.log('-----------ticket------------')
    console.log(ticket);
    setTimeout(function () {
        luoji(openid, config, ticket)
    }, 500)
}

async function luoji(openid, config, ticket) {
    var content = await mem.get(ticket);
    var str1 = zero_conf[config.code].text1;
    var str2 = zero_conf[config.code].text2;
    // if (!weichat_apis[config.code]) {
    //     weichat_apis[config.code] = new WechatAPI(config.appid, config.appsecret);
    // }
    // var api = weichat_apis[config.code];
    var api = getClient.getClient(config.code)
    await api.sendText(openid, str1, function (err, result) {
        if (err) {
            console.log(err, '----------------err1')
        }
        console.log('----- 发送文字1 -----')
    })
    setTimeout(async function () {
        await api.sendText(openid, str2, function (err, result) {
            if (err) {
                console.log(err, '----------------err2')
            }
            console.log('----- 发送文字2 -----')
        })
    }, 500)

    setTimeout(async function () {
        await get_img(openid, config);
    }, 1000)
    console.log('-----------content------------')
    console.log(content);
    if (!content) {
        var auth = await ZeroAuthorityModel.findOne({openid: 'tuiguang', action: zero_conf[config.code].index});
        if (!auth) {
            auth = new ZeroAuthorityModel({
                openid: 'tuiguang',
                code: config.code,
                action: zero_conf[config.code].index,
                invitees: [openid]
            });
            auth.save(function (err) {
            })
        }else{
            ZeroAuthorityModel.findOneAndUpdate({
                openid: 'tuiguang',
                code: config.code,
                action: zero_conf[config.code].index
            }, {$addToSet: {invitees: openid}}, {upsert: true, new: true}, function (err, auth) {});
        }
        return;
    }
    var obj = JSON.parse(content);
    var auth = await ZeroAuthorityModel.findOne({openid: obj.openid, action: zero_conf[config.code].index});
    if (!auth) {
        auth = new ZeroAuthorityModel({
            openid: obj.openid,
            code: config.code,
            action: zero_conf[config.code].index,
            invitees: [openid]
        });
        auth.save(function (err) {
        })
        send_message(auth, config);
    } else {
        ZeroAuthorityModel.findOneAndUpdate({
            openid: obj.openid,
            action: zero_conf[config.code].index
        }, {$addToSet: {invitees: openid}}, {upsert: true, new: true}, function (err, auth) {
            send_message(auth, config);
        });
    }
}

function send_message(auth, config) {
    // if (!weichat_apis[config.code]) {
    //    weichat_apis[config.code] = new WechatAPI(config.appid, config.appsecret);
    // }
    // var api = weichat_apis[config.code];
    console.log(auth.openid,config.code,'-------------------config')
    var api = getClient.getClient(config.code)
    var proc = auth.invitees.length;
    UserModel.findOne({openid: auth.openid}, {nickname: 1, openid: 1}, function (err, user) {
        console.log('-----------=======0元购======-----获取用户--------')
        console.log(user)
        var need = parseInt(zero_conf[config.code].total - proc)
        if (user) {
            var str = zero_conf[config.code].message.replace(/proc/g, '' + proc).replace('date', moment(auth.updateAt).format('YYYY-MM-DD h:mm:ss'))
                .replace('nickname', user.nickname).replace('openid', auth.openid.substr(0, 8)).replace('total', '' + zero_conf[config.code].total).replace('need', '' +(need<0?0:need))
            api.sendText(auth.openid, str, function (err, result) {
                if (err) {
                    console.log(err)
                }
            });
        } else {
            var str = zero_conf[config.code].message.replace(/proc/g, '' + proc).replace('date', moment(auth.updateAt).format('YYYY-MM-DD h:mm:ss'))
                .replace('nickname', '').replace('openid', auth.openid.substr(0, 8)).replace('total', '' + zero_conf[config.code].total).replace('need', '' +(need<0?0:need) )
            api.sendText(auth.openid, str, function (err, result) {
                if (err) {
                    console.log(err)
                }
            });
        }
    })
    if (proc >= zero_conf[config.code].total) {
        api.sendImage(auth.openid, zero_conf[config.code].complete_media, function (err, res) {
            if (err) {
                console.log(err, '----------------err')
            }
        });
    }
}


async function get_key(openid, config, message, res) {
    if (message.EventKey == 'KEY_ZERO_LING') {
        console.log('---------获取图片-----------')
        res.reply('')
        //res.reply('回复“0”参与活动')
        await get_img(openid, config);
    } else if (message.EventKey == 'KEY_ZERO_PROC') {
        res.reply('')
        var auth = await ZeroAuthorityModel.findOne({openid: openid, action: zero_conf[config.code].index});
        if (!auth) {
            auth = new ZeroAuthorityModel({
                openid: openid,
                code: config.code,
                action: zero_conf[config.code].index,
                invitees: []
            });
            auth.save(function (err) {
            })
        }
        await send_message(auth, config);
    }
}


/*get_key("o2psx1j0Dh6Qz5oKtzM4d33DLofE",{
 "code":"24",
 "name":"网购省钱VIP",
 "appid":"wxfc15da67edc9f990",
 "appsecret":"e8ca947a2536ad0bf01fe0fde492e5a5",
 "token":"mingxingshuo",
 "EncodingAESKey":"tw4a1yTUv0VJURGNif96ibI4z3oWPJJWpuo2mHTvzLb",
 "url":"http://www.rrdtjj.top/weichat/24",
 "sub_replay":0,
 "robot":0,
 "zero_purchase":1
 },{EventKey:"KEY_ZERO_LING"},null)*/


module.exports.get_key = get_key;
module.exports.purchase = purchase;
module.exports.subscribe = subscribe;
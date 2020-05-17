var wechat_util = require('../util/get_weichat_client');
var MaterialModel = require('../model/Material');
var flags = {};

async function get_message(id, tagId, mediaId) {
    if (!flags[id]) {
        flags[id] = true;
        var message = await MaterialModel.findById(id)
        if (message) {
            var res = await send_users(id, message, tagId, mediaId);
            return res;
        } else {
            flags[id] = false;
            return 0;
        }
    } else {
       return 0;
    }
}

async function send_users(id, message, tagId, mediaId) {
    console.log(message);
    let code = message.code
    var client = await wechat_util.getClient(code);
    var type = message.type;
    type = type=='news'?'mpnews':type;
    var opts = {}
    opts[type] = {
        "media_id": message.media_id
    }
    opts.msgtype = type
    console.log(opts);
    console.log(tagId);
    var res = await async_send(opts,tagId,client,id)
    return res
}

function async_send(opts,tagId,client,id){
    return new Promise((resolve, reject)=>{
        tagId = parseInt(tagId)
        client.massSend(opts, tagId, function (err, res) {
            console.log('------------err--------');
            console.log(err);
            console.log('------------res--------');
            console.log(res);
            flags[id] = false;
            resolve(res)
        })
    });
}

module.exports.get_message = get_message

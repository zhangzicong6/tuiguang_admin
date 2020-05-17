var OpenidTagModel = require('../model/OpenidTag');
var wechat_util = require('../util/get_weichat_client.js')
var UserTagModel = require('../model/UserTag')

async function getTags(tagId, code, openId) {
    let client = await wechat_util.getClient(code)
    client.getTagUsers(tagId, openId, function (err, res) {
        console.log(res,'-------------------res')
        let openids = []
        if(res.data && res.data.openid){
            for (let openid of res.data.openid) {
                openids.push({'openid': openid, 'code': code, tagid: tagId});
            }
            OpenidTagModel.insertMany(openids, function (err, docs) {
                if (res.next_openid) {
                    getTags(tagId, code, res.next_openid)
                }
            })
        }else{
            return
        }
    })
}

async function updateTag() {
    let code = process.argv.slice(2)[0]
    UserTagModel.find({code: code}, function (err, data) {
        console.log(data,'--------------------data')
        for (let i of data) {
            if (i.name == "男" || i.name == "女" || i.name == "未知") {
                getTags(i.id, code, null)
            }
        }
    })
}
updateTag()
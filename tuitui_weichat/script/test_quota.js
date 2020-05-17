var ConfigModel = require('../model/Config');
var wechat_util = require('../util/get_weichat_client.js')

async function test() {
    let code = process.argv.slice(2)[0]
    let client = await wechat_util.getClient(code)
    let conf = await ConfigModel.findOne({code: code})
    let appid = conf.appid
    client.clearQuota(appid, function (err, data) {
        console.log(err, data, '------------------------------')
        console.log('clearQuota end')
    })
}
test()

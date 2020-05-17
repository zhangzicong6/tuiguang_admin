var MaterialModel = require('../model/Material');
var async = require('async');
var weichat_util = require('../util/get_weichat_client.js')

async function get_aterials(code) {
    var api = await weichat_util.getClient(code);
    await api.getMaterialCount(async (err, result, res) => {
        console.log('----------- get_aterials-----------')
        console.log(err, result)
        for( key in result) {
            let num = Math.ceil(result[key]/20)
            for(let i = 0; i < num; i ++) {
              if(key.split('_')[0] == 'news') {
                await getMaterial(code, api, key.split('_')[0], i)
              }
            }
        }
    })
}

async function getMaterial(code, client, type, offset) {
    await client.getMaterials(type, offset, 20, async (err, result, res) => {
        console.log('-------Material--------')
        console.log(result)
        let data = result.item
        for(let j = 0; j < data.length; j ++) {
            data[j].type = type.split('_')[0]
            data[j].code = code
            await MaterialModel.findOneAndUpdate({media_id: data[j].media_id}, data[j], {new: true, upsert: true})
        }
        // if(docs) {
        //     return docs
        // } else {
        //     console.log('获取素材出错')
        // }
    });
}

module.exports.get_aterials = get_aterials;

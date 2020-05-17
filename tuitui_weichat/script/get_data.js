var wechat_util = require('../util/get_weichat_client.js')


async function getData(code) {
	var client = await wechat_util.getClient(code)
	client.getArticleTotal('2019-07-30','2019-07-30',function(err,res){
		console.log(err,res)
	})
}

getData(226)
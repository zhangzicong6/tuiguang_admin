var mem = require('../util/mem.js');
var wechat_util = require('../util/get_weichat_client.js')

async function test() {
	await mem.set("configure_" +52 , '', 10)
	await wechat_util.getClient(52)
	console.log('--------end-------')
}

test()
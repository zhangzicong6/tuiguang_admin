const rp = require('request-promise');
const crypto = require('crypto');
const email = "mingxingshuo1@aliyun.com";
const appsecret = "0ec0806b3009a10e2f4c69f34630bb99";
const PlatformDataModel = require('../model/PlatformData.js');
const PlatformModel = require('../model/Platform.js');
const async = require('async');

let sign = (params) =>{
	let args = {
		"email" : email,
		"version":1,
		"timestamp":parseInt(Date.now()/1000)
	}
	let keys = ["email","version","timestamp"]
	for (let key in params ) {
		args[key] = params[key];
		keys.push(key)
	}
	keys = keys.sort()
	let splicedString = appsecret;
	for (let key of keys) {
		splicedString +=key+args[key]
	}
	let sign = crypto.createHash('md5').update(splicedString).digest("hex")
	args.sign = sign.toUpperCase();
	return args	
}


let handle = async (item) =>{
		if(!item.td_url){
			return
		}
		//item.td_url =  item.td_url.substring(0,4)+'s'+item.td_url.substring(4)
		let td_url = decodeURIComponent(item.td_url)
		if( td_url.indexOf('?') !=-1){
			return
		}else{
			td_url = decodeURIComponent(td_url)
		}
		let urls = td_url.split('adid')
		if(urls.length!=3){
			return
		}
		td_url = urls[0]+'adid'+urls[2]
		console.log(item)
		let ad_cb_url = 'https://ad.toutiao.com/track/activate/?link='
						+encodeURIComponent(td_url)+'&event_type=2'
		await rp(ad_cb_url)
		await item.save()
		return
}

let find = async () => {
	let pds =await PlatformDataModel.find({wx_platfrom:1,ispay:1,order_time:{$gte:new Date('2020-02-18').getTime()}})
	console.log(pds.length)
	async.eachLimit(pds,10, async function(item){
		await handle(item)
		return
	},(err,res) =>{
		console.log('------执行结束-------')
		console.log(err)
		console.log(res)
	})
}


find()
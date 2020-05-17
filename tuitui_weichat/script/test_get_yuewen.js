const rp = require('request-promise');
const crypto = require('crypto');
const email = "mingxingshuo1@aliyun.com";
const appsecret = "0ec0806b3009a10e2f4c69f34630bb99";
const xlsx = require('node-xlsx');
const fs = require('fs');
//const PlatformDataModel = require('../model/PlatformData.js');
//const PlatformModel = require('../model/Platform.js');
//const schedule = require("node-schedule");
const excel_data = [{
	name : 'sheet1',
	data : [
		[
			"OPENID"
			"用户昵称"
			"性别"
			"推广渠道"
			"充值书籍"
			"用户注册时间"
			"订单类型"
			"客户订单号"
			"充值平台（AreaID）"
			"充值金额（元）"
			"充值类型"
			"充值时间"
			"订单状态"
		]
	]
}]

const sex_map ={
	1:"男",
	2:"女",
	0:"未知"
}


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
	return sign.toUpperCase()
}


let handle = async (data,params) =>{
	for(let item of data.list){
		// 获取数据
		excel_data.data.push([
				item.openid,
				item.user_name,
				sex_map[item.sex],
				item.channel_name,
				item.book_name,
				item.reg_time,
				item.order_type==1?"充值":"包年",
				item.order_id,
				item.app_name,
				item.amount,
				'',
				item.order_time,
				item.order_status==2:'已支付':"未支付"
			])
	}
	if(data.total_count>data.page){
		params.total_count = data.total_count;
		params.last_min_id = data.last_min_id;
		params.last_max_id = data.last_max_id;
		params.last_page = data.page;
		params.page = data.page+1;
		get_order(params)
	}else{
		var buffer = xlsx.build(data);
		fs.writeFile('./resut.xls', buffer, function (err)
		{
		    if (err)
		        throw err;
		    console.log('Write to xls has finished');
		}
);
	}
}

let get_order = async (params) =>{
	let url = "https://open.yuewen.com/cpapi/wxRecharge/querychargelog";
	let sign_str = sign(params)
	let args = []
	for (let key in params) {
		args.push(key+'='+params[key])
	}
	url += '?'+args.join('&')+'&sign='+sign_str
	let y_res = await rp(url)
	y_res = JSON.parse(y_res)
	if(y_res.code == 0){
		handle(y_res.data,params)
	}else{
		console.error(y_res.msg)
	}
}

let start = (appflag)=>{
	var now_time = new Date().getTime()
	var end = new Date(now_time).setSeconds(0,0)
	var last_time = now_time-60*1000
	var start = new Date('2019').getTime()
	let params = {
		start_time : parseInt(start/1000),
		end_time : parseInt(end/1000),
		page : 1,
		order_status : 2,
		//last_min_id : '',
		//last_max_id : '',
		//total_count : '',
		//last_page : ''
	}
	get_order(params)
}




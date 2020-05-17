const TransferModel = require('../model/Transfer')
const StaticsTuiGuangModel = require('../model/StaticsTuiGuang')
const schedule = require("node-schedule");
const asyncRedis = require("async-redis");
const redis_client = asyncRedis.createClient();

async function get_data() {
	let transfers = await TransferModel.find({type:1,status:1})
    //console.log(transfers)
	for (var i = 0; i < transfers.length; i++) {
		await get_one_static(transfers[i])
	}
}

async function get_one_static(transfer){
	for (var i = 0; i < transfer.links.length; i++) {
		//获取数据
        var link = transfer.links[i]
        var params = link.substr(link.lastIndexOf('/')+1)
        var index = params.split('?')[0]
        var channel = params.split('channel=')[1]
        let uv = await redis_client.pfcount('website_tuiguang_'+channel+'_'+index);
        let cv = await redis_client.pfcount('website_tuiguang_copy_'+channel+'_'+index);
        let ip = await redis_client.pfcount('website_tuiguang_ip_'+channel+'_'+index);

        //获取时间
        let date = new Date()
        date.setMilliseconds(0)
        date.setSeconds(0)
        let m = date.getMinutes()
        m= m - m%transfer.granularity
        date.setMinutes(m)
        let zeng_time = date.getTime()
        date.setMinutes(0)
        date.setHours(0)
        let zong_time = date.getTime()

        let now = new Date()
        if(now.getHours() ==0 && now.getMinutes()==0){
            await redis_client.del('website_tuiguang_'+channel+'_'+index);
            await redis_client.del('website_tuiguang_copy_'+channel+'_'+index);
            await redis_client.del('website_tuiguang_ip_'+channel+'_'+index);
        }


        //存量
        let zong_static = await StaticsTuiGuangModel.findOne({type:1,tuiguang_id:index,date:zong_time,channel:channel})
        if(!zong_static){
        	zong_static= new StaticsTuiGuangModel({
        		date : zong_time,
        		tuiguang_id:index,
        		type : 1,
        		channel: channel,
        		transfer_id : transfer.id,
        		cv : 0,
			    uv : 0,
			    ip : 0
        	})
        }
        let zeng_cv = cv-zong_static.cv;
        let zeng_uv = uv-zong_static.uv;
        let zeng_ip = ip-zong_static.ip;

        zong_static.cv =cv;
        zong_static.uv =uv;
		zong_static.ip =ip;

		await zong_static.save()

		//增量
		let zeng_static = await StaticsTuiGuangModel.findOne({type:0,tuiguang_id:index,date:zeng_time,channel:channel})
        if(!zeng_static){
        	zeng_static= new StaticsTuiGuangModel({
        		date : zeng_time,
        		tuiguang_id:index,
        		type : 0,
        		channel: channel,
        		transfer_id : transfer.id,
        		cv : 0,
			    uv : 0,
			    ip : 0
        	})
        }
        zeng_static.cv +=zeng_cv;
        zeng_static.uv +=zeng_uv;
		zeng_static.ip +=zeng_ip;
		await zeng_static.save()

    }
}

async function del_data(){
    let date = new Date()
    date.setDate(date.getDate()-2)
    date.setMinutes(0)
    date.setHours(0)
    date.setMilliseconds(0)
    date.setSeconds(0)
    let time = date.getTime()
    await StaticsTuiGuangModel.remove({type:0,date:{$lt:time}})

    date.setDate(date.getDate()-5)
    let week = date.getTime()
    await StaticsTuiGuangModel.remove({type:1,date:{$lt:week}})
}

var rule = new schedule.RecurrenceRule();
var times = [1];
rule.second = times;
var j = schedule.scheduleJob(rule, function () {
    console.log('--------执行颗粒度记录---------')
    get_data()
});

var del_rule = new schedule.RecurrenceRule();
del_rule.hour=0;
del_rule.minute=0;
del_rule.second= 20;
var j = schedule.scheduleJob(del_rule, function () {
    console.log('--------执行删除记录---------')
    del_data()
});


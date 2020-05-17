var express = require('express');
var router = express.Router();
var UserModel = require('../model/User.js');
// var weichat_conf = require('../conf/weichat.json');
var ConfigModel = require('../model/Config');
var async = require('async');
var mem = require('../util/mem');

router.get('/all',async function (req,res,next) {
	// var codes= [];
	// for (var key in weichat_conf) {
	// 	codes.push(weichat_conf[key]);
	// }
    var codes = await ConfigModel.find()
    var today = new Date().setHours(0, 0, 0, 0);
	var arr =[]
	async.each(codes,function(obj_item,callback){
		async.parallel([
				function(cb){
					UserModel.count({code:obj_item.code,subscribe_time:{$gte:today}},function(err,count){
						cb(err,count)
					});
				},
				function(cb){
					UserModel.count({code:obj_item.code,subscribe_time:{$gte:today},subscribe_flag:false},function(err,count){
						cb(err,count)
					});
				}
			],function(e,rs){
				var obj ={
					subscribe_count : rs[0],
					unsubscribe_count : rs[1],
					growth : rs[0]-rs[1],
					code : obj_item.code,
					name : obj_item.name,
			}
			arr.push(obj)
			console.log(err)
			callback(null)
		})	
	},function(error){
		res.send(arr)
	})
})

router.get('/get_code', async function(req,res, next){
	// var codes= [];
	// for (var key in weichat_conf) {
	// 	codes.push(weichat_conf[key]);
	// }
    var codes = await ConfigModel.find()
    res.send({codes:codes})
})

router.get('/media/:code',function(req,res,next){
	var code = req.params.code;
	mem.get('statistics_detail_'+code).then(async function(value){
		if(value){
			res.send({data:JSON.parse(value)})
		}else{
            var item = await mem.get("configure_"+code);
            if(!item){
                item = await ConfigModel.find({code:code})
                item = item[0]
                await mem.set("configure_"+code,item,30*24*3600)
            }
			// var item = weichat_conf[code];
			var space = 15*60*1000;
			var times= []
			var now = Date.now();
			var today = new Date().setHours(0, 0, 0, 0);
			var tmp_time = today;
			while(tmp_time<now){
				var obj= {
					start : tmp_time,
					end : tmp_time+space
				}
				times.push(obj)
				tmp_time+=space;
			}
			times.reverse()
			var arr=[];
			var result={};
			async.parallel([
				function(cb){
					UserModel.count({code:code,subscribe_time:{$gte:today}},function(err,count){
						cb(err,count)
					});
				},
				function(cb){
					UserModel.count({code:code,subscribe_time:{$gte:today},subscribe_flag:false},function(err,count){
						cb(err,count)
					});
				}
			],function(e,rs){
				result ={
					subscribe_count : rs[0],
					unsubscribe_count : rs[1],
					growth : rs[0]-rs[1],
					code : item.code,
					name : item.name,
				}
				async.each(times,function(time_obj,callback){
					async.parallel([
							function(cb){
								UserModel.count({code:item.code,subscribe_time:{$gte:time_obj.start,$lt:time_obj.end}},function(err,count){
									cb(err,count)
								});
							},
							function(cb){
								UserModel.count({code:item.code,subscribe_time:{$gte:today},unsubscribe_time:{$gte:time_obj.start,$lt:time_obj.end}},function(err,count){
									cb(err,count)
								});
							}
						],function(err,ress){
							var obj={
								start: time_obj.start,
								end : time_obj.end,
								subscribe_count : ress[0],
							    unsubscribe_count : ress[1],
							    growth : ress[0]-ress[1]
							}
							arr.push(obj)
							callback(null)
						})
				},function(error){
					result.list= arr;
					mem.set('statistics_detail_'+code,JSON.stringify(result),5*60).then(function(){
					})
					res.send({data:result});
				});
			});
		}
	})
	
})

Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

router.get('/group/:code',function(req,res,next){
	var code = req.params.code;
	var space = Number(req.query.space)?Number(req.query.space):15*60*1000;
	var value;
	mem.get('statistics_detail_'+code+'_'+space).then(async function(value){
		if(value){
			res.send({data:JSON.parse(value)})
		}else{
            var item = await mem.get("configure_"+code);
            if(!item){
                item = await ConfigModel.find({code:code})
                item = item[0]
                await mem.set("configure_"+code,item,30*24*3600)
            }
			// var item = weichat_conf[code];
			var times= {}
			var now = Date.now();
			var today = new Date().setHours(0, 0, 0, 0);
			var tmp_time = today;
			while(tmp_time<now){
				times[tmp_time] = {
					timestamp: tmp_time,
					date: new Date(tmp_time).Format("hh:mm:ss"),
					subscribe_count : 0,
					unsubscribe_count : 0
				};
				tmp_time+=space;
			}
			var result={};
			async.parallel([
				function(cb){
					UserModel.count({code:code,subscribe_time:{$gte:today}},function(err,count){
						cb(err,count)
					});
				},
				function(cb){
					UserModel.count({code:code,subscribe_time:{$gte:today},subscribe_flag:false},function(err,count){
						cb(err,count)
					});
				}
			],function(e,rs){
				result ={
					subscribe_count : rs[0],
					unsubscribe_count : rs[1],
					growth : rs[0]-rs[1],
					code : item.code,
					name : item.name,
				}
				async.parallel([
							function(cb){
								UserModel.aggregate([
									{
										$match: {
											"code" : "2",
											"subscribe_time":{"$gte":today}
										}
									},
									{
										$group: {
											_id: {
												"$subtract": [
											        { "$subtract": [ "$subscribe_time", today ] },
											        { "$mod": [
											            { "$subtract": [ "$subscribe_time", today ] },
											            space
											        ]}
											    ]
											},
											count: {$sum: 1 }
											}
									},
									{
										$project: {
											"_id": 0,
											"count":1,
											"timestamp":{$add :[today,"$_id"]}
										}
									},
									{
										"$sort": {
									        "timestamp": -1
									    }
									}]).then(function(res0){
										cb(null,res0)
										//console.log(res)
									});
							},
							function(cb){
								UserModel.aggregate([
									{
										$match: {
											"code" : "2",
											"subscribe_time":{"$gte":today},
											"subscribe_flag":false
										}
									},
									{
										$group: {
											_id: {
												"$subtract": [
											        { "$subtract": [ "$unsubscribe_time", today ] },
											        { "$mod": [
											            { "$subtract": [ "$unsubscribe_time", today ] },
											            space
											        ]}
											    ]
											},
											count: {$sum: 1 }
											}
									},
									{
										$project: {
											"_id": 0,
											"count":1,
											"timestamp":{$add :[today,"$_id"]}
										}
									},
									{
										"$sort": {
									        "timestamp": -1
									    }
									}]).then(function(res0){
										cb(null,res0)
										//console.log(res)
									});
							}
						],function(err,ress){
							for(var i in ress[0]){
								var obj = ress[0][i];
								times[obj.timestamp].subscribe_count=obj.count
							}
							for(var i in ress[1]){
								var obj = ress[1][i];
								times[obj.timestamp].unsubscribe_count=obj.count
							}
							var arr=[]
							for (var key in times) {
								var item= times[key]
								item.growth = item.subscribe_count -item.unsubscribe_count;
								arr.push(item)
							}
							arr = arr.sort(compare_times)
							result.list =arr
							mem.set('statistics_detail_'+code+'_'+space,JSON.stringify(result),3*60).then(function(){
							})
							return res.send({data:result})
						})
			});
		}
	})
	
})

function compare_times(x, y) {
	//比较函数
    if (x.timestamp < y.timestamp) {
        return 1;
    } else if (x.timestamp > y.timestamp) {
        return -1;
    } else {
        return 0;
    }
}


module.exports = router;

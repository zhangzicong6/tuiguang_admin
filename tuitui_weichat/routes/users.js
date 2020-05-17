var express = require('express');
var router = express.Router();

var UserModel = require('../model/User.js');
var UserOrderModel = require('../model/UserOrder.js');
var TaobaoOrderModel = require('../model/TaobaoOrder.js');

//var WechatAPI = require('wechat-api');
// var weichat_conf = require('../conf/weichat.json');
var MenuModel = require('../model/Menu');
var WechatUtil = require('../util/wechat_get.js');



router.use('/data', function(req, res, next) {
	console.log('上传订单');
	console.log(req.body.orders);
	var orders = req.body.orders;
	orders = JSON.parse(orders);
	var order = "";
	for (var i = orders.length - 1; i >= 0; i--) {
		order = orders[i];
		TaobaoOrderModel.findOneAndUpdate({order_id:order.order_id},{$set :order},{upsert:true,rawResult:true},function(err,order){
			//console.log('update');
		})
	}
	res.send('success');
});


router.use('/reset', function(req, res, next) {
	console.log('重置订单');
	var openid = req.query.openid;
	UserModel.findOneAndUpdate({openid:openid},{finished_count:0,unfinished_count:0,all_count:0},function(err,res){
		console.log(res);
	});
	res.send('success');
});

router.use('/create_menu',function(req, res, next){
	var code = req.query.code;
	if(code){
		createMenu(code);
		res.send('success');
	}else{
		res.send('need params code');
	}
});

router.use('/upload_complete',function(req,res,next){
	var code = req.query.code;
	// var config = weichat_conf[code];
	var client = WechatUtil.getClient(code);
	var url = __dirname + '/../util/create_fixed/complete.jpeg';
	client.uploadMedia(url, 'image', function (cerror, result) {
        if (result) {
            console.log('------发送图片-----') 
            console.log(result)
            res.send(result)
        } else {
            console.log(cerror, '-----------------cerror')
            res.send(cerror)
        }
    });

})

async function createMenu(code) {
	// var menus = require('../conf/menu.json');
	//var config = weichat_conf[code];
	var api = WechatUtil.getClient(code);
	// var menu = menus[code];
    var menu = await MenuModel.find({code:code})
	menu = menu[0]
    console.log(menu);
	if(!menu){
		return
	}
	if(menu.button.length==0){
		api.removeMenu(function(err,res){
			console.log(res);
			api.getMenu(function(err,res_m){
				console.log(JSON.stringify(res_m));
			});
		});
		return
	}
	api.removeMenu(function(err,res){
		if(err){
			console.log('--------removeMenu-----err-----')
			console.log(err)
			console.log(res)
		}
		api.createMenu(menu, function(err,res){
			if(err){
				console.log('--------createMenu-----err-----')
				console.log(err)
				console.log(res)
			}
			api.getMenu(function(err,res_m){
				console.log(err)
				console.log(JSON.stringify(res_m));
			});
		});
	});
	
}




module.exports = router;

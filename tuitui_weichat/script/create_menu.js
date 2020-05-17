var wechat_util = require('../util/get_weichat_client.js')

var menu_obj={
  	"button":[
  		{	
	        "name":"玄幻",
	        "sub_button":[
	          { 
	            "type":"view",
	            "name":"我的高冷大小姐",
	            "url":"https://c66591.818tu.com/referrals/index/4931942"
	          },
	          { 
	            "type":"view",
	            "name":"古术医修",
	            "url":"https://c66591.818tu.com/referrals/index/4931954"
	          },
	          { 
	            "type":"view",
	            "name":"绝美夜色",
	            "url":"https://c66591.818tu.com/referrals/index/4931967"
	          },
	          { 
	            "type":"view",
	            "name":"总裁媳妇爱上我",
	            "url":"https://c66591.818tu.com/referrals/index/4931975"
	          },
	          { 
	            "type":"view",
	            "name":"枭雄",
	            "url":"https://url.beihou.com/2038031"
	          }
	        ]
  		},
  		{	
	        "name":"惊悚",
	        "sub_button":[
	          { 
	            "type":"view",
	            "name":"最佳女婿",
	            "url":"https://c66591.818tu.com/referrals/index/4931997"
	          },
	          { 
	            "type":"view",
	            "name":"网红鬼主播",
	            "url":"https://c39075.818tu.com/referrals/index/4932062"
	          },
	          { 
	            "type":"view",
	            "name":"我是一名捞尸人",
	            "url":"https://c66591.818tu.com/referrals/index/4932024"
	          },
	          { 
	            "type":"view",
	            "name":"尸蛇",
	            "url":"https://c39075.818tu.com/referrals/index/4932067"
	          },
	          { 
	            "type":"view",
	            "name":"鬼君缠绵绕指柔",
	            "url":"https://c39075.818tu.com/referrals/index/4932075"
	          }
	        ]
  		},
  		{	
	        "name":"言情",
	        "sub_button":[
	          { 
	            "type":"view",
	            "name":"爱过才懂情浓",
	            "url":"https://c39075.818tu.com/referrals/index/4932108"
	          },
	          { 
	            "type":"view",
	            "name":"贴心萌宝荒唐爹",
	            "url":"https://c39075.818tu.com/referrals/index/4932127"
	          },
	          { 
	            "type":"view",
	            "name":"略过岁月去爱你",
	            "url":"https://c39075.818tu.com/referrals/index/4932142"
	          },
	          { 
	            "type":"view",
	            "name":"冰冷少帅荒唐妻",
	            "url":"https://c39075.818tu.com/referrals/index/4932155"
	          },
	          { 
	            "type":"view",
	            "name":"来自星星的你",
	            "url":"https://site9328v7j7wzew6no5.66kshu.com/yun/422591"
	          }
	        ]
  		},
  	]
  }



//create_menu(88)

async function create_menu(code) {
	console.log(code)
	return
	var client = await wechat_util.getClient(code)
	//console.log(client)
	client.removeMenu(function(err,res){
		if(err){
			console.log('--------removeMenu-----err-----'+code+'-------')
			console.log(err)
			console.log(res)
		}
		client.createMenu(menu_obj, function(err,res){
			if(err){
				console.log('--------createMenu-----err-----'+code+'-------')
				console.log(err)
				console.log(res)
			}
			client.getMenu(function(err,res_m){
				console.log('--------createMenu-----success-----'+code+'-------')
				console.log(err)
				console.log(JSON.stringify(res_m));
			});
		});
	});
}

async function remove_menu(code) {
	console.log(code)
	var client = await wechat_util.getClient(code)
	//console.log(client)
	client.removeMenu(function(err,res){
		console.log('--------removeMenu--------'+code+'-------')
		console.log(err)
		console.log(res)
		
	});
}



async function get_tag(code){
	var client = await wechat_util.getClient(code)
	/*client.createTag("明星说测试",async function (err, data){
		console.log(err)
		console.log(data)
	})*/
	/*client.getTags(function(err,res){
		console.log('------------err-------------')
		console.log(err)
		console.log('------------res-------------')
		console.log(res)
	})*/

	/*client.membersBatchtagging(103, ['o2JXO56130aGQSfHcfIIDcOVkQNE','o2JXO55e9ojX_vax-6aHI6tQU29I	'], function (error, res) {
        console.log(res)
    })*/

    //var media_id ="KtjogwJlegSk9wzmQ9jiG7XrFjczdfiKJsVxxSko-u0";
   var opts ={ mpnews: { media_id: 'KtjogwJlegSk9wzmQ9jiG14bdlSC5-DLYugKXr02FiA' },
   msgtype: 'mpnews' };
   /*var opts = {
	   	"text":{
	      "content":"测试文本"
	   },
	    "msgtype":"text"
   }*/
    client.massSend(opts, 103, function (err, res) {
            console.log('------------err--------');
            console.log(err);
            console.log('------------res--------');
            console.log(res);
        })
}

async function get_status(code,msg_id){
	var client = await wechat_util.getClient(code)
	client.getMassMessageStatus(msg_id,function(err, res){
		console.log('------------err--------');
            console.log(err);
            console.log('------------res--------');
            console.log(res);
	})
}

async function get_qr(code){
	var client = await wechat_util.getClient(code)
	client.createLimitQRCode('test', (err, result) => {
        console.log(err)
        console.log(result)
        var qrUrl = client.showQRCodeURL(result.ticket) || '';
        console.log(qrUrl)
    })
}


remove_menu(7)
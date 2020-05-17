require('events').EventEmitter.prototype._maxListeners = 1000;

var request = require('request');
var async = require('async');
// var MessageServer = require('../message_server.js');

ApiClient = require('./taobaoke/index.js').ApiClient;
TopClient = require('./taobaoke/lib/api/topClient.js').TopClient;

String.prototype.stripHTML = function() {
	var reTag = /<(?:.|\s)*?>/g;
	return this.replace(reTag,"");
}

function request_taobao_url(url,next){

	async.waterfall([
			function(callback){
				var options = {  
					maxRedirects:15,
					url:url, 
					method:"GET",
					headers: {  
						"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
					    "Connection": "keep-alive", 
					    "Content-Type": "text/html; charset=GBK",  
					    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36"  
					}//伪造请求头  
				};
				request(options, function (error, response, body) {
					if(error){
						return callback(error,null);
					}
					var str_html=response.body;
					var str_temp=str_html.split('var url = \'')[1];
					var str_url= str_temp.split('\'')[0];
					options.url=str_url;
					callback(null,options);
				});
			},
			function(options,callback){
				request(options,function(e, res, b){
					if(e){
						return callback(e,null);
					}
					var uri_obj = res.request.uri;
					var split_str = '?id=';
					var tmp_arr = uri_obj.path.split(split_str);
					if(tmp_arr.length == 1){
						split_str = '&id=';
						tmp_arr = uri_obj.path.split(split_str);
					}
					if(tmp_arr.length==1){
						return callback('无优惠信息');
					}
					var itemid = tmp_arr[1].split('&')[0];
					var tmp_str = uri_obj.path.split('?')[0]+'?id='+itemid;
					var param_url=uri_obj.protocol+'//'+uri_obj.hostname+tmp_str;
					callback(null,param_url);
				});
			}
		],function(err, results){
			next(err,results);		
	});
}

function request_taobao_token(code,next){
	async.waterfall([
			function(callback){
				request.post('http://api.chaozhi.hk/tb/tklParse', {form:{tkl:code}},function (error, response, body) {
					if(error){
						return callback(error,null);
					}
					body = JSON.parse(body);
					//console.log(body)
					var url= body.data.url;
					if(!url){
						return callback(-1,null);
					}
					callback(null,url);
				});
			},
			function(tmp_url,callback){
				var options = {  
					maxRedirects:16,
					url:tmp_url, 
					method:"GET",
					headers: {  
						"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
					    "Connection": "keep-alive", 
					    "Content-Type": "text/html; charset=GBK",  
					    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36"  
					}//伪造请求头  
				};

				request(options,function(e, res, b){
					if(e){
						return callback(e,null);
					}
					var uri_obj = res.request.uri;
					//console.log(uri_obj)
					var split_str = '?id=';
					var tmp_arr = uri_obj.path.split(split_str);
					if(tmp_arr.length == 1){
						split_str = '&id=';
						tmp_arr = uri_obj.path.split(split_str);
					}
					if(tmp_arr.length==1){
						return callback('无优惠信息');
					}
					var itemid = tmp_arr[1].split('&')[0];
					var tmp_str = uri_obj.path.split('?')[0]+'?id='+itemid;
					var param_url=uri_obj.protocol+'//'+uri_obj.hostname+tmp_str;
					callback(null,param_url);
				});
			}
		],function(err, results){
			return next(err,results);	
	}); 
}


//通过接口获取淘口令，发现优惠券淘口令获取不到
function taokouling(obj,next){
	if(obj.error){
		return next(obj.error);
	}
	var client = new TopClient({
	    'appkey': '24808252',
	    'appsecret': '25394001ed7c0f2aff6cb31750e865f0',
	    'REST_URL': 'http://gw.api.taobao.com/router/rest'
	});

	client.execute('taobao.wireless.share.tpwd.create',
	    {'tpwd_param':JSON.stringify({url:obj.url,text:obj.data.title})},
	    function (error,response) {
	        if(!error){
	        	if(response.model){
	        		obj.taokouling = response.model;
	        		next(null,obj);
	        	}else{
	        		console.log(response);
	        		next(null,obj);
	        	}
	        }else{
	            console.log(error);
	            next(error,obj);
	        }
	    }
	);
}


function get_baokuang(obj){
	var split_str = '?id=';
	var tmp_arr = obj.url.split(split_str);
	if(tmp_arr.length == 1){
		split_str = '&id=';
		tmp_arr = obj.url.split(split_str);
	}
	var itemid = tmp_arr[1].split('&')[0];
	obj.url = obj.url.split('?')[0]+'?id='+itemid;
	console.log(obj)
    request.post('http://io.rrdtjj.top/message/baokuan',{form:obj},function(err,response){
    })
    // MessageServer.getInstance(null).get_one_baokuan(obj)
}


/*setTimeout(function(){
	get_baokuang({
		key:'测试',
		class:'0',
		url:'https://item.taobao.com/item.htm?id=543490544168&ali_trackid=2:mm_26632614_0_0:1527839904_367_1386912899'
	})
},2000)*/


/*function search_title(title){
	var client = new TopClient({
	   'appkey': '24808252',
	   'appsecret': '25394001ed7c0f2aff6cb31750e865f0',
	   'REST_URL': 'hhttp://gw.api.taobao.com/router/rest'
	});
	 
	client.execute('taobao.tbk.item.get', {
	    'fields':'num_iid,title,pict_url,reserve_price,zk_final_price,item_url,tk_rate,tk_comm_fee,coupon_amount',
	    'q':title,
		'page_size':1
	}, function(error, response) {
	    if (!error) console.log(JSON.stringify(response));
	    else console.log(error);
	});
}*/

//search_title('夹克外套女春秋假两件亮片棒球服外套韩板宽松bf网纱防晒衫学生');
/*request_taobao_url('http://m.tb.cn/h.WEeQPBg',function(err,response){
	console.log(response);
});*/

/*request_taobao_token('￥RQvU0qgDIAM￥',function(err,response){
	console.log(response);
});*/

/*jiexitaokouling('【生日礼物女生送女友女朋友老婆玫瑰花创意diy定制走心的特别浪漫】，复制这条信息￥RQvU0qgDIAM￥后打开👉手淘👈',function(err,response){
	console.log(response);
});
*/
module.exports.get_baokuang = get_baokuang;
module.exports.request_taobao_url = request_taobao_url;
module.exports.request_taobao_token = request_taobao_token;




const request = require('request');
const async = require('async');
const crypto=require('crypto');  
const md5=crypto.createHash("md5");  

const apikey='wJFEHxabmT';
const secret='FSDxEDdnHHPRMGhbeszjGJWTymhgYejW';

var access_token = ''

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


function get_access_token(next) {
	if(access_token){
		return next(access_token)
	}
	async.waterfall([
			function(callback){
				request.get('https://0x3.me/apis/authorize/getCode',function(err,response,data){
					if(JSON.parse(data).data){
						callback(null,JSON.parse(data).data);
					}else{
						callback('短链接获取code出错');
					}
				});
			},
			function(code,callback){
				var formData = {
					api_key:apikey,
					code:code,
					request_time:new Date().Format("yyyy-MM-dd hh:mm:ss")
				};
				var str = 'api_key='+formData.api_key+'code='+formData.code+'request_time='+formData.request_time+secret;
				md5.update(str);  
				var sign=md5.digest('hex');  
				formData.sign = sign;
				request.post({url:'https://0x3.me/apis/authorize/getAccessToken',formData:formData},function(err,response,data){
					var token_data= JSON.parse(data)
					if(token_data.data && token_data.data.access_token){
						access_token=token_data.data.access_token;
						callback(null)
					}else{
						callback('短链接获取access_token出错')
					}
				});
			},
		],
		function(err,result){
			if(err){
				console.log(err)
				return next(access_token)
			}else{
				return next(access_token)
			}
	});
}

function convert_url(o_url,next){
	get_access_token(function(token){
		if(!token){
			return next('')
		}
		request({
		    url: 'https://0x3.me/apis/urls/add',
		    method: "POST",
		    headers: {
		    	"Access-Token": token,
		        "Content-Type": "application/x-www-form-urlencoded",
		        "Cache-Control":"no-cache"
		    },
		    form:{longurl:o_url}
		}, function(error, response, body) {
		    if (!error && response.statusCode == 200) {
		    	var url_obj = JSON.parse(body);
		    	if(url_obj.data&&url_obj.data.short_url){
		    		next(url_obj.data.short_url)
		    	}else{
		    		next('')
		    	}
		    }else{
		    	return next('')
		    }
		});
	});
}

module.exports.convert_url = convert_url;




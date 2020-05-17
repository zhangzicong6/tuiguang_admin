var request =require('request');
var crypto = require('crypto');
var fs = require('fs');

const Alipay = require('alipay-mobile');
var options = {
	  app_id: '2018032902467602',
	  appPrivKeyFile: fs.readFileSync(__dirname+'/alipay_rsa/rsa_private_key.pem'),
	  alipayPubKeyFile: fs.readFileSync(__dirname+'/alipay_rsa/rsa_public_key.pem')
	};
var service = new Alipay(options);


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

/*
function getParams(params,encode) {
    var sPara = [];
    if(!params) return null;
    for(var key in params) {
        if((!params[key]) || key == "sign" ) {
            continue;
        };
        sPara.push([key, params[key]]);
    }
    sPara = sPara.sort();
    var prestr = '';
    for(var i2 = 0; i2 < sPara.length; i2++) {
        var obj = sPara[i2];
        if(i2 == sPara.length - 1) {
            prestr = prestr + obj[0] + '=' + encode?encodeURIComponent(obj[1]):obj[1] + '';
        } else {
            prestr = prestr + obj[0] + '=' + encode?encodeURIComponent(obj[1]):obj[1] + '&';
        }
    }
    return prestr;
}

function getSign(params) {
    try {
        //读取秘钥
        var key = '-----BEGIN RSA PRIVATE KEY-----\r\n'+
			'MIIEpQIBAAKCAQEA5Xnvr74qf6j4H8oUQjpgS0t/PWCjJeoZr7dPMIpw0ITpgd1Faq7ETF121itcFz5kUY1Z3xR+2b/uAJl0z4x/QvmWFG1iumHH7QQHeLFdUp8eYfabhhoNREKrBE237In25yvT5xwBBoCYbpgbm5btD05U/GYJrDh/wyFGfV5GeoEvAb4W2LqDlh8azaMpg2WuzeoOTeBH0GrTcJRSQPU9gLj3AR+eUyo8kh9XoMTqDgbFnYK5Bzo4/qfCJqbUiPjt4o2/ISxnKWxfYMbD686GW3sbdyYVJvJyCnobzs8L3dWX4Dgs2PvO15XTPJAUH+J9pS4AQmC84FuRxoHO6PwmBQIDAQABAoIBAQCuEMBvXqB+FX2hH3gehIlmk+4AcL1QlTLGxxWajGjmwusdRurQ8aCVDJCIBHvmZb1S3xW80Z8nLR8r9TtV9AzUkN32wMKS/njYoKXKNz/C3E//n0B5iGlnzepLaWiKVFylHemu9N8SP5lgyqCmdOV9Jr3wdrX/nRvMuADwOALeCJAApfgkWJALMQRpiTDYRRT/JKlIZWtaJTvEZgA/g8C9eYJoaz1AOe54+82qcsFskYJyKZu/Fo3RO+qO+CRBPLNiA57DapNpcyCtA2XXT62nFznavvOLHitKEDSAAbFvJPhJSfal2sktakd0UBRR3SwPqFuY/3hQP7mOorIkVOoBAoGBAPgsNt4y6UEGOIaA1xl5RTuFqTrV48p9OloUG6dQt1uUIFxcXwFbhRYwRij2wHMXB7jbsTYqFUJE4MOm3YWNqz//94r+dC8083DlFo986RAySslCG7lPJSZtha45HaBWQzCSBQbA9DQ+W2YS6pQ45Wf+SAsdrEggBL7NfwpJVNcdAoGBAOy2w6dVO1yUWDQXVdr4TIumNzmSHK/AsFHtT9vFIPXwlKZVayQJE2aNdu8F97b9KSiWarGJa21Vc/ZJOiwpr8mTiMTy9wzsnHlRO+5sztwhayVf1x4+C3hks9aN6oMXEf6XRbAbEifH2IQ9jBPfe6dCb77rtpdw3o9VznGIoQ4JAoGBAJh6QfPff+TNt6kcPAyQr/LUOpfFlsFwk4uI0zzHoQCJUCCvOEgTPP/XBSRiBvgvbDUt9gF7dbhTrW1Ids55roAR+rvRfv0KIZB5kJT0gBXNcJmbHoGKmR61J+9VdFhw57NN4/y0TNZUgb+DW9FZ68krOIRr5NAjrAa3J5jgWVoZAoGAN+QHWlEjjP5xvQrteKA74pVCYNOA9nZ2q0FvI6Lt32QIlSWCAKYr8IDiXhl4nbo0p6KsWnLp7IzKrpInrBnDqcKt/mKntmN/pp1pmygRx6QUWmTAtCFOMAUG+VfU0VL3Kreo+qXJqZ7kHoUxt9eCqMFlBR0+pY8+3XUTI3dxH5ECgYEA4Cl49R8meVEuPHFFWuw1Z4JllKCFq2iCXbSjL1cdLuB0Sy82JBteF36IMYNZlonVUkJJFXXAZbAADnX7mJ/bEvl9PylBdUO3csNjr+uMO0bGxWDWXwd+TlkFomlT0DRFp4LqMsFiSCUxv1GIKuee40V2PaGws6zBX0NdT8JyCxo='
        	+'\r\n-----END RSA PRIVATE KEY-----';
        var prestr = getParams(params,false);
        var sign = crypto.createSign('RSA-SHA256');
        // console.log(prestr);
        // console.log('\r\n--------------------\r\n');
        sign.update(prestr);
        sign = sign.sign(key, 'base64');
        // console.log(sign);
        // console.log('\r\n--------------------\r\n');
        return encodeURIComponent(sign);
    } catch(err) {
        console.log('err', err)
    }
}


function transfer(trans_obj){
	var url = 'https://openapi.alipaydev.com/gateway.do?';
	//var url = 'https://openapi.alipay.com/gateway.do?';
	var params = {
		timestamp : new Date().Format('yyyy-MM-dd hh:mm:ss'),
		method : 'alipay.fund.trans.toaccount.transfer',
		app_id : app_id,
		version : '1.0',
		charset : 'utf8',
		sign_type  : 'RSA2',
		format : 'JSON',
		biz_content : JSON.stringify(trans_obj)
	}
	var sign = getSign(params);
	var params_str = getParams(params,true)+"&sign="+sign;
	url += params_str;

	console.log(url);

	request.get(url, function (error, response, body) {
	  console.log('\r\n--------------------\r\n');
	  if (!error && response.statusCode == 200) {
	  	console.log(body);
	  }else if(error){
	  	console.log(error);
	  }else{
	  	console.log('status : '+response.statusCode);
	  	console.log(body);
	  }
	})
}
*/

function trans_by_api(trans_obj,next){
	service.toaccountTransfer(trans_obj).then(function(res){
		next(null,res);
	}).catch(function(err){
        next(err,null)
    });
}

module.exports.trans_by_api = trans_by_api;

/*trans_by_api({
		"out_biz_no":"3142321423431",
		"payee_type":"ALIPAY_LOGONID",
		"payee_account":"zhangzicong6@gmail.com",
		"amount":"0.1",
		"payer_show_name":"明星说",
		"payee_real_name":"张子丛",
		"remark":"购物提现"
	},function(err,res){
		console.log(err);
		console.log('\r\n---------------\r\n');
		console.log(res);
	});
s*/

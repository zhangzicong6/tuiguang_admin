var request = require('request');

function getkouling() {
	var klurl = encodeURIComponent("http://haibao.m.taobao.com/html/NsIuXsJaj");
	var kltext = encodeURIComponent("免费分享返利机器人");
	var tpwdpic = encodeURIComponent("https://gw.alicdn.com/tfs/TB1c.wHdh6I8KJjy0FgXXXXzVXa-580-327.png");
	var rq_url ="https://api.open.21ds.cn/apiv1/createtkl?apkey=7603dffc-e95d-e284-9c07-de897e0fbcc5"
	+"&klurl="+klurl+"&kltext="+kltext+"&tpwdpic="+tpwdpic
	request.get(rq_url,function(err,response){
		if(err){
			console.log(err)
		}else{
			console.log('-----response-----')
			console.log(response)
		}
	})
}

getkouling()
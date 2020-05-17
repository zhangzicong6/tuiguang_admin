const rp = require('request-promise');
var schedule = require("node-schedule");

let index = 0;
let domains = [
	'tiexie0.wang',
	'n.tssdyw.cn',
	'n.juhuiwz.com'
];

async function check() {
	let domain = domains[index]
	//console.log('------检查域名儿------')
	//console.log(domain)
	let url = 'https://wx.horocn.com/api/v1/wxUrlCheck?api_token=c7f8a793af51ff70a5e9b01ead4c38c9&req_url='+domain
	index = (index+1)%domains.length
	let s_res = await rp(url)
	s_res = JSON.parse(s_res)
	if(s_res.code == 0){
		if(s_res.data.status == 'blocked'){
			console.log('域名儿被封 ： '+ domain)
			let options = {
			    method: 'POST',
			    uri: 'https://pushbear.ftqq.com/sub',
			    body: {
			        sendkey: '12933-4e0c6a6c2358fbee166458eaae6c174d',
			        text: domain+'   被封了'
			    },
			    json: true // Automatically stringifies the body to JSON
			};
			let noti = await rp(options)
		}
	}
}

var rule = new schedule.RecurrenceRule();
var times = [new schedule.Range(0, 59)];
rule.second = times;
var j = schedule.scheduleJob(rule, function () {
    check()
});
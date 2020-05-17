var schedule = require("node-schedule");
var baokuan_conf = require('../conf/baokuan.json');
var MessageServer = require('../message_server.js');

function get_data(){
	for (var i = 0; i < baokuan_conf.keywords.length; i++) {
		getitem(baokuan_conf.keywords[i],i*180000);
	}
}

function getitem(keyword,time){
	setTimeout(function(){
		MessageServer.getInstance().get_baokuan(keyword);
		console.log("执行......");
		console.log(keyword);
	},time);
}

setTimeout(function(){
	//抓取
	//get_data();
	/*var keyword = {
			"class":"3",
			"key":"儿童"
		};
	MessageServer.getInstance().get_baokuan(keyword);*/
},10000)


schedule.scheduleJob('* * * 1/3 * *', function(){
        console.log('scheduleCronstyle:' + new Date());
        get_data();
 });
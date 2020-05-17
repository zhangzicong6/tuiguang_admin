var socket = require('socket.io')
var WechatAPI = require('wechat-api');
var weichat_conf = require('./conf/weichat.json');
var weichat_apis ={};
var TokenMessageModel = require('./model/TokenMessage');
var BaoKuanModel = require('./model/BaoKuan');


String.prototype.stripHTML = function() {
	var reTag = /<(?:.|\s)*?>/g;
	return this.replace(reTag,"");
}

Array.prototype.contains = function(obj) {   
  var i = this.length;   
  while (i--) {   
    if (this[i] === obj) {   
      return i;  // 返回的这个 i 就是元素的索引下标，  
    }   
  }   
  return false;   
}

var MessageServer = function(server){
	this.instance = null;
	this.server = server;
	this.io = null;
	this.sockets = {};
	this.socket_ids = [];
	this.init_io(server,this);
}

MessageServer.getInstance = function(server) {
    if (!this.instance) {
        this.instance = new MessageServer(server);
    }
    return this.instance;
};


MessageServer.prototype.init_io = function(server,self) {
	self.io = socket.listen(server);
	self.io.on('connection', function (socket) {
		console.log('connection')
		self.sockets[socket.id] = socket;
		self.socket_ids.push(socket.id);
		socket.on('disconnect', function(){
		    console.log('user disconnected');
		    delete self.sockets[socket.id];
		    if(self.socket_ids.indexOf(socket.id) != -1){
			    self.socket_ids.splice(self.socket_ids.indexOf(socket.id),1)
			}
		});

		socket.on('token',function(msg){
			msg = msg.stripHTML();
			msg = JSON.parse(msg);
			var config = weichat_conf[msg.code];
			if(!weichat_apis[config.code]){
				weichat_apis[config.code] = new WechatAPI(config.appid, config.appsecret);
			}
			var client = weichat_apis[config.code];

			if(!msg.data){
				var str = "主人！！这家店铺太抠门了！没有设置优惠券和补贴！！\r\n-----------------\r\n"
						+ "主人不妨逛逛我的优惠券网站：http://t.cn/R3keYuo\r\n"
						+ "点击查看更多优惠！\r\n-----------------\r\n还可以输入：搜索+商品名（例如：搜索鞋子）即可查找优惠券";
				client.sendText(msg.openid,str,function(err,res){
					if(err){
						console.log(err)
					}
				});
				return;
			}

			var message = new TokenMessageModel({
				title : msg.data.title,
				price : msg.data.price,
				reservePrice : msg.data.reservePrice,
				tkCommFee : (0.2*msg.data.tkCommFee).toFixed(2),
				code : msg.code,
				openid : msg.openid,
				token : msg.token,
				link_url : msg.link_url,
				couponAmount : msg.data.couponAmount,
				shopTitle : msg.data.shopTitle,
				pictUrl : msg.data.pictUrl,
				url : msg.url,
				bizMonth :msg.data.bizMonth
			});
			message.save(function(err,doc){
				
				client.sendNews(message.openid,[{
				   "title":"返利:"+message.tkCommFee+"  优惠券:"+message.couponAmount+"  原价:"+message.price,
                    "url":"https://mingtianhuigenghao.kuaizhan.com/?image=http:"+message.pictUrl+"&word="+message.token,
				   "picurl":'http:'+message.pictUrl
				}],function(err,res){
					if(err){
						console.log(err)
					}
				});
			});
		});

		socket.on('one_baokuan',function(msg){
			msg = msg.stripHTML();
			msg = JSON.parse(msg);
			if(!msg.data){
				return
			}
			console.log('-------爆款商品获取--------')
			var baokuan = new BaoKuanModel({
				title : msg.data.title,
				price : msg.data.price,
				reservePrice : msg.data.reservePrice,
				tkCommFee : (0.2*msg.data.tkCommFee).toFixed(2),
				token : msg.token,
				link_url : msg.link_url,
				couponAmount : msg.data.couponAmount,
				shopTitle : msg.data.shopTitle,
				pictUrl : msg.data.pictUrl,
				url : msg.url,
				bizMonth :msg.data.bizMonth,
				key:msg.key,
				class:msg.class
			});
			baokuan.save(function(err,doc){	
			});
		});

	});
}

MessageServer.prototype.req_token = function(data){
	if(this.socket_ids.length == 0){
		console.log('no socket connect ');
		return;
	}
	var index = parseInt(Math.random()*this.socket_ids.length);
	var key = this.socket_ids[index];
	this.sockets[key].emit('getToken',JSON.stringify(data));
}


MessageServer.prototype.req_title_token = function(data){
	if(this.socket_ids.length == 0){
		console.log('no socket connect ');
		return;
	}
	var index = parseInt(Math.random()*this.socket_ids.length);
	var key = this.socket_ids[index];
	this.sockets[key].emit('getTitleToken',JSON.stringify(data));
}

MessageServer.prototype.get_one_baokuan = function(data){
	if(this.socket_ids.length == 0){
		console.log('no socket connect ');
		return;
	}
	var index = parseInt(Math.random()*this.socket_ids.length);
	var key = this.socket_ids[index];
	this.sockets[key].emit('getOneBaoKuan',JSON.stringify(data));
}

/*MessageServer.prototype.get_baokuan = function(data){
	if(this.socket_ids.length == 0){
		console.log('no socket connect ');
		return;
	}
	var index = parseInt(Math.random()*this.socket_ids.length);
	var key = this.socket_ids[index];
	this.sockets[key].emit('getBaoKuan',JSON.stringify(data));
}*/


module.exports = MessageServer
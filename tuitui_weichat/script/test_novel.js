var NovelTransferModel = require('../model/NovelTransfer');

async function main() {
	var arr = [
		'https://mp.weixin.qq.com/s?__biz=MzU3MjgwNjMwOA==&mid=2247483653&idx=1&sn=6710eed3e4fded6a0908d15f1981ceb0&chksm=fcca04cecbbd8dd8a27a6a279922184aba39c2a9d0ae16e37f499ae96a29cef1260717a549d6&token=1062263819&lang=zh_CN#rd',
		'https://mp.weixin.qq.com/s?__biz=Mzg2MDA3MTQ0Mw==&mid=2247483650&idx=1&sn=e63cd3d146170efab8da7532a6007ccd&chksm=ce2ab27ef95d3b68746b920a1a73c886e45f0d14fd4a873a6b28c470aadd61a40583b101fb6b&token=1537199067&lang=zh_CN#rd',
		'https://mp.weixin.qq.com/s?__biz=Mzg2OTA3MTE2Ng==&mid=2247483653&idx=1&sn=0fbc227c184f01aa56c4f54e6e59d50c&chksm=cea3e154f9d46842acdd591a16cf898a053c96b88212d7dac509b2af25872495037b028d5e3a&token=321181346&lang=zh_CN#rd',
		'https://mp.weixin.qq.com/s?__biz=MzU4OTgwNTQyNA==&mid=2247483653&idx=1&sn=c09901f04abfd31f3bc129caa1cfe2b0&chksm=fdc6a31acab12a0c7e3d3e4f3ae72e719b4e0c2d18628d452e9d3985dddcd5699da910de884a&token=490068360&lang=zh_CN#rd',
		'',
		'',
		'',
		'',
		'',
		'',
		'',
		'',
		'',
		'',
		'',
		'',
		'',
	]
	var novels = await NovelTransferModel.find({url:{$regex:"oorggt.top"}})
	
	for (var i = 0; i < novels.length; i++) {
		var replaceUrl = ''
		replaceUrl = arr[i%arr.length]
		var novel = novels[i];
		novel.replaceUrl = replaceUrl;
		novel.save()
	}
}

var date =new Date(Date.now()-1*24*60*60*1000)
var now = new Date()
var MessageModel = require('../model/Message');

console.log(date)
console.log('--------')
console.log(now)
MessageModel.find({timing_time:{$gte:date,$lt:now}},['timing_time','title'],function(err,list){
	console.log(list)
})

//main()
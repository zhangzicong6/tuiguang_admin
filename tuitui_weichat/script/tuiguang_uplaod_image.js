const TuiGuangModel = require('../model/TuiGuang.js');
const async = require('async');
const ali_oss_util = require('../util/ali_oss_util');
const img_path ='/home/work/tuiguang/project/public/images/website/'

let get = async () => {
	let tuiguangs = await TuiGuangModel.find();
	async.eachLimit(tuiguangs,20,async (item)=>{
		let change =false;
		if(item.picurl){
			change =true;
			let picurl = item.picurl;
			let file_name = picurl.substring(picurl.lastIndexOf('/')+1)
			item.picurl_ali = await ali_oss_util.upload(file_name,img_path+file_name)
			console.log('---------picurl_ali---------')
			console.log(item.picurl_ali)
		}
		if(item.finalImg){
			change =true;
			let finalImg = item.finalImg;
			let file_name = finalImg.substring(finalImg.lastIndexOf('/')+1)
			item.finalImg_ali = await ali_oss_util.upload(file_name,img_path+file_name)
			console.log('---------finalImg_ali---------')
			console.log(item.finalImg_ali)
		}
		if(change){
			await item.save()
		}
	},(err,reslut)=>{
		console.log(err,reslut)
	})
}


get()
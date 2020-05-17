var express = require('express');
var router = express.Router();
var handler = require('../util/db.js')
var MPModel = require('../model/MiniProgram.js')
var multer = require('multer');
var fs = require('fs')
var mem = require('../util/mem.js');

var upload = multer({
    dest: __dirname+'/../public/uploads'
});

router.post('/upload', upload.single('imageFile'), function(req, res, next) {
	console.log(__dirname+"/../public/uploads/"+req.file.filename+'.jpg');
	fs.rename(req.file.path, __dirname+"/../public/uploads/"+req.file.filename+'.jpg', function(err) {
        if (err) {
            throw err;
        }
        console.log('上传成功!');
    })
    res.send({filename: req.file.filename + '.jpg'});
})

router.get('/',function(req,res,next){
	MPModel.find(function(err,result){
		if(err){
			console.log(err)
			res.send({err: err})
		}else{
			res.send({success: "查询成功", data: result})
		}
	})
})

router.post('/',function(req,res,next){

	//eturn res.send(req.param('appid'))
	var mp = new MPModel({
		appid: req.body.appid,
		appname: req.body.appname,
	    img: req.body.img,
	    play_numbers: req.body.play_numbers,
	    intro: req.body.intro,
	    path: req.body.path,
	    isBanner : Boolean(req.body.isBanner),
	    isShow: false
	});
	if(req.body.extra){
		var extra_obj;
		try{
			extra_obj= JSON.parse(req.body.extra)
		}catch(e){
			console.log(e)
		}
		mp.extra = extra_obj;
	}
	mp.save();
	res.send({success: "新建成功"})
})

router.put('/:id',function(req,res,next){
	MPModel.findByIdAndUpdate(req.params.id,{
		appid: req.body.appid,
		appname: req.body.appname,
	    img: req.body.img,
	    play_numbers: req.body.play_numbers,
	    intro: req.body.intro,
	    path: req.body.path,
	    isBanner : Boolean(req.body.isBanner)
	},function(err,result){
		if(err){
			console.log(err);
			res.send({err:err})
		}else{
			mem.set('miniprogram','',10).then(function(){});
			res.send({success: "修改成功"})
		}
	})
})

router.put('/show/:id',function(req,res,next){
	MPModel.findByIdAndUpdate(req.params.id,{
		isShow:Boolean(req.body.isShow)
	},function(err,result){
		if(err){
			console.log(err);
			res.send({err:err})
		}else{
			mem.set('miniprogram','',10).then(function(){});
			res.send({success: "修改成功"})
		}
	})
})

router.put('/sort/:id',function(req,res,next){
	MPModel.findByIdAndUpdate(req.params.id,{
		index:parseInt(req.body.index)
	},function(err,result){
		if(err){
			console.log(err);
			res.send({err:err})
		}else{
			mem.set('miniprogram','',10).then(function(){});
			res.send({success: "修改成功"})
		}
	})
})


router.delete('/:id',function(req,res,next){
	MPModel.findByIdAndRemove(req.params.id,function(err,result){
		if(err){
			console.log(err);
			res.send({err:err})
		}else{
			mem.set('miniprogram','',10).then(function(){});
			res.send({success: "删除成功"})
		}
	})
})

router.get('/view/*',function(req,res,next){
	res.render('miniProgram/index');
})


module.exports = router;
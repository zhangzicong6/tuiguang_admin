var express = require('express');
var router = express.Router();
var VideoProgramModel = require('../model/VideoProgram.js');
var AdzoneTaoModel = require('../model/AdzoneTao.js');
var conf = require('../conf/adzone.json');
var Memcached = require('memcached');
var memcached = new Memcached('127.0.0.1:11211');
var async = require('async');


router.get('/getjs/:time.js', function(req, res, next) {
	async.waterfall([
			function(callback){
				memcached.get('taokoulingjs',function(err,taokouling){
					callback(err,taokouling);
				});
			},
			function(taokouling,callback){
				if(taokouling){
					callback(null,JSON.parse(taokouling));
				}else{
					AdzoneTaoModel.findOne({},function(err,tao){
						if(tao){
							memcached.set('taokoulingjs',JSON.stringify(tao),60,function(err){});
						}
						callback(err,tao);
					});
				}
			},
		],function(error,tao){
			if(error){
				console.log(error);
			}
			if(tao){
				conf = {text:tao.content,code:tao.kouling};
			}
			res.render('adzone/mew_js', conf);
	});
});

router.get('/get_testjs/:time.js',function(req,res,next){
	async.waterfall([
			function(callback){
				memcached.get('taokoulingjs',function(err,taokouling){
					console.log(taokouling);
					callback(err,taokouling);
				});
			},
			function(taokouling,callback){
				if(taokouling){
					callback(null,JSON.parse(taokouling));
				}else{
					AdzoneTaoModel.findOne({},function(err,tao){
						if(tao){
							memcached.set('taokoulingjs',JSON.stringify(tao),60,function(err){});
						}
						callback(err,tao);
					});
				}
			},
		],function(error,tao){
			if(error){
				console.log(error);
			}
			if(tao){
				conf = {text:tao.content,code:tao.kouling};
			}
			res.render('adzone/mew_test_js', conf);
	});
});

router.get('/video',function(req,res,next){
	var pro = req.query.pro?req.query.pro:'test_program';
	VideoProgramModel.findOne({program:pro},function(err,vp){
		if(!vp){
			vp = {program:pro,video_url:'',title:'',share:true};
		}
		res.render('adzone/video',vp);
	});
});

router.use('/setvideo',function(req,res,next){
	var vp= {
		program:req.query.program,
		video_url:req.query.video_url,
		title:req.query.title,
		share:Boolean(req.query.share)
	};
	VideoProgramModel.findOneAndUpdate({program:vp.program},{$set:vp},{upsert:true,rawResult:true,new:true},function(err,nvp){
		if(err){
			console.log(err);
		}
		if(!nvp){
			nvp = {program:pro,video_url:'',title:'',share:true};
		}
		res.render('adzone/video',nvp.value);
	});
});

router.use('/get_video',function(req,res,next){
	var pro = req.query.pro?req.query.pro:'test_program';
	VideoProgramModel.findOne({program:pro},function(err,vp){
		if(!vp){
			vp = {program:pro,video_url:''};
		}
		res.send(vp);
	});
});

router.get('/tao',function(req,res,next){
	AdzoneTaoModel.findOne({},function(err,tao){
		if(!tao){
			tao = {content:'',kouling:''};
		}
		res.render('adzone/tao',tao);
	});
});

router.use('/settao',function(req,res,next){
	var tao= {content:req.query.content,kouling:req.query.kouling};
	AdzoneTaoModel.findOneAndUpdate({},{$set:tao},{upsert:true,rawResult:true,new:true},function(err,tao){
		if(err){
			console.log(err);
		}
		if(!tao){
			tao = {content:'',kouling:''};
		}else{
			memcached.set('taokoulingjs','',60,function(err){});
		}
		res.render('adzone/tao',tao.value);
	});
});



module.exports = router;

var express = require('express');
var router = express.Router();
var TagModel = require('../model/Tag.js')

router.get('/',function(req,res,next){
	TagModel.find(function(err,result){
		if(err){
			console.log(err)
			res.send({err: err})
		}else{
			res.send({success: "查询成功", data: result})
		}
	})
})

router.get('/get_name',function(req,res,next){
	TagModel.findOne({_id: req.query.tagId},function(err,result){
		if(err){
			console.log(err)
			res.send({err: err})
		}else{
			res.send({success: "查询成功", data: result})
		}
	})
})

router.post('/',function(req,res,next){
	TagModel.findOne({name:req.body.name},function(err,result){
		if(err){
			console.log(err)
			res.send({err: err})
		}else{
			console.log('result', result)
			if(result){
				console.log("有数据")
				res.send({success: "查询成功", data: result})
			}else{
				console.log("新增用户")
				var tm =TagModel({
					name:req.body.name
				})
				tm.save(function(error,tm){
					console.log(error)
					res.send({success: "新增标签成功", data: tm})
				});
			}
		}
	});
})


router.delete('/:id',function(req,res,next){
	TagModel.findByIdAndRemove(req.params.id,function(err,result){
		if(err){
			console.log(err);
			res.send({err:err})
		}else{
			res.send({success: "删除成功"})
		}
	})
})



module.exports = router;
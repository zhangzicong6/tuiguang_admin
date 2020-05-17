var express = require('express');
var router = express.Router();
var handler = require('../util/db.js')
var Links = require('../model/links.js')

router.get('/', function(req, res, next) {
	switch (req.query.action) {
		case 'show_links':
			let selector = {class: req.query.class}
			handler('find', Links, selector, function(result) {
				if (result == '') {
					res.send({err: "暂时没有此类商品的链接，请添加"})
				} else {
					res.send({success: "查询成功", data: result})
				}
			})
		break;
		case 'edit_links':
			let selector1 = [{
				class: req.query.class, 
				_id: req.query.id
			}, {
				title: req.query.title,
				links: req.query.links
			}]
			handler('update', Links, selector1, function(data) {
				res.send({success: "修改成功"})
			})
		break;
		case 'delete_links':
			handler('find', Links, {}, function(result) {
				if (result == '') {
					res.send({err: "暂时没有此类商品的链接，请添加"})
				} else {
					let selector2 = {class: req.query.class, _id: req.query.id}
					handler('delete', Links, selector2, function(data) {
						res.send({success: "删除成功", result: result})
					})
				}
			})
		break;
	}
})

router.post('/save_links', function(req, res, next) {
	let selector = {class: req.body.class, title:req.body.title}
	handler('find',  Links, selector, function(result) {
		if (result == '') {
			let selector = {
				class: req.body.class,
				links: req.body.links,
				title: req.body.title
			} 
			handler('insert', Links, selector, function(result) {
				res.send({success: "商品添加成功"})
			})
		} else {
			res.send({err: "此商品已经存在，请重新添加"})
		}
	})
	
})


module.exports = router;
var express = require('express');
var router = express.Router();
var handler = require('../util/db.js')
var Page = require('../model/page.js')
var Links = require('../model/links.js')

router.get('/add_page', function(req, res, next) {
	let selector = {pagename: req.query.pagename}
	handler('find', Page, selector, function(result) {
		if (result != '') {	
			res.send({err: '该单页分类已存在，请重新输入'})
		} else {
			let selector = {
				pagename: req.query.pagename,
				class: req.query.class
			} 
			handler('insert', Page, selector, function(data) {
				res.send({success: "单页添加成功"})
			})
		}
	})
})
router.get('/show_page', function(req, res, nex) {
	handler('find', Page, {}, function(result) {
		if (result == '') {
			res.send({err: '没有查询到单页信息'})
		} else {
			res.send({success: "查询成功", data: result})
		}
	})
})

router.get('/update_page', function(req, res, next) {
	handler('find', Page, {_id: req.query.id}, function(result) {
		if (result == '') {
			res.send({err: "没有查询到此商品的相关信息"})
		} else {
			let selector = [{
				_id: req.query.id
			}, {
				class: req.query.class,
				pagename: req.query.pagename
			}]
			handler('update', Page, selector, function(data) {
				console.log(data)
				res.send({success: "修改成功成功"})
			})
		}
	})
})

router.get('delete_page', function(req, res, next) {
	let selector = {class: req.query.class}
	handler('find', Baokuan, selector, function(result) {
		if (result == '') {
			res.send({err: "没有查询到此商品的相关信息"})
		} else {
			handler('delete', Baokuan, selector, function(data) {
				res.send("删除成功")
			})
		}
	})
})


module.exports = router;

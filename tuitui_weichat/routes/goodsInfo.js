var express = require('express');
var router = express.Router();
var handler = require('../util/db.js')
var Baokuan = require('../model/BaoKuan.js')
var multer = require('multer');
var fs = require('fs')

var upload = multer({
    dest: './public/uploads'
});

router.post('/upload', upload.single('imageFile'), function(req, res, next) {
	fs.rename(req.file.path, "./public/uploads/"+req.file.filename+'.jpg', function(err) {
        if (err) {
            throw err;
        }
        console.log('上传成功!');
    })
    res.send({filename: req.file.filename + '.jpg'});
})

router.get('/', function(req, res, next) {
	switch (req.query.action){
		case "show_goods":
			let selector = {class: req.query.class}
			handler('find', Baokuan, selector, function(result) {
				if (result == '') {
					res.send({err: "暂无此类商品的相关信息，请联系后台开发人员"})
				} else {
					res.send({success: "查询成功", data: result})
				}
			})
		break;
		case "update_goods":
			let selector1 = {class: req.query.class, _id: req.query.id}
			handler('find', Baokuan, selector1, function(result) {
				if (result == '') {
					res.send({err: "暂无此类商品的相关信息，请联系后台开发人员"})
				} else {
					let selector11 = [{
						class: req.query.class,
						_id: req.query.id
					}, {
						pictUrl: req.query.pictUrl,
						title: req.query.title,
						token: req.query.token,
					}]
					handler('update', Baokuan, selector11, function(data) {
						res.send({success: "商品信息修改成功"})
					})
				}
			})
		break;
		case "delete_one":
			handler('find', Baokuan, {class: req.query.class}, function(result) {
				if (result == '') {
					res.send({err: "没有查询到此商品的相关信息"})
				} else {
					let selector2 = {class: req.query.class, _id: req.query.id}
					handler('delete', Baokuan, selector2, function(data) {
						res.send({success: "删除成功", result: result})
					})
				}
			})
		break;
		case "add":
			let selector3 = {
				class: req.query.class,
				title: req.query.title,
				pictUrl: req.query.pictUrl,
				token: req.query.token,
				price: req.query.price,
				shopTitle: req.query.shopTitle,
				url: req.query.url,
			}
			handler('insert', Baokuan, selector3, function(data) {
				res.send("插入成功")
			})
		break;
	}
})


module.exports = router;
var express = require('express');
var router = express.Router();
var RecommendNovelModel = require('../model/RecommendNovel.js');
var RecommendListModel = require('../model/RecommendList.js');
var DomainModel = require('../model/Domain.js');
var mem = require('../util/mem.js')

// 获取小说列表
router.get('/list/show', async(req, res, next) => {
	let docs = await RecommendListModel.find()
	if(docs) {
		res.send({success: 'ok', data: docs})
	} else {
		res.send({err: 'error'})
	}
})

//  新增小说列表
router.post('/list/create', async(req, res, next) => {
	let message = {
		type: req.body.type,
		listCode: req.body.listCode || ''
	}
	let docs = await RecommendListModel.create(message);
	if(docs) {
		res.send({
			success: '创建成功',
			data: docs
		})
	}else {
		res.send({error: '创建失败'})
	}
});

//  修改列表页统计代码
router.post('/list/update', async(req, res, next) => {
	let id = req.body.id;
	let message = {
		listCode: req.body.listCode
	}
	let docs = await RecommendListModel.findByIdAndUpdate(id, message, {new: true})
	if(docs) {
		res.send({
			success: '修改成功',
			data: docs
		})
	}else {
		res.send({err: 'error'})
	}
});

//  删除某一条列表
router.get('/list/del', async(req, res, next) => {
	let id = req.query.id;
	let docs = await RecommendListModel.findByIdAndRemove(id)
	if(docs) {
		res.send({
			success: '删除成功',
			data: docs
		})
	}else {
		res.send({err: 'error'})
	}
});

// 获取小说详情列表
router.get('/novel/show', async(req, res, next) => {
	let id = req.query.id;
	let docs = await RecommendNovelModel.find({id: id})
	if(docs) {
		res.send({success: 'ok', data: docs})
	} else {
		res.send({err: 'error'})
	}
})

// 获取小说详情列表
router.get('/novel', async(req, res, next) => {
	let id = req.query.id;
	let docs = await RecommendNovelModel.findById(id)
	if(docs) {
		res.send({success: 'ok', data: docs})
	} else {
		res.send({err: 'error'})
	}
})

//  新增小说详情页
router.post('/novel/create', async(req, res, next) => {
	let novelMessage = {
		id: req.body.id,
		type: req.body.type,
		title: req.body.title,
		date: req.body.date,
		linkUrl: req.body.linkUrl,
		bannerUrl: req.body.bannerUrl,
		capter: req.body.capter,
		qrcode: req.body.qrcode,
		statisticsCode: req.body.statisticsCode || '',
		otherCode: req.body.otherCode,
		reading: req.body.reading,
		channel: req.body.channel || '',
		remarks: req.body.remarks || ''
	}
	let docs = await RecommendNovelModel.create(novelMessage);
	if(docs) {
		res.send({
			success: '创建成功',
			data: docs
		})
	}else {
		res.send({err: 'error'})
	}
})

//  修改小说详情页
router.post('/novel/update', async(req, res, next) => {
	let id = req.body._id;
	let message = {
		title: req.body.title,
		date: req.body.date,
		linkUrl: req.body.linkUrl,
		bannerUrl: req.body.bannerUrl,
		capter: req.body.capter,
		qrcode: req.body.qrcode,
		statisticsCode: req.body.statisticsCode,
		otherCode: req.body.otherCode,
		channel: req.body.channel,
		remarks: req.body.remarks
	}
	let docs = await RecommendNovelModel.findByIdAndUpdate(id, message, {new: true});
	if(docs) {
		res.send({
			success: '修改成功',
			data: docs
		})
	}else {
		res.send({err: 'error'})
	}
})

//  删除小说详情页
router.get('/novel/del', async(req, res, next) => {
	let id = req.query.id;
  let docs = await RecommendNovelModel.findByIdAndRemove(id)
  console.log(docs)
	if(docs) {
		res.send({
			success: '删除成功',
			data: docs
		})
	}else {
		res.send({err: 'error'})
	}
})


module.exports = router;
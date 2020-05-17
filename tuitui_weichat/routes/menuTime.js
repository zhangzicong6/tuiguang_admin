var express = require('express');
var router = express.Router();
var MenuTimeModel = require('../model/MenuTime');
var WechatUtil = require('../util/wechat_get.js');

router.get('/', async(req, res, next) => {
    let doc = await MenuTimeModel.find()
    res.send({data: doc})
})

router.post('/create', async(req, res, next) => {
    let data = {
        time: req.body.time,
        title: req.body.title,
        codes: req.body.codes,
        values: req.body.values
    }
    let doc = await MenuTimeModel.create(data)
    if (doc) {
        res.send({success: '创建成功', data: doc})
    } else {
        res.send({err: '创建失败'})
    }
})

router.post('/update', async(req, res, next) => {
    let id = req.body.id
    let data = {
        time: req.body.time,
        title: req.body.title,
        codes: req.body.codes,
        values: req.body.values
    }
    let doc = await MenuTimeModel.findByIdAndUpdate(id, data, {new: true})
    if (doc) {
        res.send({success: '修改成功', data: doc})
    } else {
        res.send({err: '修改失败'})
    }
})

router.get('/del', async(req, res, next) => {
    let id = req.query.id
    var doc = await MenuTimeModel.findByIdAndRemove(id)
    res.send({success: '删除成功', data: doc})
})

module.exports = router;

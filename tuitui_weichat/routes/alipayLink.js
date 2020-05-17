const express = require('express');
const router = express.Router();
const AlipayLink = require('../model/AlipayLink')

router.get('/', async(req, res, next) => {
    let data = await AlipayLink.find();
    res.send({data: data})
})

router.post('/', async(req, res, next) => {
    let message = {
        name: req.body.name,
        link: req.body.link
    };
    let data = await AlipayLink.create(message);
    if(data) {
        res.send({success: '添加成功', data: data})
    } else {
        res.send({error: '添加失败'})
    }
})

router.get('/del', async(req, res, next) => {
    let id = req.query.id
    let data = await AlipayLink.findByIdAndRemove(id)
    if (data) {
        res.send({success: '删除成功', data: data})
    } else {
        res.send({error: '删除失败'})
    }
})


module.exports = router;
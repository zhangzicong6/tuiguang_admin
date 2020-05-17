var express = require('express');
var router = express.Router();
var MsgModel = require('../model/Msg');
var mem = require('../util/mem.js');

router.get('/', async(req, res, next) => {
    let doc = await MsgModel.find()
    res.send({data: doc})
})

router.post('/create', async(req, res, next) => {
    let data = {
        type:req.body.type,
        description:req.body.description,
        contents:req.body.contents
    }
    let doc = await MsgModel.create(data)
    if(doc){
        await mem.set("msg_" + doc.msgId, doc,30*24*3600)
        res.send({success: '创建成功', data: doc})
    }else{
        res.send({err: '创建失败'})
    }
})

router.post('/update', async(req, res, next) => {
    let id=req.body.id
    let data = {
        type:req.body.type,
        description:req.body.description,
        contents:req.body.contents
    }
    let doc = await MsgModel.findByIdAndUpdate(id,data,{new:true})
    if(doc){
        await mem.set("msg_" + doc.msgId, doc,30*24*3600)
        res.send({success: '修改成功', data: doc})
    }else{
        res.send({err: '修改失败'})
    }
})

router.get('/del', async(req, res, next) => {
    let id=req.query.id
    var doc = await MsgModel.findByIdAndRemove(id)
    if(doc){
        await mem.set("msg_" + doc.msgId, '',1)
        res.send({success: '删除成功', data: doc})
    }else{
        res.send({err: '删除失败'})
    }
})

module.exports = router;
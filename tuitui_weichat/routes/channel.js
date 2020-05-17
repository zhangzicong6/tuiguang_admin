var express = require('express');
var router = express.Router();
var ChannelModel = require('../model/Channel.js')

router.get('/', async (req, res, next) => {
  let result = await ChannelModel.find();
  if(result.length > 0) {
    res.send({ success: "查询成功", data: result })
  } else {
    res.send({ err: '未查询到相关数据' })
  }
});

router.post('/', async (req, res, next) => {
  let message = await ChannelModel.find({ name: req.body.name });
  if(message.length > 0) {
    res.send({err: '该渠道已经存在'})
  } else {
    let result = await ChannelModel.create({ name: req.body.name});
    if(result) {
      res.send({ success: "创建成功", data: result })
    }
  }
});

router.put('/', async (req, res, next) => {
    let id = req.body._id;
    let result = await ChannelModel.findByIdAndUpdate(id, { name: req.body.name }, { new: true });
    if(result) {
      res.send({ success: "修改成功", data: result })
    }
});

router.delete('/', async (req, res, next) => {
  let result = await ChannelModel.findByIdAndRemove(req.query.id);
  if(result) {
    res.send({ success: '删除成功'})
  }
});

module.exports = router;
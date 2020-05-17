var express = require('express');
var router = express.Router();
var AdMaterialModel = require('../model/AdMaterial.js')
var mem = require('../util/mem.js')

router.get('/', async(req, res, next) => {
  let result = await AdMaterialModel.find();
  if(result.length > 0) {
    res.send({code: 1, msg: '查询成功', data: result})
  } else {
    res.send({code: 0, msg: '未查询到相关数据'})
  }
});

router.post('/', async(req, res, next) => {
  let message = {
    title: req.body.title,
    novelLink: req.body.novelLink,
    imgList: req.body.imgList
  }, result = await AdMaterialModel.create(message);
  if(result) {
    res.send({code: 1, msg: '添加成功', data: result})
  } else {
    res.send({code: 0, msg: '添加失败'})
  }
});

router.put('/', async(req, res, next) => {
  let message = {
    title: req.body.title,
    novelLink: req.body.novelLink,
    imgList: req.body.imgList
  }, id = req.body._id, result = await AdMaterialModel.findByIdAndUpdate(id, message, {new: true});
  await  mem.set('AdMaterial_' + result.id, '', 1*60)
  if(result) {
    res.send({code: 1, msg: '修改成功', data: result})
  } else {
    res.send({code: 0, msg: '修改失败'})
  }
});

router.delete('/', async(req, res, next) => {
  let id = req.query.id,
    result = await AdMaterialModel.findByIdAndRemove(id);
  if(result) {
    res.send({code: 1, msg: '删除成功'})
  } else {
    res.send({code: 0, msg: '删除失败'})
  }
});

module.exports = router;
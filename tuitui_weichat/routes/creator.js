var express = require('express');
var router = express.Router();
var CreatorModel = require('../model/Creator.js');

router.get('/', async function (req, res, next) {
  let result = await CreatorModel.find();
  if(result.length > 0) {
    res.send({ success: "查询成功", data: result })
  } else {
    res.send({ err: "查询失败" })
  }
});

router.post('/', async function (req, res, next) {
  let name = await CreatorModel.findOne({ name: req.body.name });
  if(name) {
    res.send({ success: "该创建人已存在，请勿重复创建", exist: 1, data: result })
  } else {
    var tm = CreatorModel({ name: req.body.name });
    tm.save(function (error, tm) {
      res.send({ success: "创建成功", exist: 0, data: tm })
    });
  }
});

router.delete('/', async function (req, res, next) {
  let result = await CreatorModel.findByIdAndRemove(req.query.id);
    if(result) {
      res.send({ success: "删除成功" })
    } else {
      res.send({ err: "删除失败" })
    }
});

module.exports = router;
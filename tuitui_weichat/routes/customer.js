const express = require('express');
const router = express.Router();
const CustomerModel = require('../model/Customer.js')

router.post('/', async (req, res, next) => {
  let { account, password, belongTo } = req.body;
  let result = await CustomerModel.find({account});
  if(result.length > 0) {
    res.send({code: 2, msg: "该账户名已存在，请检查输入是否有误"})
  } else {
    let data = await CustomerModel.create({ account, password, belongTo });
    if(data) {
      res.send({code: 1, msg: '账户创建成功', data})
    } else {
      res.send({code: -1, msg: '账户创建失败，请重试'})
    }
  }
});

router.get('/', async (req, res, next) => {
  let { account } = req.query, result;
  if(account) {
    result = await CustomerModel.find({account: {$regex: new RegExp(account)}})
  } else {
    result = await CustomerModel.find();
  }
  if(result.length > 0) {
    res.send({code: 1, msg: '查询成功', data: result})
  } else {
    res.send({code: -1, msg: '查询失败，请重试'})
  }
});

router.delete('/', async (req, res, next) => {
  let { _id } = req.query;
  let result = await CustomerModel.findByIdAndRemove(_id);
  if(result) {
    res.send({code: 1, msg: '删除成功'})
  } else {
    res.send({code: -1, msg: "删除失败"})
  }
});

module.exports = router;
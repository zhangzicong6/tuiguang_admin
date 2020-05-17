var express = require('express');
var router = express.Router();
var ConfigModel = require('../model/Config');
var mem = require('../util/mem.js');
var user = require('../script/get_users')
var exec = require('child_process').exec;
var request = require('request');
var UserconfModel = require('../model/Userconf');

router.get('/', async (req, res, next) => {
  let doc = await ConfigModel.find().sort({_id: -1})
  res.send({data: doc})
})

router.get('/find_one', async (req, res, next) => {
  let reg = new RegExp(req.query.name);
  let doc = await ConfigModel.find({name: {$regex: reg}})
  res.send({data: doc})
})

router.post('/create', async (req, res, next) => {
  let data = {
    name: req.body.name,
    appid: req.body.appid,
    appsecret: req.body.appsecret,
    token: req.body.token,
    EncodingAESKey: "tw4a1yTUv0VJURGNif96ibI4z3oWPJJWpuo2mHTvzLb",
    group: req.body.group,
    real_time: req.body.real_time,
    save_user: req.body.save_user,
    attribute: parseInt(req.body.attribute)
  }
  let doc = await ConfigModel.create(data)
  if (doc) {
    await mem.set("configure_" + doc.code, doc, 30 * 24 * 3600)
    res.send({success: '创建成功', data: doc})
  } else {
    res.send({err: '创建失败'})
  }
})

router.post('/update', async (req, res, next) => {
  console.log('doc-conf', req.body)
  let id = req.body._id
  let data = {
    name: req.body.name,
    appid: req.body.appid,
    appsecret: req.body.appsecret,
    token: req.body.token,
    EncodingAESKey: "tw4a1yTUv0VJURGNif96ibI4z3oWPJJWpuo2mHTvzLb",
    group: req.body.group,
    real_time: req.body.real_time,
    save_user: req.body.save_user,
    attribute: parseInt(req.body.attribute)
  }
  let doc = await ConfigModel.findByIdAndUpdate(id, data, {new: true})
  console.log('doc-conf', doc)
  if (doc) {
    await mem.set("configure_" + doc.code, doc, 30 * 24 * 3600)
    res.send({success: '修改成功', data: doc})
  } else {
    res.send({err: '修改失败'})
  }
})

router.get('/del', async (req, res, next) => {
  let id = req.query.id
  var doc = await ConfigModel.findByIdAndRemove(id)
  if (doc) {
    await UserconfModel.remove({code: doc.code})
    await mem.set("configure_" + doc.code, '', 1)
    res.send({success: '删除成功', data: doc})
  } else {
    res.send({err: '删除失败'})
  }
})

// router.get('/reset', async (req, res, next) => {
//   var config = new ConfigModel()
//   config.nextCount(function (err, count) {
//     config.resetCount(function (err, nextCount) {
//     });
//   });
//   res.send({success: '重置成功'})
// })

router.get('/jieguan', async (req, res, next) => {
  let code = req.query.code
  let jieguan = await mem.get("jieguan_" + code)
  if (!jieguan) {
    let config = await ConfigModel.findOneAndUpdate({code: code}, {status: -1})
    // let cmdStr = 'nohup node /home/work/tuitui_pro/tuitui_weichat/script/get_users.js ' + code+' &'
    // console.log(cmdStr)
    // exec(cmdStr, function (err, stdout, stderr) {
    //
    // })
    if (config.save_user) {
      request('http://localhost:3002/get_users?code=' + code, function (err, response) {
      })
    } else {
      request('http://localhost:3002/record_users?code=' + code, function (err, response) {
      })
    }
    res.send({success: '设置接管成功'})
  } else {
    res.send({success: '已接管'})
  }
})

module.exports = router;

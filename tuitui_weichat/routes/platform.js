var express = require('express');
var router = express.Router();
var PlatformModel = require('../model/Platform.js')
var PlatformDataModel = require('../model/PlatformData.js')
var rp = require("request-promise")

router.get('/', async(req, res, next) => {
  let result = await PlatformModel.find();
  if(result.length) {
    res.send({code: 1, msg: "查询成功", data: result})
  } else {
    res.send({code: -1, msg: "没有数据，请添加"})
  }
});

router.get('/data', async(req, res, next) => {
  let result = await PlatformDataModel.find();
  res.send({code: 1, msg: "查询成功", data: result})
});

router.post('/liantiao', async (req, res, next) => {
  let {td_url} = req.body;
 console.log(td_url, "2020-02-16,td_url")

  let ad_cb_url = 'https://ad.toutiao.com/track/activate/?link='
       +encodeURIComponent(td_url)+'&event_type=2'
 console.log(ad_cb_url, "2020-02-16,ad_cb_url")

 let result = await rp(ad_cb_url);
 console.log(result, "2020-02-16,result")
 res.send({code: 1, result, msg: "已回调"})
})

router.post('/', async (req, res, next) => {
  let {platform, gonghao_name, seruid} = req.body;
  if(!platform || !gonghao_name || !seruid) {
    res.send({code: -1, msg: "参数填写有误"})
  } else {
    let result = await PlatformModel.create({platform, gonghao_name, seruid});
    if(result) {
      res.send({code: 1, msg: "创建成功", data: result})
    } else {
      res.send({code: -1, msg: "创建失败，请重试"})
    }
  }
});

router.put('/', async (req, res, next) => {
  let {platform, gonghao_name, seruid, _id} = req.body;
  if(!_id || !platform || !gonghao_name || !seruid) {
    res.send({code: -1, msg: "修改失败"})
  } else {
    let result = await PlatformModel.findByIdAndUpdate(_id, {platform, gonghao_name, seruid}, {new: true});
    if(result) {
      res.send({code: 1, msg: "修改成功", data: result})
    } else {
      res.send({code: -1, msg: "修改失败"})
    }
  }
});

router.delete('/', async (req, res, next) => {
  let {id} = req.query;
  let result = await PlatformModel.findByIdAndRemove(id)
  if(result) {
    res.send({code: 1, msg: "删除成功"})
  } else {
    res.send({code: -1, msg: "删除失败"})
  }
});

module.exports = router;
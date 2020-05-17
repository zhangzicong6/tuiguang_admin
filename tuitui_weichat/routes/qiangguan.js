var express = require('express');
var router = express.Router();
var QiangguanModel = require('../model/Qiangguan.js');
var mem = require('../util/mem.js');

router.get("/", async(req, res, next) => {
  let docs = await QiangguanModel.find().sort({_id: -1});
  if(docs.length !== 0) {
    res.send({success: "查询成功", data: docs})
  } else {
    res.send({error: "查询失败"})
  }
})

function str_base(id_str){
  var str = new Buffer(id_str).toString('base64');
  str = new Buffer(str).toString('base64');
  str = str.split('').reverse().join('');
  return str;
}

function str_link(str){
    var len=str.length;
    var arr=[];
    for(var i=0;i<len;i++){
    arr.push(str.charCodeAt(i).toString(16));
    }
    var str_link = "\\x"+arr.join("\\x");
    return str_link;
}

router.post("/create", async(req, res, next) => {
  console.log(JSON.stringify(req.body))
  let message
  if(req.body.jumpLink){
    message = {
      jumpLink: req.body.jumpLink.trim(),
      wechatId: req.body.wechatId.trim(),
      baseStr: str_base(req.body.wechatId.trim()),
      strLink: str_link(req.body.jumpLink.trim())
    }
  }else{
    for (var key in req.body) {
            var body = JSON.parse(key)
            message = {
            jumpLink: body.jumpLink.trim(),
            wechatId: body.wechatId.trim(),
            baseStr: str_base(body.wechatId.trim()),
            strLink: str_link(body.jumpLink.trim())
          }
      }
  }
  console.log(message)
  let doc = await QiangguanModel.create(message);
  if(doc) {
    res.send({success: "创建成功", data: doc})
  } else {
    res.send({error: "创建失败"})
  }
})

router.post("/update", async(req, res, next) => {
  console.log(req.body)
  let _id = req.body._id;
  let message = {}
  if(_id){
    message = {
      jumpLink: req.body.jumpLink.trim(),
      wechatId: req.body.wechatId.trim(),
      baseStr: str_base(req.body.wechatId.trim()),
      strLink: str_link(req.body.jumpLink.trim())
    }
  }else{
    for (var key in req.body) {
            var body = JSON.parse(key)
            _id = body._id
            message = {
            jumpLink: body.jumpLink.trim(),
            wechatId: body.wechatId.trim(),
            baseStr: str_base(body.wechatId.trim()),
            strLink: str_link(body.jumpLink.trim())
          }
      }
  }
  
  let doc = await QiangguanModel.findByIdAndUpdate(_id, message, {new: true});
  mem.set('wechat_sub_' + _id, '', 1*60).then(function () {
                        //console.log('---------set transfer value---------')
  })
  if(doc) {
    res.send({success: "修改成功", data: doc})
  } else {
    res.send({error: "修改失败"})
  }
})

router.get("/del", async(req, res, next) => {
  let _id = req.query._id;
  let doc = await QiangguanModel.findByIdAndRemove(_id);
  if(doc) {
    res.send({success: "删除成功", data: doc})
  } else {
    res.send({error: "删除失败"})
  }
})

module.exports = router;
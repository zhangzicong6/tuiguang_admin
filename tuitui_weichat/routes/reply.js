var express = require('express');
var router = express.Router();
var ReplyModel = require('../model/Reply');
var mem = require('../util/mem.js');
var wechat_util = require('../util/get_weichat_client.js')
var multer = require('multer');
var fs = require('fs')

var upload = multer({
    dest: __dirname + '/../public/uploads'
});

router.post('/upload', upload.single('imageFile'), function (req, res, next) {
    fs.rename(req.file.path, __dirname + '/../public/uploads/' + req.file.filename + '.jpg', function (err) {
        if (err) {
            throw err;
        }
        console.log('上传成功!');
    })
    res.send({filename: req.file.filename + '.jpg'});
})

router.get('/', async(req, res, next) => {
    let code = req.query.code
    let doc = await ReplyModel.find({code:code})
    res.send({data: doc})
})

router.post('/create', async(req, res, next) => {
    if (req.body.replyType == 1 && req.body.url) {
        let client = await wechat_util.getClient(req.body.code);
        console.log(req.body.code, __dirname + "/." + req.body.url, client, '-------------------')
        client.uploadImageMaterial( __dirname + "/." + req.body.url, async function (error, result) {
            console.log(error,result,'---------------------result')
            if (result) {
                let media = {
                    type: "image",
                    content: {
                        mediaId: result.media_id
                    }
                }
                let data = {
                    code: req.body.code,
                    type: req.body.type,
                    replyType: req.body.replyType,
                    url: req.body.url || "",
                    showUrl:req.body.showUrl || "",
                    media: media,
                    text: req.body.text || "",
                    key: req.body.key || "",
                    sex: req.body.sex,
                    attribute: req.body.attribute
                }
                console.log(data,'---------------------data')
                let doc = await ReplyModel.create(data)
                if (doc) {
                    if (req.body.text) {
                        await mem.set("reply_" + doc.code + "_" + doc.text, {type: 1, msg: doc.media}, 30)
                    } else if (req.body.key) {
                        await mem.set("reply_" + doc.code + "_" + doc.key, {type:1,msg:doc.media}, 30)
                    } else {
                        await mem.set("reply_" + doc.code + "_subscribe", {type:1,msg:doc.media}, 30)
                    }
                    res.send({success: '创建成功', data: doc})
                } else {
                    res.send({err: '创建失败'})
                }
            } else {
                res.send({err: '创建失败'})
            }
        });
    } else {
        let data = {
            code: req.body.code,
            type: req.body.type,
            replyType: req.body.replyType,
            text: req.body.text || "",
            key: req.body.key || "",
            msgId: req.body.msgId,
            sex: req.body.sex,
            attribute: req.body.attribute
        }
        let doc = await ReplyModel.create(data)
        if (doc) {
            console.log(req.body.replyType, doc.code, doc.text, doc.key, '---------------------ttttttttt')
            if (req.body.text) {
                await mem.set("reply_" + doc.code + "_" + doc.text, {type:0,msg:doc.msgId}, 30)
            } else if (req.body.key) {
                await mem.set("reply_" + doc.code + "_" + doc.key, {type:0,msg:doc.msgId}, 30)
            } else {
                await mem.set("reply_" + doc.code + "_subscribe", {type:0,msg:doc.msgId}, 30)
            }
            res.send({success: '创建成功', data: doc})
        } else {
            res.send({err: '创建失败'})
        }
    }
})

router.post('/update', async(req, res, next) => {
    let id = req.body.id
    if (req.body.replyType == 1 && req.body.url) {
        let client = await wechat_util.getClient(req.body.code);
        client.uploadImageMaterial( __dirname + "/." + req.body.url, async function (error, result) {
            if (result) {
                let media = {
                    type: "image",
                    content: {
                        mediaId: result.media_id
                    }
                }
                let data = {
                    code: req.body.code,
                    type: req.body.type,
                    replyType: req.body.replyType,
                    url: req.body.url || "",
                    showUrl:req.body.showUrl || "",
                    media: media,
                    text: req.body.text || "",
                    key: req.body.key || "",
                    sex: req.body.sex,
                    attribute: req.body.attribute
                }
                let doc = await ReplyModel.findByIdAndUpdate(id, data, {new: true})
                if (doc) {
                    if (req.body.text) {
                        await mem.set("reply_" + doc.code + "_" + doc.text, {type:1,msg:doc.media}, 30)
                        await mem.set("reply_" + doc.code + "_" +  'subscribe', '', 1)
                        await mem.set("reply_" + doc.code + "_" +  'click', '', 1)
                      } else if (req.body.key) {
                        await mem.set("reply_" + doc.code + "_" + doc.key, {type:1,msg:doc.media}, 30)
                        await mem.set("reply_" + doc.code + "_" +  'subscribe', '', 1)
                        await mem.set("reply_" + doc.code + "_" +  'click', '', 1)
                      } else {
                        await mem.set("reply_" + doc.code + "_subscribe", {type:1,msg:doc.media}, 30)
                        await mem.set("reply_" + doc.code + "_" +  'subscribe', '', 1)
                        await mem.set("reply_" + doc.code + "_" +  'click', '', 1)
                      }
                    res.send({success: '修改成功', data: doc})
                } else {
                    res.send({err: '修改失败'})
                }
            } else {
                res.send({err: '修改失败'})
            }
        });
    } else {
        let data = {
            code: req.body.code,
            type: req.body.type,
            replyType: req.body.replyType,
            text: req.body.text || "",
            key: req.body.key || "",
            url: '',
            showUrl:'',
            msgId: req.body.msgId,
            sex: req.body.sex,
            attribute: req.body.attribute
        }
        let doc = await ReplyModel.findByIdAndUpdate(id, data, {new: true})
        console.log(doc)
        if (doc) {
            console.log(req.body.replyType, doc.code, doc.text, doc.key, '---------------------ttttttttt')
            if (req.body.text) {
                await mem.set("reply_" + doc.code + "_" + doc.text, {type:0,msg:doc.msgId}, 30)
                await mem.set("reply_" + doc.code + "_" +  'subscribe', '', 1)
                await mem.set("reply_" + doc.code + "_" +  'click', '', 1)
              } else if (req.body.key) {
                await mem.set("reply_" + doc.code + "_" + doc.key, {type:0,msg:doc.msgId}, 30)
                await mem.set("reply_" + doc.code + "_" +  'subscribe', '', 1)
                await mem.set("reply_" + doc.code + "_" +  'click', '', 1)
              } else {
                await mem.set("reply_" + doc.code + "_subscribe", {type:0,msg:doc.msgId}, 30)
                await mem.set("reply_" + doc.code + "_" +  'subscribe', '', 1)
                await mem.set("reply_" + doc.code + "_" +  'click', '', 1)
              }
            res.send({success: '修改成功', data: doc})
        } else {
            res.send({err: '修改失败'})
        }
    }
})

router.get('/del', async(req, res, next) => {
    let id = req.query.id
    var doc = await ReplyModel.findByIdAndRemove(id)
    if (doc) {
         var content = await mem.get("reply_" + doc.code + "_" +  'subscribe');
         console.log(content, "------------------content li xin -------------------")
        if (doc.text) {
            await mem.set("reply_" + doc.code + "_" + doc.text, '', 1)
            await mem.set("reply_" + doc.code + "_" +  'subscribe', '', 1)
            await mem.set("reply_" + doc.code + "_" +  'click', '', 1)
          } else if (doc.key) {
            await mem.set("reply_" + doc.code + "_" + doc.key, '', 1)
            await mem.set("reply_" + doc.code + "_" +  'subscribe', '', 1)
            await mem.set("reply_" + doc.code + "_" +  'click', '', 1)
        }
        res.send({success: '删除成功', data: doc})
    } else {
        res.send({err: '删除失败'})
    }
})

router.get('/remove', async(req, res, next) => {
  var docs = await ReplyModel.remove({})
  res.send({success: '删除成功', data: docs})
})

module.exports = router;

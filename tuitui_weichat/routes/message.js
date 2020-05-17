var express = require('express');
var router = express.Router();
var MessageModel = require('../model/Message');
var ConfigModel = require('../model/Config');
var send = require('../script/send_message');
var sendUser = require('../script/send_user_message');
var wechat_util = require('../util/get_weichat_client.js')


router.get('/', async(req, res, next) => {
    let sort = req.query.sort
    let messages = null
    if (sort === "_id") {
        messages = await MessageModel.find().sort({
            _id: -1
        });
    } else if (sort === "timing_time") {
        messages = await MessageModel.find().sort({
            timing_time: -1
        });
    }
    for (let i = 0; i < messages.length; i++) {
        let d = new Date(messages[i].timing_time);
        let year = d.getFullYear()
        let month = d.getMonth() + 1
        let date = d.getDate()
        let hour = d.getHours()
        let minutes = d.getMinutes()
        let seconds = d.getSeconds()
        if (month < 10) {
            month = '0' + month
        }
        if (date < 10) {
            date = '0' + date
        }
        if (hour < 10) {
            hour = '0' + hour
        }
        if (minutes < 10) {
            minutes = '0' + minutes
        }
        if (seconds < 10) {
            seconds = '0' + seconds
        }
        let times = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + seconds;
        messages[i].time = times
    }
    res.send({
        messages: messages
    })
})

router.get('/get_code', async(req, res, next) => {
    let doc = await ConfigModel.find()
    res.send({
        data: doc
    })
})


router.post('/create', async(req, res, next) => {
  var ab_img = __dirname + '/../' + req.body.img_path;
  var mediaId = await upload(parseInt(req.body.type), ab_img, req.body.codes)
    var message = {
        codes: req.body.codes,
        sex: req.body.sex,
        task: req.body.task,
        is_timing: req.body.is_timing,
        delay: req.body.delay,
        timing_time: req.body.timing_time,
        type: parseInt(req.body.type),
        contents: req.body.contents,
        img: req.body.img,
        tagId: req.body.tagId,
        mediaId: mediaId
    }
    console.log(message)
    var docs = await MessageModel.create(message);
    if (docs) {
        res.send({
            success: '成功',
            data: docs
        })
    } else {
        res.send({
            err: '创建失败，请检查输入是否有误'
        })
    }
})

router.post('/update', async(req, res, next) => {
    var id = req.body.id;
    var ab_img = __dirname + '/../' + req.body.img_path;
    var mediaId = await upload(parseInt(req.body.type), ab_img, req.body.codes)
    var message = {
        codes: req.body.codes,
        sex: req.body.sex,
        task: req.body.task,
        is_timing: req.body.is_timing,
        delay: req.body.delay,
        timing_time: req.body.timing_time,
        type: parseInt(req.body.type),
        contents: req.body.contents,
        img: req.body.img,
        tagId: req.body.tagId,
        mediaId: mediaId
    }
    if (parseInt(req.body.type) == 2) {
        for (let code of req.body.codes) {
            let client = await wechat_util.getClient(code);
            client.uploadImageMaterial(req.body.img, async function (error, result) {
                message.mediaId = result.media_id
            })
        }
    }
    var docs = await MessageModel.findByIdAndUpdate(id, message)
    if (docs) {
        res.send({
            success: '修改成功',
            data: docs
        })
    } else {
        res.send({
            err: '修改失败'
        })
    }
})

router.get('/delete', async(req, res, next) => {
    var id = req.query.id;
    var doc = await MessageModel.findByIdAndRemove(id)
    if (doc) {
        res.send({
            success: '删除成功',
            data: doc
        })
    } else {
        res.send({
            err: '删除失败'
        })
    }
})

router.get('/remove', async(req, res, next) => {
    var startTime = new Date(Number(req.query.startTime)),
        endTime = new Date(Number(req.query.endTime));
    var docs = await MessageModel.remove({
        timing_time: {
            $gte: startTime,
            $lt: endTime
        }
    })
    if (docs) {
        res.send({
            success: '删除成功',
            data: docs
        })
    } else {
        res.send({
            err: '删除失败'
        })
    }
})

router.get('/send', async(req, res, next) => {
    var id = req.query.id;
    var take_over = req.query.take_over;
    if (take_over) {
        sendUser.get_message(id);
        res.send({
            success: '发送成功'
        })
    } else {
        send.get_message(id);
        res.send({
            success: '发送成功'
        })
    }
})

async function upload(type, img_path, codes) {
    if(type == 2) {
        for (let code of codes) {
            let client = await wechat_util.getClient(code);
            return new Promise((resolve, reject) => {
                client.uploadImageMaterial(img_path, async function (error, result) {
                    console.log("error", error, "-----------------------")
                    console.log("result", result, "-----------------------")
                    resolve(result.media_id)
                })
            })
        }
    }else{
        return
    }
}

module.exports = router
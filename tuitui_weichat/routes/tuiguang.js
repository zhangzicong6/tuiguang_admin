var express = require('express');
var router = express.Router();
var TuiGuangModel = require('../model/TuiGuang.js');
var StaticsTuiGuangModel = require('../model/StaticsTuiGuang.js');
var TransferModel = require('../model/Transfer.js');
var DomainModel = require('../model/Domain.js');
var TokenArrModel = require('../model/TokenArr.js');
var BannerModel = require('../model/Banner.js');
var multer = require('multer');
var fs = require('fs')
var mem = require('../util/mem.js')
//const asyncRedis = require("async-redis");
//const redis_client = asyncRedis.createClient();

//线上
var juedui_lujing = '/home/work/tuiguang_front/project/public/images/website'

//线下
//var juedui_lujing ='../public/images/tuiguan'

var upload = multer({
  dest: juedui_lujing
});

router.post('/novel/upload', upload.single('imageFile'), function (req, res, next) {
  fs.rename(req.file.path, juedui_lujing + "/" + req.file.filename + '.jpg', function (err) {
    if (err) {
      throw err;
    }
    console.log('上传成功!');
  })
  res.send({filename: req.file.filename + '.jpg'});
})

router.post('/goTop', async(req, res, next) => {
  let message = await TuiGuangModel.findOne().sort({zIndex: -1});
  let zIndex = message.zIndex + 1;
  let result = await TuiGuangModel.findByIdAndUpdate(req.body.id, {zIndex}, {new: true});
  if(result) {
    res.send({result: result, success: "置顶成功"})
  }
});

router.post('/cancelGoTop', async(req, res, next) => {
  let result = await TuiGuangModel.findByIdAndUpdate(req.body.id, {zIndex: 0}, {new: true});
  if(result) {
    res.send({result: result, success: "已取消置顶"})
  }
});

router.post('/update', async (req, res, next) => {
  let id = '5b76aa2ac3ed4a4798d7045d';
  let messages = {
    image: req.body.image,
    link: req.body.link,
    position: req.body.position
  }
  let docs = await BannerModel.findByIdAndUpdate(id, messages)
  let docs1 = await BannerModel.find()
  res.send({success: 'ok', data: docs1})
})

router.post('/novel/add', (req, res, next) => {
  TuiGuangModel.find({id: req.body.id}, function (err, data) {
    if (err) {
      console.log("Error:" + err);
    } else {
      if (data != '') {
        res.send({err: '此id已存在'})
      } else {
        var novelInfo = {
          type: req.body.type,
          id: req.body.id,
          gonghao_id: req.body.gonghao_id,
          pageTitle: req.body.pageTitle || "",
          articleTit: req.body.articleTit || "",
          name: req.body.name,
          desc: req.body.desc,
          picurl: req.body.picurl || "",
          capter1: req.body.capter1 || "",
          capter2: req.body.capter2 || '',
          linkUrl: req.body.linkUrl || '',
          statisticsUrl1: req.body.statisticsUrl1 || '',
          statisticsUrl2: req.body.statisticsUrl2 || '',
          tokenCodes: req.body.tokenCodes || '',
          channel: req.body.channel || "",
          remarks: req.body.remarks || "",
          domain_name: req.body.domain_name || "http://novel.jtjsmp.top",
          gonghaoLogo: req.body.gonghaoLogo || "",
          finalImg: req.body.finalImg || "",
          company: req.body.company || "",
          suffix : req.body.suffix,
          isClick : req.body.isClick,
          jumpUrl : req.body.jumpUrl || "",
          isJump : req.body.isJump,
          creator: req.body.creator || "",
          bgcolor: req.body.bgcolor || "#fff"
        };
        var user = new TuiGuangModel(novelInfo)
        user.save(function (err, data) {
          if (err) {
            console.log("Error:" + err);
          } else {
            res.send({message: '创建成功'})
          }
        });
      }
    }
  })

});

router.post('/novel/delete_one', (req, res, next) => {
  var selector = {
    id: req.body.id
  }
  TuiGuangModel.find(selector, function (err, data) {
    if (err) {
      console.log("Error:" + err);
    } else {
      if (data != '') {
        TuiGuangModel.remove(selector, function (err, result) {
          res.send({message: '删除成功'})
        })
      } else {
        res.send({message: '没有此项数据'})
      }
    }
  })
})

router.get('/novel/show', async (req, res, next) => {
  let count, messages, domain_names = await DomainModel.find();
  let {page = 1, channel, creator} = req.query;
  if(creator) {
    if (channel) {
      messages = await TuiGuangModel.find({channel, creator}, {
        capter1: 0,
        capter2: 0
      }).skip((page - 1) * 20).limit(20).sort({zIndex: -1, _id: -1});
      count = await TuiGuangModel.count({channel});
    } else {
      count = await TuiGuangModel.count({});
      messages = await TuiGuangModel.find({creator}, {capter1: 0, capter2: 0}).skip((page - 1) * 20).limit(20).sort({zIndex: -1, _id: -1});
    }
  } else {
    if (channel) {
      messages = await TuiGuangModel.find({channel}, {
        capter1: 0,
        capter2: 0
      }).skip((page - 1) * 20).limit(20).sort({zIndex: -1, _id: -1});
      count = await TuiGuangModel.count({channel});
    } else {
      count = await TuiGuangModel.count({});
      messages = await TuiGuangModel.find({}, {capter1: 0, capter2: 0}).skip((page - 1) * 20).limit(20).sort({zIndex: -1, _id: -1});
    }
  }
  if(messages.length > 0) {
    res.send({code: 1, data: messages, domain_names: domain_names, count: count, msg: "查询成功"})
  } else {
    messages = await TuiGuangModel.find({creator: creator || ""}, {capter1: 0, capter2: 0}).skip((page - 1) * 20).limit(20).sort({zIndex: -1, _id: -1});
    messages.length === 0 && (messages = await TuiGuangModel.find({}, {capter1: 0, capter2: 0}).skip((page - 1) * 20).limit(20).sort({zIndex: -1, _id: -1}));
    res.send({code: -1, data: messages, domain_names: domain_names, count: count, msg: "暂时没有相关数据"})
  }
});

router.get('/novel/get_content', async (req, res, next) => {
  var id = req.query._id
  var messages = await TuiGuangModel.findById(id);
  res.send({data: messages})
})

router.post('/novel/update', async (req, res, next) => {
  var id = req.body._id
  var message = {
    type: req.body.type,
    id: req.body.id,
    gonghao_id: req.body.gonghao_id,
    pageTitle: req.body.pageTitle || "",
    articleTit: req.body.articleTit || "",
    name: req.body.name,
    desc: req.body.desc,
    picurl: req.body.picurl || "",
    capter1: req.body.capter1 || '',
    capter2: req.body.capter2 || '',
    linkUrl: req.body.linkUrl || '',
    statisticsUrl1: req.body.statisticsUrl1 || "",
    statisticsUrl2: req.body.statisticsUrl2 || '',
    tokenCodes: req.body.tokenCodes || '',
    channel: req.body.channel || "",
    remarks: req.body.remarks || "",
    domain_name: req.body.domain_name || "http://novel.jtjsmp.top",
    gonghaoLogo: req.body.gonghaoLogo || "",
    finalImg: req.body.finalImg || "",
    company: req.body.company || "",
    suffix : req.body.suffix,
    isClick : req.body.isClick,
    creator: req.body.creator || "",
    jumpUrl : req.body.jumpUrl || "",
    isJump : req.body.isJump,
    bgcolor: req.body.bgcolor || "#fff"
  };
  if (req.body.capter1) {
    message.capter1 = req.body.capter1
  }
  if (req.body.capter2) {
    message.capter2 = req.body.capter2
  }
  var docs = await TuiGuangModel.findByIdAndUpdate(id, message)
  if (docs) {
    mem.set('weitiao_' + id, {}, 60).then(function () {
      console.log('---------set weitiao value---------')
    })
    mem.set('singlepage_' + id, {}, 60).then(function () {
      console.log('---------set singlepage value---------')
    })
    mem.set('multipage_' + id, {}, 60).then(function () {
      console.log('---------set multipage value---------')
    })
    mem.set('capter_' + id, {}, 60).then(function () {
      console.log('---------set capter value---------')
    })
    mem.set('toutiao_' + id, {}, 60).then(function () {
      console.log('---------set toutiao value---------')
    })
    res.send({success: '修改成功'})
  } else {
    res.send({err: '修改失败'})
  }
})

router.get('/token_arr', async (req, res, next) => {
  var tokenArr = req.query.tokenArr;
  var docs = await TokenArrModel.findByIdAndUpdate('5bc06e2e2f6ed40b684421a4', {tokenArr: tokenArr})
  res.send({success: '修改成功', data: docs})
})


/*router.get('/data', async (req, res, next) => {
  let tid = req.query.tid
  if (!tid) {
    return res.send('请输入transfer id')
  }
  let transfer = await TransferModel.findOne({id: tid})
  if (!transfer) {
    return res.send('没有找到相关的transfer')
  }
  //console.log(transfer)

  var data = {
    tuiguang: [],
    duibi: []
  }

  let links = transfer.links.concat(transfer.back_urls)
  for (var i = 0; i < links.length; i++) {
    var link = links[i]
    var params = link.substr(link.lastIndexOf('/') + 1)
    var index = params.split('?')[0]
    var channel = params.split('channel=')[1]
    let uv = await redis_client.pfcount('website_tuiguang_' + channel + '_' + index);
    let cv = await redis_client.pfcount('website_tuiguang_copy_' + channel + '_' + index);
    let ip = await redis_client.pfcount('website_tuiguang_ip_' + channel + '_' + index);
    let wv = await redis_client.pfcount('website_tuiguang_wechat_' + channel + '_' + index);

    data.tuiguang.push({
      index: index,
      uv: uv,
      cv: cv,
      wv: wv,
      ip: ip
    })
    data.duibi.push({
      index: index,
      copy_uv: (cv / uv * 100).toFixed(2) + '%',
      wechat_uv: (wv / uv * 100).toFixed(2) + '%',
    })
  }
  return res.send(data)
})
*/
/*router.get('/data/del', async (req, res, next) => {
  let tid = req.query.tid
  if (!tid) {
    return res.send('请输入transfer id')
  }
  let transfer = await TransferModel.findOne({id: tid})
  if (!transfer) {
    return res.send('没有找到相关的transfer')
  }

  for (var i = 0; i < transfer.links.length; i++) {
    var link = transfer.links[i]
    var params = link.substr(link.lastIndexOf('/') + 1)
    var index = params.split('?')[0]
    var channel = params.split('channel=')[1]
    let uv = await redis_client.del('website_tuiguang_' + channel + '_' + index);
    let cv = await redis_client.del('website_tuiguang_copy_' + channel + '_' + index);
    let ip = await redis_client.del('website_tuiguang_ip_' + channel + '_' + index);
    let wv = await redis_client.del('website_tuiguang_wechat_' + channel + '_' + index);

  }
  return res.send('删除成功')
})*/


router.get('/statics/zeng', async (req, res, next) => {
  var tid = req.query.tgid;
  var datas = await StaticsTuiGuangModel.find({tuiguang_id: tid, type: 0}).sort({date: -1}).limit(24)
  return res.render('statics/zeng', {
    data: JSON.stringify(datas)
  })
})

module.exports = router;
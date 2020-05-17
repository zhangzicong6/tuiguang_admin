var express = require('express');
var router = express.Router();
var NovelTransferModel = require('../model/NovelTransfer');
var mem = require('../util/mem.js')
var request = require('request');

router.post('/', async(req, res, next) => {
  let docs = await NovelTransferModel.findOne({url: req.body.url });
  if(docs) {
    let long_url = 'http://tiexie0.wang/novel_transfer/' + docs._id;
    if(!docs.randomID){
         docs.randomID = randomWord(8)
         try{
            let short_url = await short_url_req(long_url)
            docs.shortUrl = short_url
          }catch(e){
            console.log('----------新浪短链出问题了--------------')
            console.log(e)
          }
      docs.save()
    }
    res.send({data: long_url,short_url:docs.shortUrl,self_rand:'http://tiexie0.wang/'+docs.randomID})
  } else {
    let message = new NovelTransferModel({
      url: req.body.url,
      randomID : randomWord(8)
    })
    let long_url = 'http://tiexie0.wang/novel_transfer/' + message._id;
    try{
      let short_url = await short_url_req(long_url)
      message.shortUrl = short_url
    }catch(e){
      console.log('----------新浪短链出问题了--------------')
      console.log(e)
    }
    message.save()
    res.send({data: long_url,short_url:message.shortUrl,self_rand:'http://tiexie0.wang/'+message.randomID})
  }
})


function short_url_req(long_url){
  return new Promise((resolve,reject)=>{
      let api = 'http://api.weibo.com/2/short_url/shorten.json?source=2849184197&url_long='+encodeURIComponent(long_url);
      request(api,function(error, response, body){
        try{
          let data = JSON.parse(body)
          resolve(data.urls[0].url_short)
        }catch(e){
          reject(e)
        }
      })
  });
}


function randomWord(count){
    var str = "",
    range = count,
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}


router.get('/', async(req, res, next) => {
  const docs = await NovelTransferModel.find();
  res.send({data: docs})
})

router.get('/find_one', async(req, res, next) => {
  const docs = await NovelTransferModel.find({$or:[{ url: req.query.searchUrl },{ replaceUrl: req.query.searchUrl }]});
  if(docs) {
    res.send({success: '查询成功', data: docs})
  } else {
    res.send({error: '查询条件有误，请重新输入'})
  }
})

// 修改replaceUrl
router.get('/update', async(req, res, next) => {
  let id = req.query._id, message = { replaceUrl: req.query.replaceUrl };
  const docs = await NovelTransferModel.findByIdAndUpdate(id, message,{new:true})
  res.send({success: '修改成功', data: docs})
  mem.set('novel_transfer_' + id, {}, 1 * 60).then(function () {
    //console.log('---------set transfer value---------')
  })
})

module.exports = router;
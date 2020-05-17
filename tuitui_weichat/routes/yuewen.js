var express = require('express');
var router = express.Router();
var PlatformDataModel = require('../model/PlatformData.js');


router.post('/user', async (req, res, next) => {
  //console.log('-----阅文请求body-----')
  //console.log(req.body)
  let ua= req.body.ua;
  ua = new Buffer(ua,'base64').toString();
  //let h_ua = ua.substring(0,ua.indexOf(')',ua.indexOf(')')+1)+1);
  let ip = req.body.ip;
  let pd = {
    uni_ip_h_ua : handleIpAndUa(ip,ua),
    wx_ua : ua,
    ip : ip,
    regtime : new Date(req.body.time).getTime(),
    wx_openid : req.body.open_id,
    isfollow : 1,
    seruid : req.body.appflag,
    wx_platfrom : 1
  }
  if(!pd.regtime){
    delete pd.regtime
  }
  //console.log('-----阅文回传数据-----')
  //console.log(pd)
  await PlatformDataModel.findOneAndUpdate({uni_ip_h_ua: pd.uni_ip_h_ua},
    pd,
    {upsert:true},//这个之后考虑要不要加
  )
  //console.log('-----send yuewen------')
  res.send({"code": 0});
});

function handleIpAndUa(ip, ua) {
    let uni_ip_h_ua =  (ip + ua.substring(0,ua.indexOf(')',ua.indexOf(')')+1)+1));
    /*if(uni_ip_h_ua.indexOf('iPhone')!=-1){
        let replace_start = uni_ip_h_ua.substring(0,uni_ip_h_ua.indexOf('(')+1);
        let replace_end =  uni_ip_h_ua.substring(uni_ip_h_ua.indexOf(')'))
        uni_ip_h_ua = replace_start+ 'iPhone' + replace_end
    }*/
    return uni_ip_h_ua;
}

module.exports = router;
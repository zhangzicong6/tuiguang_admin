var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var PlatformDataSchema = new Schema({
    uni_ip_h_ua: {
        type: String,
        index: true,
        unique: true
    },// ip+处理过的ua 做唯一标识
    td_url: String,
    td_clickid: {
        type : String,
        default : ''
    },
    ip: String,
    td_ua: String,    // 头条的ua 需要处理
    tuiguang_id: String,   // 链接的id
    regtime: Number,  //关注时间
    order_time : Number, //下单时间
    wx_openid: String,
    wx_userid: String,
    wx_ua: String,    // 微信的ua 需要处理
    isfollow: Number, // 是否关注 1已关注
    wx_id: String,
    wx_platfrom: Number,
    ispay: Number,    // 是否支付 1只支付
    amount: Number,   // 金额    
    seruid: String,   // 服务号id  阅文的 appflag
    td_cb_flag : {
        type : Number,
        default : 0
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
},{
    _id: false,
    timestamps: {createdAt: 'createAt', updatedAt: 'updateAt'}
});

var PlatformDataModel = db.model('PlatformData', PlatformDataSchema);
module.exports = PlatformDataModel;
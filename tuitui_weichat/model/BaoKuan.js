var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var BaoKuanSchema = new Schema({
  key:String,//分类名称
  class:String,
  title:String,//标题
  price:String,//实际价格
  reservePrice:String,//原价
  couponAmount:String,//优惠
  token:String,//淘口令
  tkCommFee:String,//返利
  shopTitle:String,//店铺名称
  pictUrl:String,//封面图
  link_url:String,//购买链接
  url:String,//商品链接
  bizMonth:String,//月销
  index:Number,//排序
  createAt: {
      type: Date,
      default: Date.now
  },
  updateAt: {
      type: Date,
      default: Date.now
  }
},{
    timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' }
});

var BaoKuanModel = db.model('BaoKuan', BaoKuanSchema);

module.exports = BaoKuanModel;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var AddFreeOrderSchema = new Schema({
  openid: String,
  type: Number,//1-返利 2-绑定邀请 3-邀请好友
  cash:Number,
  auction:Number,
  order_number:String,
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

var AddFreeOrderModel = db.model('AddFreeOrder', AddFreeOrderSchema);

module.exports = AddFreeOrderModel;
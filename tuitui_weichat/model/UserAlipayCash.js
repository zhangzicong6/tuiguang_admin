var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var UserAlipayCashSchema = new Schema({
  openid: String,
  code : String,
  payee_account: String,
  payee_real_name: String,
  wechat_number: String,
  price : Number,
  status : {type:Number,default:0},//0:审核中 1:审核成功 2:提现成功  -1:审核不成功 -2:提现失败 
  pay_date : String,
  order_id : String,
  out_biz_no : String,
  err_msg : String,
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

UserAlipayCashSchema.statics = {
    fetch_shenhe(id, cb) {
        if (id) {
            return this.find({_id: {$lt: id},status:0})
                .limit(50)
                .sort({'_id':-1})
                .exec(cb);
            }else {
                return this.find({status:0})
                .limit(50)
                .sort({'_id':-1})
                .exec(cb);
            }
        
    },
    fetch_tixian(id, cb) {
        if (id) {
            return this.find({_id: {$lt: id},status:1})
                .limit(50)
                .sort({'_id':-1})
                .exec(cb);
            }else {
                return this.find({status:1})
                .limit(50)
                .sort({'_id':-1})
                .exec(cb);
            }
        
    }
}   


var UserAlipayCashModel = db.model('UserAlipayCash', UserAlipayCashSchema);

module.exports = UserAlipayCashModel;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var UserOrderSchema = new Schema({
  openid: String,
  order_number: String,
  status: { type: Number, default:0},//0:未追踪 1:付款 2:成功 3:结算 -1:失效 
  tk_comm_fee: { type: Number, default:0},
  create_at: String,
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

UserOrderSchema.statics = {
    fetch(id, cb) {
        if (id) {
            return this.find({_id: {$lt: id},status:{$gt:-1,$lt:3}})
                .limit(50)
                .sort({'_id':-1})
                .exec(cb);
            }else {
                return this.find({status:{$gt:-1,$lt:3}})
                .limit(50)
                .sort({'_id':-1})
                .exec(cb);
            }
        
    }
}   

var UserOrderModel = db.model('UserOrder', UserOrderSchema);

module.exports = UserOrderModel;
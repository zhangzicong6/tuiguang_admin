var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var TaobaoOrderSchema = new Schema({
  order_id : String,
  create_at : String,
  goods_info : String,
  shop_name : String,
  goods_reserveprice : String,
  order_status : String,
  order_type : String,
  order_tkCommFee : String,
  goods_tag : String,
  type:{ type: Number, default:0},
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

var TaobaoOrderModel = db.model('TaobaoOrder', TaobaoOrderSchema);

module.exports = TaobaoOrderModel;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var TransferSchema = new Schema({
  id:String,
  title:String,
  links: Array,
  order : {
    type : Number,
    default : 0
  },
  remarks: {
    type: String,
    default: ''
  },
  type : {
  	type : Number,
  	default : 0
  },
  weights : Array,
  back_urls : Array,
  status : {
  	type : Number,
  	default : 0
  },
  granularity : {
  	type : Number,
  	default : 1
  },
  group: {type: String, default: "默认"}
});

var TransferModel = db.model('Transfer', TransferSchema);

module.exports = TransferModel;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var StaticsTuiGuangSchema = new Schema({
    transfer_id : String,
    tuiguang_id : String,
    channel : String,
    date : Number,
    type : Number,//0 增量 1 存量
    cv : Number,
    uv : Number,
    ip : Number
});

var StaticsTuiGuangModel = db.model('StaticsTuiGuang', StaticsTuiGuangSchema);
module.exports = StaticsTuiGuangModel;

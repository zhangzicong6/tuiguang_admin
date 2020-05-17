var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var AlipayLinkSchema = new Schema({
  name:String,  // 链接名称
  link:String   // 链接
});

var AlipayLinkModel = db.model('AlipayLink', AlipayLinkSchema);

module.exports = AlipayLinkModel;
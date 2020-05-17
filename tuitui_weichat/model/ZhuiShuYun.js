var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var ZhuiShuYunSchema = new Schema({
  gonghao_name: String,
  channel_id: String,
  tuiguang_link: String
});

var ZhuiShuYunModel = db.model('ZhuiShuYun', ZhuiShuYunSchema);
module.exports = ZhuiShuYunModel;

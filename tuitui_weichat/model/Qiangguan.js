var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var QiangguanSchema = new Schema({
  jumpLink: String,
  wechatId: String,
  baseStr : String,
  strLink : String
});

QiangguanSchema.plugin(autoIncrement.plugin, {
    model: 'Qiangguan',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

var QiangguanModel = db.model('Qiangguan', QiangguanSchema);
module.exports = QiangguanModel;


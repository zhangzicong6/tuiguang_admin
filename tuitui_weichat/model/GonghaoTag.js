var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 
// var autoIncrement = require('mongoose-auto-increment');
// autoIncrement.initialize(db);

var GonghaoTagSchema = new Schema({
  name:{ type: String, required: true }
});

// GonghaoTagSchema.plugin(autoIncrement.plugin, {
//   model: 'GonghaoTag',
//   field: 'id',
//   startAt: 1,
//   incrementBy: 1
// });

var GonghaoTagModel = db.model('GonghaoTag', GonghaoTagSchema);
module.exports = GonghaoTagModel;


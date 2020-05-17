var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var TuiguangTagSchema = new Schema({
  name:{ type: String, required: true }
});

var TuiguangTagModel = db.model('TuiguangTag', TuiguangTagSchema);
module.exports = TuiguangTagModel;


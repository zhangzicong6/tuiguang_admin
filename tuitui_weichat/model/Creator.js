var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var CreatorSchema = new Schema({
  name:{ type: String, required: true }
});

var CreatorModel = db.model('Creator', CreatorSchema);
module.exports = CreatorModel;


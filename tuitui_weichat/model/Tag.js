var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var TagSchema = new Schema({
  name:{ type: String, required: true }
});

TagSchema.plugin(autoIncrement.plugin, 'Book');

var TagModel = db.model('Tag', TagSchema);
module.exports = TagModel;


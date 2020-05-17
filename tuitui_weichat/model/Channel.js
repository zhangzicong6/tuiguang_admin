var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var ChannelSchema = new Schema({
  name:{ type: String, required: true }
});

ChannelSchema.plugin(autoIncrement.plugin, {
  model: 'Channel',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});


var ChannelModel = db.model('Channel', ChannelSchema);
module.exports = ChannelModel;


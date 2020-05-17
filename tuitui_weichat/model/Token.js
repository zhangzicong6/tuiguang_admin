var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var TokenSchema = new Schema({
  accessToken: String,
  expireTime: Number,
  code: String
});

var TokenModel = db.model('Token', TokenSchema);
module.exports = TokenModel;
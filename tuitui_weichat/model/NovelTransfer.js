var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var NovelTransferSchema = new Schema({
  url:String,
  replaceUrl: {
    type: String,
    default: ''
  },
  shortUrl: {
    type: String,
    default: ''
  },
  randomID: {
    type: String,
    default: ''
  },
});

var NovelTransferModel = db.model('NovelTransfer', NovelTransferSchema);

module.exports = NovelTransferModel;
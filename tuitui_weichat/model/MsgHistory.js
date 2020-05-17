var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var MsgHistorySchema = new Schema({
    type: String,  // 图片（image）、视频（video）、语音 （voice）、图文（news）
    media_id: String, 
    code: Number,
    msg_id: {
      type: String,
      default: ''
    }, 
    content: {
        news_item: Array
    }, 
    name: {
        type: String,
        default: ''
    }, 
    url: {
        type: String,
        default: ''
    }, 
    update_time: String,
    tagId: Number,
    timing: {
      type: Number,
      default: null
    },
    isTiming: {
      type: Boolean,
      default: false
    },
});

var MsgHistoryModel = db.model('MsgHistory', MsgHistorySchema);
module.exports = MsgHistoryModel;

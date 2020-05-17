var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var MaterialSchema = new Schema({
    type: String,  // 图片（image）、视频（video）、语音 （voice）、图文（news）
    media_id: String, 
    code: Number,
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
    timing: {
      type: Number,
      default: null
    },
    isTiming: {
      type: Boolean,
      default: false
    },
    tagId: {
      type: Number,
      default: null
    }
});

var MaterialModel = db.model('Material', MaterialSchema);
module.exports = MaterialModel;

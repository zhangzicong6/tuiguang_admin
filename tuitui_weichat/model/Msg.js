var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var Msgchema = new Schema({
    type: Number,  //0文字 1图文
    description:String,
    contents:[{
        title:String,
        description:String,
        url:String,
        picurl:String
    }]
});

Msgchema.plugin(autoIncrement.plugin, {
    model: 'Msg',
    field: 'msgId',
    startAt: 1,
    incrementBy: 1
});

var MsgModel = db.model('Msg', Msgchema);
module.exports = MsgModel;


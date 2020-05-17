var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var OpenidTagSchema = new Schema({
    openid: String,
    code: Number,
    tagid : Number
});


var OpenidTagModel = db.model('OpenidTag', OpenidTagSchema);

module.exports = OpenidTagModel;
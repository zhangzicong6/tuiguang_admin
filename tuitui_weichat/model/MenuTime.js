var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var MenuTimeSchema = new Schema({
    time:String,
    title: String,
    codes: Array,
    values: Array
});

var MenuTimeModel = db.model('MenuTime', MenuTimeSchema);
module.exports = MenuTimeModel;


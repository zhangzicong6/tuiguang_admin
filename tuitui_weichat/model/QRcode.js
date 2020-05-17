var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var QRcodeSchema = new Schema({
    name: String,
    content: String,
    code: String,
    qr_code_url: String,
    tagId:Number
});

var QRcodeModel = db.model('QRcode', QRcodeSchema);
module.exports = QRcodeModel;

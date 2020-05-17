var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var TokenArrSchema = new Schema({
    tokenArr: String
});

var TokenArrModel = db.model('TokenArr', TokenArrSchema);
module.exports = TokenArrModel;

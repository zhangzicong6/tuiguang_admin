var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var AdzoneTaoSchema = new Schema({
	content:String,
	kouling:String
});

var AdzoneTaoModel = db.model('AdzoneTao', AdzoneTaoSchema);
module.exports = AdzoneTaoModel;
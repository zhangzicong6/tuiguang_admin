var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var VideoProgramSchema = new Schema({
	program:String,
	video_url:String,
	title:String,
	share:Boolean
});

var VideoProgramModel = db.model('VideoProgram', VideoProgramSchema);
module.exports = VideoProgramModel;
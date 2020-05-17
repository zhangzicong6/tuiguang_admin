var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var BookSchema = new Schema({
	book_id:Number,
	bookname:String
});

var BookModel = db.model('Book', BookSchema);
module.exports = BookModel;
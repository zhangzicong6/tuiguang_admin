var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var CustomerSchema = new Schema({
	account: String,
	password: String,
	belongTo: String
});

var CustomerModel = db.model('Customer', CustomerSchema);
module.exports = CustomerModel;
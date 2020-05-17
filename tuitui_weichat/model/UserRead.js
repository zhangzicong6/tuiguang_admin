var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var UserReadSchema = new Schema({
	book_id:Number,
	chapte_id:Number,
	openid:String,
	index:Number,
	bookname:String,
	createAt: {
      type: Date,
      default: Date.now
	},
	updateAt: {
	  type: Date,
	  default: Date.now
	}
},{
	timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' }
});

var UserReadModel = db.model('UserRead', UserReadSchema);
module.exports = UserReadModel;
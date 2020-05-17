var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var UserBookAuthoritySchema = new Schema({
	book_id:Number,
	openid:String,
	invitees:[String],
	follows:[String],
	can_read:Number,
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

var UserBookAuthorityModel = db.model('UserBookAuthority', UserBookAuthoritySchema);
module.exports = UserBookAuthorityModel;
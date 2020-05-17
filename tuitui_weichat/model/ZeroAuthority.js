var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var ZeroAuthoritySchema = new Schema({
	openid:String,
	code:String,
	action:String,
	invitees:[String],
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

var ZeroAuthorityModel = db.model('ZeroAuthority', ZeroAuthoritySchema);
module.exports = ZeroAuthorityModel;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var UserWaitMessageSchema = new Schema({
	openid:String,
	code:String,
    status:Number,
    user_status:Number,
    action_time:Number,
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

UserWaitMessageSchema.statics = {
    fetch(id, cb) {
        if (id) {
            return this.find({_id:{$lt:id}})
                .limit(50)
                .sort({'_id':-1})
                .exec(cb);
            }else {
                return this.find()
                .limit(50)
                .sort({'_id':-1})
                .exec(cb);
            }
        
    }
}

var UserWaitMessageModel = db.model('UserWaitMessage', UserWaitMessageSchema);
module.exports = UserWaitMessageModel;
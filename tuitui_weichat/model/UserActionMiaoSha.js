var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var UserActionMiaoShaSchema = new Schema({
	openid:String,
	replay_number:Number,
	code:String,
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

UserActionMiaoShaSchema.statics = {
    fetch(id, cb) {
        if (id) {
            return this.find({_id: {$lt: id}})
                .limit(50)
                .sort({'_id':-1})
                .exec(cb);
            }else {
                return this.find({})
                .limit(50)
                .sort({'_id':-1})
                .exec(cb);
            }
        
    }
}

var UserActionMiaoShaModel = db.model('UserActionMiaoSha', UserActionMiaoShaSchema);
module.exports = UserActionMiaoShaModel;
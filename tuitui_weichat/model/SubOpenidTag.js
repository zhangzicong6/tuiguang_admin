var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var SubOpenidTagSchema = new Schema({
    openid: String,
    code: Number,
    sign: {type: Number, default: 0},
    sex: {type: String, default: "0"}
});

SubOpenidTagSchema.statics = {
    fetchTag(id, code, sex, cb){
        if (id) {
            return this.find({_id: {$lt: id}, code: code, sex: sex}, ['openid'])
                .limit(50)
                .sort({'_id': -1})
                .exec(cb);
        } else {
            return this.find({code: code, sex: sex}, ['openid'])
                .limit(50)
                .sort({'_id': -1})
                .exec(cb);
        }
    }
}


var SubOpenidTagModel = db.model('SubOpenidTag', SubOpenidTagSchema);

module.exports = SubOpenidTagModel;
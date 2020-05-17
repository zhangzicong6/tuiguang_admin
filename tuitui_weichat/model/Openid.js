var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var OpenidSchema = new Schema({
    openid: String,
    code: Number
});

OpenidSchema.statics = {
    fetch(id, code, cb){
        if (id) {
            return this.find({_id: {$lt: id}, code: code}, ['openid'])
                .limit(100)
                .sort({'_id': -1})
                .exec(cb);
        } else {
            return this.find({code: code}, ['openid'])
                .limit(100)
                .sort({'_id': -1})
                .exec(cb);
        }
    }
}

var OpenidModel = db.model('Openid', OpenidSchema);

module.exports = OpenidModel;
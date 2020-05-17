var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var UserTagSchema = new Schema({
    id: Number,
    name: String,
    code: Number,
    sex: String
});

var UserTagModel = db.model('UserTag', UserTagSchema);
module.exports = UserTagModel;


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var CoincideSchema = new Schema({
    id_str : String,
    count : {type :Number,default:0},
    codes : Array
});

var CoincideModel = db.model('Coincide', CoincideSchema);
module.exports = CoincideModel;

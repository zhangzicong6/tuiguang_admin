var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var AdMaterialSchema = new Schema({
    title: String,
    novelLink: String,
    imgList: [{
        url: String,
        sign: String,
        weight: String
    }]
});

AdMaterialSchema.plugin(autoIncrement.plugin, {
    model: 'AdMaterial',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

var AdMaterialModel = db.model('AdMaterial', AdMaterialSchema);
module.exports = AdMaterialModel;


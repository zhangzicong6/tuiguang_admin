var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var MenuSchema = new Schema({
    title:String,
    codes: Array,
    values: Array,
    individual: {
        type: Boolean,
        default: false
    },
    sex: {   // '0' 未知， '1' 男， '2' 女
        type: String,
        default: '0'
    },
    menuid: {
        type: String,
        default: null
    }
});

var MenuModel = db.model('Menu', MenuSchema);
module.exports = MenuModel;


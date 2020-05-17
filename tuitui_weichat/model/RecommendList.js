var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var RecommendListSchema = new Schema({
	type: String,           //  类型： 0微信内，1微信外
    listCode: String        //  列表页统计代码
});

RecommendListSchema.plugin(autoIncrement.plugin, {
    model: 'RecommendList',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

var RecommendListModel = db.model('RecommendList', RecommendListSchema);
module.exports = RecommendListModel;

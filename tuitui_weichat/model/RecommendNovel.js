var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var RecommendNovelSchema = new Schema({
	type: String, //  类型： 0微信内，1微信外
	id: Number, //  id
	title: String, //  文章标题
	date: String, //  日期
	linkUrl: String, //  关注跳转链接
	bannerUrl: String, //  banner
	capter: String, //  小说内容
	qrcode: String, //  二维码
	statisticsCode: String, //  统计代码
	otherCode: String, //  其他业务代码
	channel: String, //  渠道
	remarks: String, //  备注
	reading: String //  阅读人数
});

var RecommendNovelModel = db.model('RecommendNovel', RecommendNovelSchema);
module.exports = RecommendNovelModel;
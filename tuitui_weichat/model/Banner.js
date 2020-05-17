var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const connect_url = require('../conf/proj').mongodb;
const db = mongoose.createConnection(connect_url)

const BannerSchema = new Schema({
	image: String,
	link: String,
	position: String
})

const BannerModel = db.model('Banner', BannerSchema)

module.exports = BannerModel;

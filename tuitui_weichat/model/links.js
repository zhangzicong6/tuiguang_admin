var mongoose = require('mongoose');

var DB_URL = require('../conf/proj.json').mongodb;

var Schema = mongoose.Schema;

var db = mongoose.createConnection(DB_URL);

var LinksSchema = new Schema({
	links: String,
  class: String,
	title: String,
  goodsname: String,
	createAt: {
      type: Date,
      default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

var Links = db.model('Links', LinksSchema)

module.exports = Links;
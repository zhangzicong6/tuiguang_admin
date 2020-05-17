var mongoose = require('mongoose');

var DB_URL = require('../conf/proj.json').mongodb;

var Schema = mongoose.Schema;

var db = mongoose.createConnection(DB_URL);

var PageSchema = new Schema({
	pagename: String,
	class: String,
    visited: {
        type: String,
        default: '——'
    },
    copied: {
        type: String,
        default: '——'
    },
	createAt: {
      type: Date,
      default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

var Page = db.model('Page', PageSchema)

module.exports = Page;
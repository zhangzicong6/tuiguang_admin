var mongoose = require('mongoose');

var DB_URL = require('../conf/proj.json').mongodb;

var Schema = mongoose.Schema;

var db = mongoose.createConnection(DB_URL);

var MiniProgramSchema = new Schema({
	appid: String,
	appname: String,
    img: String,
    play_numbers: String,
    intro: String,
    extra: Object,
    path: String,
    isShow: Boolean,
    isBanner : Boolean,
    index : {
        type:Number,
        default:0
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

var MiniProgram = db.model('MiniProgram', MiniProgramSchema)

module.exports = MiniProgram;
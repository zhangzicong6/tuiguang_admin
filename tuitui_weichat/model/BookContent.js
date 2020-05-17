var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var BookContentSchema = new Schema({
	book_id:Number,
	bookname:String,
	chapte_id:{type: Number,unique: true},
	chapte_name:String,
	content:String,
	last_chapte:Number,
	next_chapte:Number,
	index:Number
});

BookContentSchema.statics = {
    fetch(book_id,chapte_id, cb) {
        if (chapte_id) {
            return this.find({book_id:book_id,chapte_id: {$gt: chapte_id}},{content:0})
                .limit(50)
                .sort({'chapte_id':1})
                .exec(cb);
            }else {
                return this.find({book_id:book_id},{content:0})
                .limit(50)
                .sort({'chapte_id':1})
                .exec(cb);	
            }
    }
}

var BookContentModel = db.model('BookContent', BookContentSchema);
module.exports = BookContentModel;
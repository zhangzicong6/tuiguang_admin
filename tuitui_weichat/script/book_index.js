var BookModel = require('../model/Book.js');
var BookContentModel = require('../model/BookContent.js');
var async = require('async');

function setIndex() {
	BookModel.find({},function(err,books){
		for (var i = books.length - 1; i >= 0; i--) {
			var book = books[i];
			console.log(book.bookname);
			get_book(book.book_id);
		}
	});
}

function update_index(book_id,chapte_id,index,next){
	BookContentModel.fetch(book_id,chapte_id,function(error,chaptes){
		async.each(chaptes,function(chapte,cb){
			chapte.index = index;
			console.log(chapte.index);
			index += 1;
			chapte.save();
			cb(null,null);
		},
		function(error,results){
			if(chaptes.length==50){
				return next(book_id,chaptes[49].chapte_id,index);
			}else{
				return next(null,null,1);
			}
		});
	});
}

function next_up(book_id,chapte_id,index){
		if(chapte_id){
			return update_index(book_id,chapte_id,index,next_up);
		}else{
			console.log('end');
			return;
		}
}

function get_book(book_id){
	update_index(book_id,null,1,next_up);
}

setIndex();
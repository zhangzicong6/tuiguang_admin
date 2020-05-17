var express = require('express');
var router = express.Router();
var BookContentModel = require('../model/BookContent.js');
var UserReadModel = require('../model/UserRead.js');
var UserBookAuthorityModel = require('../model/UserBookAuthority.js');

var getByConditions = function(wherestr,callback){
    BookContentModel.find(wherestr, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:成功");
            callback(res)
        }
    })
}

router.use('/continue/:book_id',function(req, res, next){
	read_continue(req,res)
});

router.get('/chaptes/:book_id', function(req, res, next) {
	var book_id = req.params.book_id;
	var wherestr = {book_id:parseInt(book_id)};
	getByConditions(wherestr,function(chaptes){
        if (chaptes) {
        	res.render('reading/dir', { chaptes: chaptes,book_id: req.params.book_id});
        }
	})
});

router.get('/read/:book_id', function(req, res, next) {
	read_chapter(req, res)
});

function read_continue(req,res){
	var book_id = req.params.book_id;
	UserReadModel.findOne({book_id:parseInt(book_id)},function(error,read){
		if(!read){
			BookContentModel.findOne({book_id:book_id,index:1},function(err,chapte){
				return res.redirect('/reading/read/'+book_id+'?chapte_id='+chapte.chapte_id);
			});
		}else{
			return res.redirect('/reading/read/'+book_id+'?chapte_id='+read.chapte_id);
		}
	});
}

function read_chapter(req,res){
	var book_id = req.params.book_id;
	var chapte_id = req.query.chapte_id;
	var index = req.query.index;
	var con = {book_id:book_id};
	if(chapte_id){
		con.chapte_id = chapte_id;
	}
	if(index){
		con.index = index;
	}
	BookContentModel.findOne(con,function(err,chapte){
		if(!chapte){
		}else{
			var read = {book_id:book_id,chapte_id:chapte.chapte_id,index:chapte.index,bookname:chapte.bookname};
	
			UserReadModel.findOneAndUpdate(
				{book_id:book_id},
				{$set:read},
				{upsert:true,rawResult:true},
				function(error,read){
					if(error){
						console.log(error);
					}
				}
			);
			res.render('reading/content', { chapte: chapte});
			// if(chapte.index >10 ){
			// 	res.send({index: chapte.index})
			// }else{
				
			// }
		}
	});
}

router.get('/:book_id', function(req, res, next) {
	var book_id = req.params.book_id;
	var chapte_id = req.query.chapte_id;
	var index = req.query.index;
	var con = {book_id:book_id};
	if(chapte_id){
		con.chapte_id = chapte_id;
	}
	if(index){
		con.index = index;
	}
	BookContentModel.findOne(con,function(err,chapte){
		if(!chapte){
		}else{
			var read = {book_id:book_id,chapte_id:chapte.chapte_id,index:chapte.index,bookname:chapte.bookname};
	
			UserReadModel.findOneAndUpdate(
				{book_id:book_id},
				{$set:read},
				{upsert:true,rawResult:true},
				function(error,read){
					if(error){
						console.log(error);
					}
				}
			);
			res.send({ chapte: chapte});
		}
	});
});

module.exports = router;
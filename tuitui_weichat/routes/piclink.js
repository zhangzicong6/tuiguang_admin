var express = require('express');
var router = express.Router();
var User = require('../model/TokenMessage.js')

var getByConditions = function(wherestr,callback){
    User.find(wherestr, function(err, res){
        if (err) {
        	console.log(111)
            console.log("Error:" + err);
        }
        else {
            console.log("Res:成功");
            callback(res)
        }
    })
}

router.get('/find', function(req, res, next) {
	var wherestr = {_id: req.query.id};
	getByConditions(wherestr,function(result){
        console.log(result[0])
        
        if (result) {
            data = {
              link_url:result[0].link_url,
              title:result[0].title,
              price:result[0].price,
              reservePrice:result[0].reservePrice,
              couponAmount:result[0].couponAmount,
              tkCommFee:result[0].tkCommFee,
              shopTitle:result[0].shopTitle,
              pictUrl:result[0].pictUrl,
              bizMonth:result[0].bizMonth,
              id:result[0]._id
            }
        }
        res.render('taobao/taobao',data)

	})
});
router.get('/get', function(req, res, next) {
    var wherestr = {_id: req.query._id};
    getByConditions(wherestr,function(result){
        res.send({data:result})
    })
});

module.exports = router;

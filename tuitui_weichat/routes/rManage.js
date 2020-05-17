var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
  res.render('r_manage/index');
});

router.get('/*',function(req,res,next){
    res.render('r_manage/index');
});

module.exports = router;
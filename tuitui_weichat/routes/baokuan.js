var express = require('express');
var router = express.Router();



router.all('/*', function(req, res, next) {
    res.render('baokuan/index');
});


module.exports = router;